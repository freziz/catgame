import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Image } from 'react-native';

export default function FallingCatFood() {
  const imageSize = 50;
  const translateY = useRef(new Animated.Value(-imageSize)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  
  // Get dynamic screen width & height
  const [screenSize, setScreenSize] = useState(Dimensions.get('window'));

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize(Dimensions.get('window'));
    };

    // Listen for screen changes
    const subscription = Dimensions.addEventListener('change', updateScreenSize);

    return () => subscription.remove();
  }, []);

  // Generate a random X position using the updated screen width
  const [randomX, setRandomX] = useState(Math.random() * (screenSize.width - imageSize));

  useEffect(() => {
    const animate = () => {
      // Reset animation values
      translateY.setValue(-imageSize);
      rotateAnim.setValue(0);
      opacity.setValue(1);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: screenSize.height - imageSize,
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
        // After animation completes, pick a new random X within updated width
        setRandomX(Math.random() * (screenSize.width - imageSize));
        animate();
      });
    };
    animate();
  }, [screenSize.width, screenSize.height, imageSize, opacity, rotateAnim, translateY]);

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
