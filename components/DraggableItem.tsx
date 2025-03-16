// app/components/DraggableItem.tsx (modified resize part)
import React, { useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
} from 'react-native';

interface DraggableItemProps {
  item: {
    x: number;
    y: number;
    rotation?: number;
    size?: number;
  };
  imageSource: any;
  onUpdate: (newProps: { x: number; y: number; rotation: number; size: number }) => void;
}

export default function DraggableItem({ item, imageSource, onUpdate }: DraggableItemProps) {
  const initialSize = item.size ?? 50;
  const pan = useRef(new Animated.ValueXY({ x: item.x, y: item.y })).current;
  const [rotation, setRotation] = useState(item.rotation || 0);
  const [size, setSize] = useState(initialSize);
  const [controlsVisible, setControlsVisible] = useState(false);
  const THRESHOLD = 10;

  const dragResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        // Hide controls when dragging starts.
        setControlsVisible(false);
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (evt, gestureState) => {
        pan.flattenOffset();
        if (Math.abs(gestureState.dx) < THRESHOLD && Math.abs(gestureState.dy) < THRESHOLD) {
          // Minimal movement: toggle controls.
          setControlsVisible(prev => !prev);
        } else {
          onUpdate({ x: pan.x._value, y: pan.y._value, rotation, size });
        }
      },
    })
  ).current;

  const resizeResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Preserve aspect ratio: adjust size uniformly.
        const newSize = Math.max(20, size + gestureState.dx);
        setSize(newSize);
      },
      onPanResponderRelease: () => {
        onUpdate({ x: pan.x._value, y: pan.y._value, rotation, size });
      },
    })
  ).current;

  const handleRotate = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    onUpdate({ x: pan.x._value, y: pan.y._value, rotation: newRotation, size });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { rotate: `${rotation}deg` },
          ],
        },
      ]}
      {...dragResponder.panHandlers}
    >
      <Image source={imageSource} style={{ width: size, height: size, resizeMode: 'contain' }} />
      {controlsVisible && (
        <>
          <TouchableOpacity style={styles.rotateButton} onPress={handleRotate}>
            <Text style={styles.controlText}>↻</Text>
          </TouchableOpacity>
          <Animated.View style={styles.resizeHandle} {...resizeResponder.panHandlers}>
            <Text style={styles.controlText}>⇲</Text>
          </Animated.View>
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  rotateButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 4,
    borderRadius: 10,
  },
  resizeHandle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 4,
    borderTopLeftRadius: 10,
  },
  controlText: {
    color: '#fff',
    fontSize: 14,
  },
});
