// app/(tabs)/realestate.tsx
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { GameContext } from '../GameContext';

export default function RealEstateScreen() {
  const { points, purchasedHome, availableHomes, buyHome, upgradeHome } = useContext(GameContext);

  // If no home purchased, show the list to buy a home.
  if (!purchasedHome) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.points}>Your Points: {points}</Text>
        <Text style={styles.title}>Real Estate</Text>
        {Object.entries(availableHomes).map(([name, data]) => (
          <View key={name} style={styles.homeContainer}>
            <Text style={styles.homeText}>
              {name} - Cost: {data.cost.toLocaleString()} pts
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
        ))}
      </ScrollView>
    );
  } else {
    // If a home is already purchased, show upgrade options (houses with cost greater than current house)
    const currentHouseCost = availableHomes[purchasedHome.type].cost;
    const upgradeOptions = Object.entries(availableHomes).filter(([name, data]) => data.cost > currentHouseCost);
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.points}>Your Points: {points}</Text>
        <Text style={styles.title}>Real Estate - Upgrade Options</Text>
        <Text style={styles.info}>Current House: {purchasedHome.type}</Text>
        {upgradeOptions.length > 0 ? (
          upgradeOptions.map(([name, data]) => (
            <View key={name} style={styles.homeContainer}>
              <Text style={styles.homeText}>
                {name} - Cost: {data.cost.toLocaleString()} pts
              </Text>
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => {
                  if (upgradeHome(name)) {
                    // upgradeHome handles the upgrade and notifies the user
                  } else {
                    alert("Upgrade failed or not enough points.");
                  }
                }}
              >
                <Text style={styles.buttonText}>Upgrade to {name}</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.info}>No upgrade options available.</Text>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: 'center' },
  points: { fontSize: 20, marginBottom: 10 },
  title: { fontSize: 28, marginBottom: 20 },
  info: { fontSize: 16, marginBottom: 10 },
  homeContainer: { marginBottom: 15, alignItems: 'center' },
  homeText: { fontSize: 16, marginBottom: 5 },
  buyButton: { backgroundColor: 'purple', padding: 10, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 16 },
});
