import React, { useState, useContext, forwardRef, useImperativeHandle } from "react";
import { View, Text, StyleSheet } from "react-native";
import { GameContext } from "../app/context/GameContext";

const GRID_WIDTH = 31; // 5 columns

// ✅ Define possible items with their spawn chances and point values
const possibleItems = [
  { emoji: "🍓", chance: 0.3, points: 10 }, // 🍓 Strawberry - 30% chance, 10 points
  { emoji: "🐟", chance: 0.1, points: 20 }, // 🐟 Fish - 10% chance, 20 points (rarer)
];

const CatMiniGame = forwardRef((props, ref) => {
  const { addPoints } = useContext(GameContext);

  // Initial grid setup
  const initialGrid = {
    topRow: Array(GRID_WIDTH).fill(null), // Empty top row for items
    bottomRow: Array(GRID_WIDTH).map((_, i) => (i % 2 === 0 ? "dark" : "light")), // Alternating grass
  };

  const [grid, setGrid] = useState(initialGrid);

  // Function to spawn an item with weighted chance
  const spawnItem = () => {
    const randomNumber = Math.random();
    let newItem = null;

    for (const item of possibleItems) {
      if (randomNumber < item.chance) {
        newItem = item.emoji;
        break;
      }
    }

    return newItem;
  };

  // Function to shift the entire grid left (simulate movement)
  const moveGrid = () => {
    const newTopRow = [...grid.topRow.slice(1)]; // Shift everything left
  
    // ✅ Ensure items spawn at the LAST column based on GRID_WIDTH
    const lastColumn = GRID_WIDTH - 1; // Always the last column
    const newItem = spawnItem();
    newTopRow[lastColumn] = newItem; // ✅ Place item at the last column
  
    // ✅ Dynamically update the grass row so it fills the entire grid width
    const lastGrassTile = grid.bottomRow[grid.bottomRow.length - 1] === "dark" ? "light" : "dark";
    const newBottomRow = [...grid.bottomRow.slice(1), lastGrassTile];
  
    // ✅ Ensure the bottomRow always matches GRID_WIDTH
    while (newBottomRow.length < GRID_WIDTH) {
      newBottomRow.push(newBottomRow[newBottomRow.length - 1] === "dark" ? "light" : "dark");
    }
  
    // ✅ If an item reaches the cat's position, collect it for points
    if (grid.topRow[0]) {
      const collectedItem = possibleItems.find(item => item.emoji === grid.topRow[0]);
      if (collectedItem) {
        addPoints(collectedItem.points); // Award points based on item
      }
    }
  
    setGrid({ topRow: newTopRow, bottomRow: newBottomRow });
  };

  // Expose `moveGrid` function so `ClickerScreen` can call it
  useImperativeHandle(ref, () => ({
    moveGrid,
  }));

  return (
    <View style={styles.container}>
      {/* Grid Wrapper to keep both rows aligned */}
      <View style={styles.gridWrapper}>
        {/* Full Grid (Two Rows) */}
        {["top", "bottom"].map((rowType, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.gridRow}>
            {Array.from({ length: GRID_WIDTH }).map((_, colIndex) => (
              <View
                key={`col-${colIndex}`}
                style={[
                  styles.gridSquare,
                  rowType === "bottom" ? (grid.bottomRow[colIndex] === "dark" ? styles.darkGrass : styles.lightGrass) : null,
                ]}
              >
                {rowType === "top" && colIndex === 0 && <Text style={styles.cat}>🐱</Text>} {/* Cat stays in place */}
                {rowType === "top" && grid.topRow[colIndex] && <Text style={styles.item}>{grid.topRow[colIndex]}</Text>} {/* Items */}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "auto", // ✅ Prevents it from taking full height
    width: "100%",
    padding: 0,
    margin: 0,
    flexShrink: 1, // ✅ Ensures it shrinks to fit content
    backgroundColor: "transparent", // ✅ Avoids unwanted white space
  },
  gridWrapper: {
    flexDirection: "column",
    borderWidth: 2,
    borderColor: "#ccc",
    padding: 5,
  },
  gridRow: {
    flexDirection: "row",
  },
  gridSquare: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cat: {
    fontSize: 24,
  },
  item: {
    fontSize: 20,
  },
  darkGrass: {
    backgroundColor: "#1CA417", // Dark green
  },
  lightGrass: {
    backgroundColor: "#2ABF25", // Light green
  },
});

export default CatMiniGame;
