// components/DraggableItem.tsx
import React, { useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Platform,
} from 'react-native';

interface DraggableItemProps {
  item: {
    x: number;
    y: number;
    rotation?: number;
    width?: number;
    height?: number;
  };
  imageSource: any;
  onUpdate: (newProps: {
    x: number;
    y: number;
    rotation: number;
    width: number;
    height: number;
  }) => void;
}

export default function DraggableItem({ item, imageSource, onUpdate }: DraggableItemProps) {
  // Position & rotation state.
  const pan = useRef(new Animated.ValueXY({ x: item.x, y: item.y })).current;
  const [rotation, setRotation] = useState(item.rotation || 0);
  // Size state (default to 50x50 if not provided)
  const [width, setWidth] = useState(item.width || 50);
  const [height, setHeight] = useState(item.height || 50);
  // Show rotate button state (using hover on web, and tap to show on mobile)
  const [showRotate, setShowRotate] = useState(Platform.OS === 'web' ? false : false);
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
  const TAP_THRESHOLD = 5;

  // Drag pan responder for moving the item.
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setInitialPos({ x: pan.x._value, y: pan.y._value });
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        const dx = Math.abs(pan.x._value - initialPos.x);
        const dy = Math.abs(pan.y._value - initialPos.y);
        if (dx < TAP_THRESHOLD && dy < TAP_THRESHOLD) {
          if (Platform.OS === 'web') {
            onUpdate({
              x: pan.x._value,
              y: pan.y._value,
              rotation,
              width,
              height,
            });
          } else {
            setShowRotate(true);
            setTimeout(() => setShowRotate(false), 3000);
            onUpdate({
              x: pan.x._value,
              y: pan.y._value,
              rotation,
              width,
              height,
            });
          }
        } else {
          onUpdate({
            x: pan.x._value,
            y: pan.y._value,
            rotation,
            width,
            height,
          });
        }
      },
    })
  ).current;

  // Separate pan responder for the resize handle.
  const resizePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // No offset needed here.
      },
      onPanResponderMove: (evt, gestureState) => {
        // Increase width and height based on gesture dx/dy.
        // Ensure a minimum size (e.g., 20x20) so it doesn't shrink too much.
        const newWidth = Math.max(20, width + gestureState.dx);
        const newHeight = Math.max(20, height + gestureState.dy);
        setWidth(newWidth);
        setHeight(newHeight);
      },
      onPanResponderRelease: () => {
        onUpdate({
          x: pan.x._value,
          y: pan.y._value,
          rotation,
          width,
          height,
        });
      },
    })
  ).current;

  // Rotate button handler.
  const handleRotate = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    onUpdate({
      x: pan.x._value,
      y: pan.y._value,
      rotation: newRotation,
      width,
      height,
    });
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      {...(Platform.OS === 'web'
        ? {
            onMouseEnter: () => setShowRotate(true),
            onMouseLeave: () => setShowRotate(false),
          }
        : {})}
      style={[
        styles.draggable,
        {
          width,
          height,
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { rotate: `${rotation}deg` },
          ],
        },
      ]}
    >
      <Image source={imageSource} style={{ width, height }} />
      {showRotate && (
        <TouchableOpacity style={styles.rotateButton} onPress={handleRotate}>
          <Text style={styles.rotateText}>↻</Text>
        </TouchableOpacity>
      )}
      {/* Resize handle at bottom-right */}
      <Animated.View
        {...resizePanResponder.panHandlers}
        style={styles.resizeHandle}
      >
        <Text style={styles.resizeText}>⇲</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  draggable: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  rotateButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 4,
    borderRadius: 10,
  },
  rotateText: {
    color: '#fff',
    fontSize: 14,
  },
  resizeHandle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 4,
    borderTopLeftRadius: 10,
  },
  resizeText: {
    color: '#fff',
    fontSize: 14,
  },
  image: {
    resizeMode: 'contain',
  },
});