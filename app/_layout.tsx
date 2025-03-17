import React, { useEffect } from 'react';
import { Host } from 'react-native-portalize';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { GameProvider } from './context/GameContext';
import NavBar from '../components/NavBar';
import { View, StyleSheet, ScrollView } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function RootLayout() {
  useEffect(() => {
    // Allow user to rotate between portrait and landscape
    ScreenOrientation.unlockAsync();
  }, []);

  return (
    <Host>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GameProvider>
          {/* Wrap the entire app in a ScrollView to enable scrolling */}
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
              <NavBar />
              <Stack>
                <Stack.Screen name="HomeScreen" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
            </View>
          </ScrollView>
        </GameProvider>
      </GestureHandlerRootView>
    </Host>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Ensures scrolling works when content overflows
  },
  container: {
    flex: 1,
  },
});
