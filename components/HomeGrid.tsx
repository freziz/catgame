import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { GameContext } from "../app/GameContext";

export default function HomeGrid() {
  const { homeDecorations, placeFurniture, rotateFurniture, removeFurniture, selectedFurniture, purchasedHome } = useContext(GameContext);

  // Use grid size from purchasedHome; default to 3 if not available.
  const gridSize = purchasedHome?.gridSize || 3;
  const totalCells = gridSize * gridSize;
  const grid = Array(totalCells).fill(null);

  // Populate grid with existing decorations.
  homeDecorations.forEach((item) => {
    if (item.position < totalCells) {
      grid[item.position] = item;
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Home Layout</Text>
      {/* Set grid width based on gridSize */}
      <View style={[styles.grid, { width: gridSize * 60 }]}>
        {grid.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.gridCell}
            onPress={() => {
              if (!item && selectedFurniture) {
                placeFurniture(index); // Place selected item in empty cell
              } else if (item) {
                rotateFurniture(item.id); // Rotate item on tap
              }
            }}
            onLongPress={() => {
              if (item) {
                removeFurniture(item.id); // Remove item on long press
              }
            }}
          >
            {item ? (
              <Image
                source={item.image}
                style={[
                  styles.itemImage,
                  { transform: [{ rotate: `${item.rotation}deg` }] }
                ]}
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
