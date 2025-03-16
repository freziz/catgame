// app/(tabs)/shop/FurnitureScreen.tsx
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { GameContext } from '../../GameContext';

export default function FurnitureScreen() {
  const { points, buyShopItem, furnitureInventory, availableFurniture } = useContext(GameContext);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.points}>Your Points: {points}</Text>
      <Text style={styles.title}>House Furniture</Text>
      {Object.entries(availableFurniture).map(([name, data]) => {
        const count = furnitureInventory[name] || 0;
        return (
          <View key={name} style={styles.itemContainer}>
            <Text style={styles.itemText}>
              {name} - Cost: {data.cost.toLocaleString()} pts | Owned: {count}
            </Text>
            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => {
                if (buyShopItem('Furniture', name)) {
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
  buyButton: { backgroundColor: 'purple', padding: 10, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 16 },
});
