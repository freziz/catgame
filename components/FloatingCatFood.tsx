import React, { useEffect, useRef } from "react";
import { Animated, Image, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function FloatingCatFood({ onComplete }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // Generate a random position on the screen
  const randomX = Math.random() * (width - 50);
  const randomY = Math.random() * (height - 200);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -50,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onComplete) onComplete(); // Remove after animation ends
    });
  }, []);

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: randomX,
        top: randomY,
        opacity: fadeAnim,
        transform: [{ translateY }],
      }}
    >
      <Image source={require("../assets/catFood.png")} style={{ width: 50, height: 50 }} />
    </Animated.View>
  );
}
