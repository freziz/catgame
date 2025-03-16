// app/components/FallingCatFood.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function FallingCatFood() {
  const imageSize = 50;
  // Use state to store the random horizontal position so we can update it each loop.
  const [randomX, setRandomX] = useState(Math.random() * (width - imageSize));
  const translateY = useRef(new Animated.Value(-imageSize)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animate = () => {
      // Reset the animated values.
      translateY.setValue(-imageSize);
      rotateAnim.setValue(0);
      opacity.setValue(1);
      
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height - imageSize,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // After the animation completes, generate a new random X for the next loop.
        setRandomX(Math.random() * (width - imageSize));
        animate();
      });
    };
    animate();
  }, [height, imageSize, opacity, rotateAnim, translateY]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [
            { translateX: randomX },
            { translateY },
            { rotate: spin },
          ],
        },
      ]}
    >
      <Image source={require('../assets/catFood.png')} style={styles.image} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
  },
  image: {
    width: 50,
    height: 50,
  },
});
