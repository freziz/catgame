// app/(tabs)/realestate.tsx
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { GameContext } from '../context/GameContext';

export default function RealEstateScreen() {
  const { 
    points, 
    purchasedHome, 
    purchasedGarden,
    availableHomes, 
    availableGardenSizes,
    buyHome, 
    upgradeHome,
    buyGarden,
    upgradeGarden 
  } = useContext(GameContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.points}>Your Points: {points.toLocaleString()}</Text>
      
      {/* Houses Section */}
      <View style={styles.section}>
        <Text style={styles.title}>House Options</Text>
        {!purchasedHome ? (
          Object.entries(availableHomes).map(([name, data]) => (
            <View key={name} style={styles.itemContainer}>
              <Text style={styles.itemText}>
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
          ))
        ) : (
          <>
            <Text style={styles.info}>Current House: {purchasedHome.type}</Text>
            {Object.entries(availableHomes)
              .filter(([name, data]) => data.cost > availableHomes[purchasedHome.type].cost)
              .map(([name, data]) => (
                <View key={name} style={styles.itemContainer}>
                  <Text style={styles.itemText}>
                    {name} - Cost: {data.cost.toLocaleString()} pts
                  </Text>
                  <TouchableOpacity
                    style={styles.buyButton}
                    onPress={() => {
                      if (upgradeHome(name)) {
                        // upgradeHome handles upgrade and notifies the user
                      } else {
                        alert("Upgrade failed or not enough points.");
                      }
                    }}
                  >
                    <Text style={styles.buttonText}>Upgrade to {name}</Text>
                  </TouchableOpacity>
                </View>
              ))
            }
          </>
        )}
      </View>
      
      {/* Gardens Section */}
      <View style={styles.section}>
        <Text style={styles.title}>Garden Options</Text>
        {!purchasedGarden ? (
          Object.entries(availableGardenSizes).map(([name, data]) => (
            <View key={name} style={styles.itemContainer}>
              <Text style={styles.itemText}>
                {name} - Cost: {data.cost.toLocaleString()} pts
              </Text>
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => {
                  if (buyGarden(name)) {
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
        ) : (
          <>
            <Text style={styles.info}>Current Garden: {purchasedGarden.type}</Text>
            {Object.entries(availableGardenSizes)
              .filter(([name, data]) => data.cost > availableGardenSizes[purchasedGarden.type].cost)
              .map(([name, data]) => (
                <View key={name} style={styles.itemContainer}>
                  <Text style={styles.itemText}>
                    {name} - Cost: {data.cost.toLocaleString()} pts
                  </Text>
                  <TouchableOpacity
                    style={styles.buyButton}
                    onPress={() => {
                      if (upgradeGarden(name)) {
                        // upgradeGarden handles upgrade and notifies the user
                      } else {
                        alert("Upgrade failed or not enough points.");
                      }
                    }}
                  >
                    <Text style={styles.buttonText}>Upgrade to {name}</Text>
                  </TouchableOpacity>
                </View>
              ))
            }
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: 'center' },
  points: { fontSize: 20, marginBottom: 10 },
  title: { fontSize: 28, marginBottom: 10 },
  info: { fontSize: 16, marginBottom: 10 },
  section: { marginBottom: 20, width: '100%' },
  itemContainer: { marginBottom: 15, alignItems: 'center' },
  itemText: { fontSize: 16, marginBottom: 5 },
  buyButton: { backgroundColor: 'purple', padding: 10, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 16 },
});
