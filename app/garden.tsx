// app/garden.tsx (GardenDecoration)
import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { GameContext } from './context/GameContext';
import GardenGrid from '../components/GardenGrid'; // Import the grid layout

export default function GardenDecoration() {
  const { availableGardening, gardeningInventory, selectGardenItem, selectedGardenItem, purchasedGarden } = useContext(GameContext);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Garden Decoration</Text>
      
      {purchasedGarden ? (
        <GardenGrid />
      ) : (
        <Text style={styles.emptyMessage}>
          No garden purchased. Please buy a garden first.
        </Text>
      )}
      
      {/* Toggle Sidebar using TouchableOpacity for styling */}
      <TouchableOpacity
        style={styles.toggleSidebar}
        onPress={() => setSidebarVisible(!sidebarVisible)}
      >
        <Text style={styles.toggleSidebarText}>
          {sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
        </Text>
      </TouchableOpacity>
      
      {/* Gardening Inventory Sidebar */}
      {sidebarVisible && (
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Gardening Inventory</Text>
          <ScrollView>
            {Object.entries(availableGardening).map(([name, data]) => {
              const inventoryCount = gardeningInventory[name] || 0;
              return (
                <TouchableOpacity
                  key={name}
                  style={[
                    styles.inventoryItem,
                    selectedGardenItem?.name === name && styles.selectedItem,
                  ]}
                  onPress={() => selectGardenItem(name, data.image)}
                >
                  <Text>{name} (Owned: {inventoryCount})</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20 },
  title: { fontSize: 28, textAlign: "center", marginVertical: 10 },
  emptyMessage: { fontSize: 16, color: "#555", marginVertical: 20 },
  toggleSidebar: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginVertical: 10,
  },
  toggleSidebar: { padding: 10, alignItems: "center", backgroundColor: "#ddd", marginBottom: 10 },
  sidebar: {
    position: "absolute",
    right: 10,
    top: 50,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 5,
    width: 200,
  },
  sidebarTitle: { fontWeight: "bold", marginBottom: 5 },
  inventoryItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  selectedItem: { backgroundColor: "#b3d9ff" },
});
