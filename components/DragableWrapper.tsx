import React, { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, TouchableWithoutFeedback } from 'react-native';

interface DraggableRotatableItemProps {
  children: React.ReactNode;
  initialX?: number;
  initialY?: number;
  initialRotation?: number;
  onUpdate?: (update: { x: number; y: number; rotation: number }) => void;
}

export default function DraggableRotatableItem({
  children,
  initialX = 0,
  initialY = 0,
  initialRotation = 0,
  onUpdate = () => {},
}: DraggableRotatableItemProps) {
  // Committed state for position and rotation.
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [rotation, setRotation] = useState(initialRotation);

  // Animated value for current position.
  const pan = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;

  // Update animated value when the committed position changes.
  useEffect(() => {
    pan.setValue(position);
  }, [position, pan]);

  // We'll decide between a drag and a tap.
  const DRAG_THRESHOLD = 10; // pixels
  let gestureDetected = false;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      
      onPanResponderGrant: (evt, gestureState) => {
        gestureDetected = false;
        // Set offset to the current committed position.
        pan.setOffset({ x: position.x, y: position.y });
        pan.setValue({ x: 0, y: 0 });
      },
      
      onPanResponderMove: (evt, gestureState) => {
        if (!gestureDetected && Math.sqrt(gestureState.dx ** 2 + gestureState.dy ** 2) > DRAG_THRESHOLD) {
          gestureDetected = true;
        }
        pan.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      
      onPanResponderRelease: (evt, gestureState) => {
        // Merge the offset into pan.x/y.
        pan.flattenOffset();
        if (gestureDetected) {
          // It was a drag: update the committed position.
          const newX = pan.x._value;
          const newY = pan.y._value;
          setPosition({ x: newX, y: newY });
          onUpdate({ x: newX, y: newY, rotation });
        } else {
          // It was a tap: update rotation by 90° without changing position.
          const newRotation = (rotation + 90) % 360;
          setRotation(newRotation);
          onUpdate({ x: position.x, y: position.y, rotation: newRotation });
          // Leave pan value as is.
        }
      },
      
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  return (
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
      {/* Wrap children in TouchableWithoutFeedback to avoid interfering with gestures */}
      <TouchableWithoutFeedback onPress={() => {}}>
        {children}
      </TouchableWithoutFeedback>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  draggable: {
    position: 'absolute',
  },
});