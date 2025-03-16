// app/_layout.tsx (or RootLayout.tsx)
import React from 'react';
import { Host } from 'react-native-portalize';
import { Stack } from 'expo-router';
import { GameProvider } from './GameContext';
import NavBar from '../components/NavBar';
import { View, StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <Host>
      <GameProvider>
        <View style={styles.container}>
          <NavBar /> {/* Render NavBar once */}
          <Stack>
            <Stack.Screen name="HomeScreen" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="CatDetail" options={{ title: 'Cat Detail' }} />
          </Stack>
        </View>
      </GameProvider>
    </Host>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
