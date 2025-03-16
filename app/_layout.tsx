// app/_layout.tsx (or RootLayout.tsx)
import React from 'react';
import { Host } from 'react-native-portalize';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { GameProvider } from './context/GameContext';
import NavBar from '../components/NavBar';
import { View, StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <Host>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GameProvider>
          <View style={styles.container}>
            <NavBar />
            <Stack>
              <Stack.Screen name="HomeScreen" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </View>
        </GameProvider>
      </GestureHandlerRootView>
    </Host>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
