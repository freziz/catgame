// app/(tabs)/realestate.tsx
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { GameContext } from '../GameContext';

export default function RealEstateScreen() {
  const { points, buyHome, purchasedHome, availableHomes } = useContext(GameContext);
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.points}>Your Points: {points}</Text>
      <Text style={styles.title}>Real Estate</Text>
      {purchasedHome ? (
        <Text style={styles.info}>You own a {purchasedHome.type}</Text>
      ) : (
        Object.entries(availableHomes).map(([name, data]) => (
          <View key={name} style={styles.homeContainer}>
            <Text style={styles.homeText}>
              {name} - Cost: {data.cost} pts
            </Text>
            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => {
                if (buyHome(name)) {
                  alert("Purchased " + name);
                } else {
                  alert("Not enough points for " + name);
                }
              }}
            >
              <Text style={styles.buttonText}>Buy {name}</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: 'center' },
  points: { fontSize: 20, marginBottom: 10 },
  title: { fontSize: 28, marginBottom: 20 },
  homeContainer: { marginBottom: 15, alignItems: 'center' },
  homeText: { fontSize: 16, marginBottom: 5 },
  buyButton: { backgroundColor: 'brown', padding: 10, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 16 },
  info: { fontSize: 18 },
});