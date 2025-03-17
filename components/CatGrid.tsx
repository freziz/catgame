import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { GameContext } from "../app/context/GameContext";


export default function CatGridComponent() {
  const { catAccessoriesInventory, placeCatItem, rotateCatItem, removeCatItem, selectedCatItem, purchasedHome } = useContext(GameContext);

  // Use grid size from purchasedHome; default to 3x3 if not available.
  const gridSize = 3; // Always 3x3 for CatGrid
  const totalCells = gridSize * gridSize;
  const grid = Array(totalCells).fill(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cat's Accessories</Text>
      {/* Set grid width based on gridSize */}
      <View style={[styles.grid, { width: gridSize * 60 }]}>
        {grid.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.gridCell}
            onPress={() => {
              if (!item && selectedCatItem) {
                placeCatItem(index); // Place selected item in empty cell
              } else if (item) {
                rotateCatItem(item.id); // Rotate item on tap
              }
            }}
            onLongPress={() => {
              if (item) {
                removeCatItem(item.id); // Remove item on long press
              }
            }}
          >
            {item ? (
              <Image
                source={item.image}
                style={[styles.itemImage, { transform: [{ rotate: `${item.rotation}deg` }] }]}
              />
            ) : (
              <Text style={styles.emptyText}>Empty</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  gridCell: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  itemImage: { width: 50, height: 50 },
  emptyText: { fontSize: 12, color: "#aaa" },
});
