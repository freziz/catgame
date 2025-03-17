import React, { useContext, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { GameContext } from "./context/GameContext";
import HomeGrid from "../components/HomeGrid"; // Import the grid layout

export default function HomeDecoration() {
  const { purchasedHome, selectFurniture, furnitureInventory, availableFurniture, selectedFurniture } = useContext(GameContext);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Home Decoration</Text>

      {/* Sidebar Toggle Button - Positioned Between Title and Grid */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.toggleSidebar}
          onPress={() => setSidebarVisible(!sidebarVisible)}
        >
          <Text>{sidebarVisible ? "Hide Sidebar" : "Show Sidebar"}</Text>
        </TouchableOpacity>
      </View>

      {/* ScrollView Includes Both Grid and Sidebar */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {purchasedHome ? (
          <HomeGrid />
        ) : (
          <Text style={styles.emptyMessage}>
            No home purchased. Please buy a home first.
          </Text>
        )}

        {/* Sidebar Appears Below Button (Inside ScrollView) */}
        {sidebarVisible && (
          <View style={styles.sidebar}>
            <Text style={styles.sidebarTitle}>Furniture Inventory</Text>
            <ScrollView contentContainerStyle={styles.scrollSidebar}>
              {Object.entries(availableFurniture).map(([name, data]) => {
                const inventoryCount = furnitureInventory[name] || 0;
                return (
                  <TouchableOpacity
                    key={name}
                    style={[
                      styles.inventoryItem,
                      selectedFurniture?.name === name && styles.selectedItem,
                    ]}
                    onPress={() => selectFurniture(name, data.image)}
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
  container: { flex: 1, alignItems: "center", padding: 20 },
  scrollContainer: { flexGrow: 1, alignItems: "center", paddingBottom: 50 },
  title: { fontSize: 28, textAlign: "center", marginVertical: 10 },
  emptyMessage: { fontSize: 16, color: "#555", marginVertical: 20 },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10, // Space between button and grid
  },
  toggleSidebar: { 
    position: "relative", 
    marginVertical: 10, 
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
  scrollSidebar: { flexGrow: 1, paddingBottom: 20 },
  inventoryItem: { marginBottom: 10, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 5 },
  selectedItem: { backgroundColor: "#b3d9ff" },
});
