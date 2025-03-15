// app/(tabs)/index.tsx
import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { GameContext } from '../GameContext';
// Import the reusable NavBar
import NavBar from '../../components/NavBar';

export default function ClickerScreen() {
  const { points, handleClick, passiveBuildings } = useContext(GameContext);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <View style={styles.container}>
      {/* Display current points */}
      <Text style={styles.counter}>Points: {points}</Text>

      {/* Button to add points */}
      <TouchableOpacity style={styles.clickButton} onPress={handleClick}>
        <Text style={styles.clickText}>Get Cat Food</Text>
      </TouchableOpacity>

      {/* Toggle sidebar for passive buildings */}
      <Button title={sidebarVisible ? "Hide Sidebar" : "Show Sidebar"} onPress={() => setSidebarVisible(!sidebarVisible)} />
      {sidebarVisible && (
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Passive Buildings</Text>
          {Object.entries(passiveBuildings).map(([name, count]) => (
            <Text key={name}>{name}: {count}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  counter: { fontSize: 24, marginVertical: 10 },
  clickButton: { backgroundColor: 'orange', padding: 20, borderRadius: 10 },
  clickText: { fontSize: 20, color: '#fff' },
  sidebar: {
    position: 'absolute',
    right: 10,
    top: 50,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
  },
  sidebarTitle: { fontWeight: 'bold', marginBottom: 5 },
});