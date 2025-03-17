import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { GameContext } from './context/GameContext';
import GardenGrid from '../components/GardenGrid'; // Import the grid layout

export default function GardenDecoration() {
  const { availableGardening, gardeningInventory, selectGardenItem, selectedGardenItem, purchasedGarden } = useContext(GameContext);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Garden Decoration</Text>

      {/* Sidebar Toggle Button - ALWAYS BELOW TITLE */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.toggleSidebar}
          onPress={() => setSidebarVisible(!sidebarVisible)}
        >
          <Text>{sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}</Text>
        </TouchableOpacity>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {purchasedGarden ? (
          <GardenGrid />
        ) : (
          <Text style={styles.emptyMessage}>
            No garden purchased. Please buy a garden first.
          </Text>
        )}

        {/* Sidebar Appears Below Button */}
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: "center", 
    padding: 20,
  },
  scrollContainer: { 
    flexGrow: 1, 
    alignItems: "center", 
    paddingBottom: 50 
  },
  title: { 
    fontSize: 28, 
    textAlign: "center", 
    marginVertical: 10 
  },
  emptyMessage: { 
    fontSize: 16, 
    color: "#555", 
    marginVertical: 20 
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10, // Space between button and grid
  },
  toggleSidebar: { 
    padding: 10, 
    alignItems: "center", 
    backgroundColor: "#ddd", 
    borderRadius: 5,
    width: "90%",
  },
  sidebar: {
    position: "relative", 
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 5,
    width: "90%",
    marginTop: 20,
  },
  sidebarTitle: { fontWeight: "bold", marginBottom: 5 },
  inventoryItem: { 
    marginBottom: 10, 
    padding: 10, 
    backgroundColor: "#f9f9f9", 
    borderRadius: 5 
  },
  selectedItem: { 
    backgroundColor: "#b3d9ff" 
  },
});
