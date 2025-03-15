import React from 'react';
import { Stack } from 'expo-router';
import { GameProvider } from './GameContext';
import NavBar from '../components/NavBar';
import { View, StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <GameProvider>
      <View style={styles.container}>
        <NavBar /> {/* Include NavBar here ONCE */}
        <Stack>
        <Stack.Screen name="HomeScreen" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="CatDetail" options={{ title: 'Cat Detail' }} />
      </Stack>
      </View>
    </GameProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});