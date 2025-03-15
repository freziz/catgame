// app/_layout.tsx
import React from 'react';
import { Stack } from "expo-router";
import { GameProvider } from './GameContext';

export default function RootLayout() {
  return (
    <GameProvider>
      <Stack>
        <Stack.Screen name="HomeScreen" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </GameProvider>
  );
}