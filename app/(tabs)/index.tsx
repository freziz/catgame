import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button,ImageBackground  } from "react-native";
import { GameContext } from '../context/GameContext';
import FallingFoodManager, { FallingFoodManagerHandle } from "../../components/FallingFoodManager";
import FloatingCatFood from "../../components/FloatingCatFood"; // Import floating food effect

const SPAWN_THRESHOLD = 500; // one falling food per 500 points

export default function ClickerScreen() {
  const { points, handleClick, passiveBuildings } = useContext(GameContext);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [prevSpawnPoints, setPrevSpawnPoints] = useState(points);
  const passiveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const foodManagerRef = useRef<FallingFoodManagerHandle>(null);
  const [catFood, setCatFood] = useState([]); // Track floating cat food

  // Handle Click: Add points + spawn floating cat food
  const onClick = useCallback(() => {
    handleClick();
    spawnCatFood(); // Show floating cat food effect
  }, [handleClick]);

  // Fix: Only allow ONE cat food to appear per click
  const spawnCatFood = () => {
    if (catFood.length >= 3) return; // Prevent multiple spawns

    const id = Date.now();
    setCatFood([id]); // Ensure only one appears

    setTimeout(() => {
      setCatFood([]); // Remove after animation
    }, 1000);
  };

  // Whenever points increase, calculate how many spawns to add based on threshold.
  useEffect(() => {
    const prevLevel = Math.floor(prevSpawnPoints / SPAWN_THRESHOLD);
    const currentLevel = Math.floor(points / SPAWN_THRESHOLD);
    if (currentLevel > prevLevel) {
      const spawnCount = currentLevel - prevLevel;
      for (let i = 0; i < spawnCount; i++) {
        foodManagerRef.current?.spawnFood();
      }
      setPrevSpawnPoints(points);
    }
  }, [points, prevSpawnPoints]);

  // Optional: Passive income spawns falling food at random intervals.
  useEffect(() => {
    if (Object.keys(passiveBuildings).length > 0) {
      if (passiveTimerRef.current) clearTimeout(passiveTimerRef.current);
      const scheduleNext = () => {
        const delay = Math.random() * 1000 + 500; // random delay between 500ms and 1500ms
        passiveTimerRef.current = setTimeout(() => {
          foodManagerRef.current?.spawnFood();
          scheduleNext();
        }, delay);
      };
      scheduleNext();
    } else {
      if (passiveTimerRef.current) clearTimeout(passiveTimerRef.current);
    }
    return () => {
      if (passiveTimerRef.current) clearTimeout(passiveTimerRef.current);
    };
  }, [passiveBuildings]);

  return (
    
    <View style={styles.screenContainer}>
      <View style={styles.container}>
        <Text style={styles.counter}>Points: {points}</Text>
        <TouchableOpacity style={styles.clickButton} onPress={onClick}>
          <Text style={styles.clickText}>Get Cat Food</Text>
        </TouchableOpacity>
        <Button
          title={sidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
          onPress={() => setSidebarVisible(!sidebarVisible)}
        />
        {sidebarVisible && (
          <View style={styles.sidebar}>
            <Text style={styles.sidebarTitle}>Cat Items</Text>
            {Object.entries(passiveBuildings).map(([name, count]) => (
              <Text key={name}>
                {name}: {count}
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* Render the falling food manager */}
      <FallingFoodManager ref={foodManagerRef} maxFoods={25} />

      {/* Render floating cat food effect (only one at a time) */}
      {catFood.map((id) => (
        <FloatingCatFood key={id} onComplete={() => setCatFood([])} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#eee'
  },
  counter: { fontSize: 24, marginVertical: 10 },
  clickButton: {
    backgroundColor: "orange",
    padding: 20,
    borderRadius: 10,
    margin: 50,
  },
  clickText: { fontSize: 20, color: "#fff" },
  sidebar: {
    position: "absolute",
    right: 10,
    top: 50,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 5,
  },
  sidebarTitle: { fontWeight: "bold", marginBottom: 5 },
});
