// app/components/GardenGrid.tsx
import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native";
import { GameContext } from "../app/context/GameContext";

const CELL_SIZE = 60;
const { width } = Dimensions.get("window");
// Calculate number of columns based on device width:
const numColumns = Math.floor(width / CELL_SIZE);
// Set a fixed number of rows (you can adjust as needed)
const numRows = 5;
const totalCells = numColumns * numRows;

export default function GardenGrid() {
  const { gardenDecorations, placeGardenItem, rotateGardenItem, removeGardenItem, selectedGardenItem } = useContext(GameContext);

  // Create an array of cells (all initially null)
  const grid = Array(totalCells).fill(null);
  // Place existing garden items into the grid based on their "position" index
  gardenDecorations.forEach((item) => {
    if (item.position < totalCells) {
      grid[item.position] = item;
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Garden Layout</Text>
      <View style={[styles.grid, { width: numColumns * CELL_SIZE }]}>
        {grid.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.cell}
            onPress={() => {
              if (!item && selectedGardenItem) {
                placeGardenItem(index); // Place the selected item here
              } else if (item) {
                rotateGardenItem(item.id); // Rotate the item on tap
              }
            }}
            onLongPress={() => {
              if (item) {
                removeGardenItem(item.id); // Remove the item on long press
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
  container: { alignItems: "center", padding: 10 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  itemImage: { width: CELL_SIZE - 10, height: CELL_SIZE - 10 },
  emptyText: { fontSize: 10, color: "#aaa" },
});
