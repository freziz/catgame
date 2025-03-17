import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button,ImageBackground  } from "react-native";
import { GameContext } from '../context/GameContext';
import FallingFoodManager, { FallingFoodManagerHandle } from "../../components/FallingFoodManager";
import FloatingCatFood from "../../components/FloatingCatFood"; // Import floating food effect
import EmojiGame from '../../components/EmojiGame';
import CatMiniGame from '../../components/CatMiniGame';

const SPAWN_THRESHOLD = 500; // one falling food per 500 points

// ✅ Add this line to define the cost of unlocking the mini-game
const UNLOCK_COST = 500; // Cost to unlock the mini-game

const backgroundImage = require("../../assets/siamesecat.avif"); // Background image

export default function ClickerScreen() {
  const { points, handleClick, passiveBuildings, setPoints } = useContext(GameContext);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [prevSpawnPoints, setPrevSpawnPoints] = useState(points);
  const passiveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const foodManagerRef = useRef<FallingFoodManagerHandle>(null);
  const [catFood, setCatFood] = useState([]); // Track floating cat food
  
  const catGameRef = useRef(null); //walking game
  const [isUnlocked, setIsUnlocked] = useState(false); // ✅ Track if mini-game is unlocked

   // ✅ Function to unlock the mini-game
   const unlockMiniGame = () => {
    if (points >= UNLOCK_COST) {
      setPoints(points - UNLOCK_COST); // Deduct points
      setIsUnlocked(true); // Unlock the mini-game
    } else {
      alert("Not enough points to unlock!"); // Prevent unlocking without enough points
    }
  };

  // Handle Click: Add points + spawn floating cat food
  const onClick = useCallback(() => {
    handleClick();
    spawnCatFood(); // Show floating cat food effect
    if (isUnlocked) {
      catGameRef.current?.moveGrid(); //walking game // Move the mini-game only if unlocked 
    } 
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
    
    <ImageBackground source={backgroundImage} style={styles.background}>  {/* ✅ Background Image */}
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

      {/* ✅ Lock Screen (Only Shows if the Mini-Game is Locked) */}
      {!isUnlocked && (
        <View style={styles.lockScreen}>
          <Text style={styles.lockText}>🔒 Mini-Game Locked 🔒</Text>
          <Text style={styles.lockText}>Unlock for {UNLOCK_COST} points</Text>
          <TouchableOpacity style={styles.unlockButton} onPress={unlockMiniGame}>
            <Text style={styles.unlockText}>Unlock</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ✅ Mini-game only runs when unlocked */}
      {isUnlocked && (
      <View style={styles.miniGameContainer}>
          <CatMiniGame ref={catGameRef} />
      </View>
      )}

     
      {/*Emoji Game*/}
      <EmojiGame />

      {/* Render the falling food manager */}
      <FallingFoodManager ref={foodManagerRef} maxFoods={15} />

      {/* Render floating cat food effect (only one at a time) */}
      {catFood.map((id) => (
        <FloatingCatFood key={id} onComplete={() => setCatFood([])} />
      ))}
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'transparent'
  },
  counter: { fontSize: 24, marginVertical: 10, fontWeight: "bold", color: "black", borderWidth: 2, borderColor: "green", borderRadius: 5, padding: 5, },
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
  // ✅ Lock Screen Styling for walking minigame
  lockScreen: {
    position: "Relative",
    bottom: 80, // Adjust position
    backgroundColor: "rgba(213, 255, 183, 0.8)", // Dark overlay
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  unlockText: {
    fontSize: 18, // Increase text size
    fontWeight: "bold", // Make it bold
    color: "red", // Text
    textTransform: "uppercase", // Make it ALL CAPS
    letterSpacing: 1, // Add some spacing between letters
    borderWidth: 2,
    borderColor: "black",
    padding: 5,
    backgroundColor: "gold",
    borderRadius: 5,
  },
  sidebarTitle: { fontWeight: "bold", marginBottom: 5 },
  miniGameContainer: {
    maxHeight: "auto", // ✅ Limits height instead of forcing a large space
    width: "100%", // ✅ Keeps it at a reasonable width
    alignSelf: "center", // ✅ Prevents it from stretching full width
    backgroundColor: "#01FEF6", // ✅ Light background for contrast
    borderRadius: 10, // ✅ Rounded corners
    padding: 5, // ✅ Some spacing
    overflow: "hidden", // ✅ Prevents extra space inside
    flexShrink: 1, // ✅ Ensures it doesn't stretch more than needed
    position: "relative", // ✅ Allows natural placement without stretching
  },
  background: {
    flex: 1,  // ✅ Makes it cover the whole screen
    resizeMode: "cover", // ✅ Ensures it fills the screen
    justifyContent: "center", // ✅ Centers everything inside
  },
  
});
