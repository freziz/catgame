import React, { useState, useEffect, useContext } from 'react';
import CatGridComponent from "../components/CatGrid"; // Import the grid layout
import { GameContext } from './context/GameContext';

import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  Image 
} from 'react-native';

const UNLOCK_THRESHOLD = 100000;
const initialStats = { level: 1 };

const catHappy = require('../assets/cat.png');   // Happy Cat (Affection > 70)
const catNeutral = require('../assets/cat1.png'); // Neutral Cat (30 - 70 Affection)
const catSad = require('../assets/cat2.png');       // Sad Cat (Affection < 30)
const lockedPortrait = require('../assets/catLocked.png'); // Locked Cat Image

export default function CatAffectionGame() {
  const { 
    points, 
    totalPointsEarned, 
    setPoints, 
    availableCatAccessories, 
    selectCatItem, 
    selectedCatItem, 
    catAccessoriesInventory 
  } = useContext(GameContext);

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [catUnlocked, setCatUnlocked] = useState(false);
  const [catStats, setCatStats] = useState(initialStats);
  const [affection, setAffection] = useState(30);
  const [experience, setExperience] = useState(0);

  // Unlock the cat when totalPointsEarned reaches the threshold.
  useEffect(() => {
    if (!catUnlocked && totalPointsEarned >= UNLOCK_THRESHOLD) {
      setCatUnlocked(true);
      Alert.alert("Cat Unlocked!", "Congratulations, you have unlocked your cat!");
    }
  }, [totalPointsEarned, catUnlocked]);

  useEffect(() => {
    if (!catUnlocked) return;
    const timer = setInterval(() => {
      setAffection(prev => Math.max(prev - 2, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [catUnlocked]);

  const handleAffectionReward = () => {
    Alert.alert("Your cat loves you! ❤️", "You earned 100 bonus points and EXP!");
    setPoints(p => p + 100);
    setExperience(exp => exp + 20);
    setAffection(50);
  };

  useEffect(() => {
    if (affection >= 100) {
      handleAffectionReward();
    }
  }, [affection]);

  const handleLevelUp = () => {
    const requiredExp = catStats.level * 50;
    if (experience >= requiredExp) {
      Alert.alert("Level Up! 🎉", `Your cat reached Level ${catStats.level + 1}!`);
      setExperience(exp => exp - requiredExp);
      setCatStats(prev => ({ ...prev, level: prev.level + 1 }));
    }
  };

  useEffect(() => {
    handleLevelUp();
  }, [experience]);

  const interactWithCat = (amount) => {
    setAffection(prev => Math.min(prev + amount, 100));
  };

  const getCatMood = () => {
    if (affection > 70) return catHappy;
    if (affection >= 30) return catNeutral;
    return catSad;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Cat Interaction</Text>
      <Text style={styles.points}>Points: {points.toLocaleString()}</Text>

      {/* Sidebar Toggle Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.toggleSidebar}
          onPress={() => setSidebarVisible(!sidebarVisible)}
        >
          <Text>{sidebarVisible ? "Hide Sidebar" : "Show Sidebar"}</Text>
        </TouchableOpacity>
      </View>

      {/* Sidebar */}
      {sidebarVisible && (
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Cat Accessories</Text>
          <ScrollView>
            {Object.entries(availableCatAccessories).map(([name, data]) => {
              const inventoryCount = catAccessoriesInventory[name] || 0;
              return (
                <TouchableOpacity
                  key={name}
                  style={[
                    styles.inventoryItem,
                    selectedCatItem?.name === name && styles.selectedItem,
                  ]}
                  onPress={() => selectCatItem(name, data.image)}
                >
                  <Text>{name} (Owned: {inventoryCount})</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {!catUnlocked ? (
        <View style={styles.lockedContainer}>
          <Image source={lockedPortrait} style={styles.portrait} />
          <Text style={styles.lockedText}>Cat Locked</Text>
          <Text style={styles.unlockInfo}>
            Unlock at {UNLOCK_THRESHOLD.toLocaleString()} points.
          </Text>
        </View>
      ) : (
        <View style={styles.catContainer}>
          <Text style={styles.catLabel}>Your Cat</Text>
          <Image source={getCatMood()} style={styles.portrait} />
          <Text style={styles.stats}>
            Level: {catStats.level} | XP: {experience}/{catStats.level * 50} | Affection: {affection}
          </Text>

          {/* Affection Bar */}
          <View style={styles.affectionBar}>
            <View style={{ ...styles.affectionFill, width: `${affection}%` }} />
          </View>

          {/* Interaction Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionButton} onPress={() => interactWithCat(10)}>
              <Text style={styles.buttonText}>Feed 🍖</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => interactWithCat(7)}>
              <Text style={styles.buttonText}>Play 🎾</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => interactWithCat(5)}>
              <Text style={styles.buttonText}>Pet 🐾</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => interactWithCat(12)}>
              <Text style={styles.buttonText}>Rest 💤</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <CatGridComponent />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    padding: 20, 
    backgroundColor: '#fff', 
    alignItems: 'center' 
  },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  points: { fontSize: 18, marginBottom: 20 },
  lockedContainer: { alignItems: 'center' },
  lockedText: { fontSize: 24, color: 'red', marginBottom: 10 },
  unlockInfo: { fontSize: 16, color: '#555' },
  catContainer: { alignItems: 'center' },
  catLabel: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  portrait: { width: 200, height: 200, borderRadius: 100, marginBottom: 20 },
  stats: { fontSize: 16, textAlign: 'center', marginBottom: 20 },

  affectionBar: { 
    width: "80%", 
    height: 20, 
    backgroundColor: "#ddd", 
    borderRadius: 10, 
    marginBottom: 15, 
    overflow: "hidden" 
  },
  affectionFill: { height: "100%", backgroundColor: "#ff69b4" },

  buttonRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  actionButton: { backgroundColor: '#007AFF', padding: 10, margin: 5, borderRadius: 5 },
  buttonText: { color: '#fff', fontSize: 16 },
});
