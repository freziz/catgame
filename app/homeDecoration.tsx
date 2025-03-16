// app/homeDecoration.tsx
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
      {purchasedHome ? (
        <HomeGrid />
      ) : (
        <Text style={styles.emptyMessage}>
          No home purchased. Please buy a home first.
        </Text>
      )}
      <TouchableOpacity
        onPress={() => setSidebarVisible(!sidebarVisible)}
        style={styles.toggleSidebar}
      >
        <Text>{sidebarVisible ? "Hide Sidebar" : "Show Sidebar"}</Text>
      </TouchableOpacity>
      {sidebarVisible && (
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Furniture Inventory</Text>
          <ScrollView>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20 },
  title: { fontSize: 28, textAlign: "center", marginVertical: 10 },
  emptyMessage: { fontSize: 16, color: "#555", marginVertical: 20 },
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
  inventoryItem: { marginBottom: 10, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 5 },
  selectedItem: { backgroundColor: "#b3d9ff" },
});
