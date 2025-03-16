// app/components/DraggableGardenItem.tsx
import React, { useRef, useState } from 'react';
import { Animated, PanResponder, Image, TouchableOpacity, StyleSheet } from 'react-native';

// DraggableGardenItem is used in the garden decoration page.
export default function DraggableGardenItem({ item }) {
  const pan = useRef(new Animated.ValueXY({ x: item.x, y: item.y })).current;
  const [rotation, setRotation] = useState(item.rotation);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (evt, gestureState) => {
        Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false })(evt, gestureState);
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

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
      <TouchableOpacity onPress={handleRotate}>
        <Image source={item.image} style={styles.image} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  draggable: { position: 'absolute' },
  image: { width: 50, height: 50 },
});