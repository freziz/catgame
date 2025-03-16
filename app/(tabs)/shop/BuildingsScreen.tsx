// app/(tabs)/shop/BuildingsScreen.tsx
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { GameContext } from '../../GameContext';

export default function BuildingsScreen() {
  const { points, buyBuilding, passiveBuildings, availableBuildings } = useContext(GameContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.points}>Your Points: {points.toLocaleString()}</Text>
      <Text style={styles.title}>Cat Items</Text>
      {Object.entries(availableBuildings).map(([name, data]) => {
        const count = passiveBuildings[name] || 0;
        return (
          <View key={name} style={styles.itemContainer}>
            <Text style={styles.itemText}>
              {name} - Cost: {data.cost.toLocaleString()} pts | Income: {data.income} pts/sec | Owned: {count}
            </Text>
            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => {
                if (buyBuilding(name)) {
                  alert("Purchased " + name);
                } else {
                  alert("Not enough points for " + name);
                }
              }}
            >
              <Text style={styles.buttonText}>Buy {name}</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: 'center' },
  points: { fontSize: 20, marginBottom: 10 },
  title: { fontSize: 28, marginBottom: 20 },
  itemContainer: { marginBottom: 15, alignItems: 'center' },
  itemText: { fontSize: 16, marginBottom: 5 },
  buyButton: { backgroundColor: 'green', padding: 10, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 16 },
});