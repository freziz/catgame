// app/components/DraggableFurniture.tsx
import React, { useRef, useState } from 'react';
import { Animated, PanResponder, Image, TouchableOpacity, StyleSheet } from 'react-native';

// A draggable component for home furniture
export default function DraggableFurniture({ item }) {
  // Create a stable animated value for x and y using useRef
  const pan = useRef(new Animated.ValueXY({ x: item.x, y: item.y })).current;
  // Store current rotation (in degrees)
  const [rotation, setRotation] = useState(item.rotation);

  // Create PanResponder to handle drag gestures
  const panResponder = useRef(
    PanResponder.create({
      // Always handle the touch event
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Set the current offset to the animated value
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        // Reset the animated value to 0 for new changes
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (evt, gestureState) => {
        // Update pan.x and pan.y with gesture values
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(evt, gestureState);
      },
      onPanResponderRelease: () => {
        // Apply the offset so the new position becomes the baseline
        pan.flattenOffset();
      },
    })
  ).current;

  // Rotate by 90 degrees on tap
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  return (
    // Animated.View allows dragging; attach panResponder handlers
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.draggable,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { rotate: `${rotation}deg` },
          ],
        },
      ]}
    >
      {/* Tapping triggers rotation */}
      <TouchableOpacity onPress={handleRotate}>
        <Image source={item.image} style={styles.image} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  draggable: {
    position: 'absolute', // Must be absolute for free movement
  },
  image: {
    width: 50,
    height: 50,
  },
});