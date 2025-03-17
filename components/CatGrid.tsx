import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { GameContext } from "../app/context/GameContext";

export default function CatGridComponent() {
  const { catAccessories, placeCatItem, rotateCatItem, removeCatItem, selectedCatItem } = useContext(GameContext);

  const gridSize = 3;
  const totalCells = gridSize * gridSize;
  const grid = Array(totalCells).fill(null);

  catAccessories.forEach((item) => {
    if (item.position < totalCells) {
      grid[item.position] = item;
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cat's Accessories</Text>
      <View style={[styles.grid, { width: gridSize * 60 }]}>
        {grid.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.gridCell}
            onPress={() => {
              if (!item && selectedCatItem) {
                placeCatItem(index);
              } else if (item) {
                rotateCatItem(item.id);
              }
            }}
            onLongPress={() => {
              if (item) {
                removeCatItem(item.id);
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
