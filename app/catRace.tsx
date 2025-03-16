// app/(tabs)/catRace.tsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { GameContext } from './context/GameContext';

const { width } = Dimensions.get('window');

export default function CatRace() {
  const { cats } = useContext(GameContext);
  // Create animated values for each cat's horizontal position
  const [catPositions, setCatPositions] = useState(
    cats.map(() => new Animated.Value(0))
  );
  

  // Start race: animate cats from left to right continuously
  useEffect(() => {
    catPositions.forEach((pos, index) => {
      Animated.loop(
        Animated.timing(pos, {
          toValue: width - 100, // race across the screen
          duration: 10000,
          useNativeDriver: false,
        })
      ).start();
    });
  }, [catPositions]);

  // Function to boost a cat when tapped
  const boostCat = (index) => {
    Animated.timing(catPositions[index], {
      toValue: width - 50,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => {
      // Reset the position after boost
      catPositions[index].setValue(0);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cat Race</Text>
      {cats.map((cat, index) => (
        <TouchableOpacity key={cat.id} onPress={() => boostCat(index)}>
          <Animated.Image
            source={require('../assets/cat.png')}
            style={[styles.catImage, { left: catPositions[index] }]}
          />
        </TouchableOpacity>
      ))}
      <Text style={styles.instructions}>Tap a cat to boost its speed!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, textAlign: 'center', marginBottom: 20 },
  catImage: { width: 50, height: 50, position: 'absolute', top: 100 },
  instructions: { textAlign: 'center', marginTop: 50, fontSize: 16 },
});