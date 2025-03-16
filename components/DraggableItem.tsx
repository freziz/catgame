// app/components/DraggableItem.tsx
import React from "react";
import { Image, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

export default function DraggableItem({ item, imageSource, gardenBounds, onUpdate }) {
  // Shared values for movement, scaling, and rotation
  const translateX = useSharedValue(item.x || 0);
  const translateY = useSharedValue(item.y || 0);
  const scale = useSharedValue(item.scale || 1);
  const rotation = useSharedValue(item.rotation || 0);

  // Function to keep objects inside garden
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  // Function to safely update position
  const onDragEnd = () => {
    if (onUpdate && typeof onUpdate === "function") {
      try {
        runOnJS(onUpdate)({
          x: translateX.value,
          y: translateY.value,
          scale: scale.value,
          rotation: rotation.value,
        });
      } catch (error) {
        console.error("Error updating item position:", error);
      }
    }
  };

  // Gesture handlers
  const panHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      // Clamp values to stay inside the garden
      translateX.value = clamp(ctx.startX + event.translationX, gardenBounds.left, gardenBounds.right);
      translateY.value = clamp(ctx.startY + event.translationY, gardenBounds.top, gardenBounds.bottom);
    },
    onEnd: () => runOnJS(onDragEnd)(),
  });

  const pinchHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startScale = scale.value;
    },
    onActive: (event, ctx) => {
      scale.value = Math.max(0.5, Math.min(3, ctx.startScale * event.scale)); // Prevent too small/large scaling
    },
    onEnd: () => runOnJS(onDragEnd)(),
  });

  const rotationHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startRotation = rotation.value;
    },
    onActive: (event, ctx) => {
      rotation.value = ctx.startRotation + event.rotation;
    },
    onEnd: () => runOnJS(onDragEnd)(),
  });

  // Animated styles for transformations
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}rad` },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureHandlerRootView>
      <PanGestureHandler onGestureEvent={panHandler}>
        <Animated.View style={[styles.container, animatedStyle]}>
          <RotationGestureHandler onGestureEvent={rotationHandler}>
            <Animated.View>
              <PinchGestureHandler onGestureEvent={pinchHandler}>
                <Animated.View>
                  <Image source={imageSource} style={styles.image} />
                </Animated.View>
              </PinchGestureHandler>
            </Animated.View>
          </RotationGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});
