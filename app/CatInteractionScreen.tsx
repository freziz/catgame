import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  Image 
} from 'react-native';
import { GameContext } from './context/GameContext';

const UNLOCK_THRESHOLD = 100000;
const initialStats = { level: 1 };

const catHappy = require('../assets/cat.png');   // Happy Cat (Affection > 70)
const catNeutral = require('../assets/cat1.png'); // Neutral Cat (30 - 70 Affection)
const catSad = require('../assets/cat2.png');       // Sad Cat (Affection < 30)
const lockedPortrait = require('../assets/catLocked.png'); // Locked Cat Image

export default function CatAffectionGame() {
  const { points, totalPointsEarned, setPoints } = useContext(GameContext);
  
  const [catUnlocked, setCatUnlocked] = useState(false);
  const [catStats, setCatStats] = useState(initialStats);
  const [affection, setAffection] = useState(30); // Starts at 30
  const [experience, setExperience] = useState(0); // Tracks experience for leveling

  // Unlock the cat when totalPointsEarned reaches the threshold.
  useEffect(() => {
    if (!catUnlocked && totalPointsEarned >= UNLOCK_THRESHOLD) {
      setCatUnlocked(true);
      Alert.alert("Cat Unlocked!", "Congratulations, you have unlocked your cat!");
    }
  }, [totalPointsEarned, catUnlocked]);

  // 🌟 Affection decreases over time (FASTER DECAY for more challenge)
  useEffect(() => {
    if (!catUnlocked) return;
    const timer = setInterval(() => {
      setAffection(prev => Math.max(prev - 2, 0)); // Decrease Affection by 2 per second
    }, 1000);
    return () => clearInterval(timer);
  }, [catUnlocked]);

  // 🌟 Function to handle rewards (Prevents skipped alerts)
  const handleAffectionReward = () => {
    Alert.alert("Your cat loves you! ❤️", "You earned 100 bonus points and EXP!");
    setPoints(p => p + 100); // Reward 100 points
    setExperience(exp => exp + 20); // Gain EXP for leveling
    setAffection(50); // Reset Affection Meter
  };

  // 🌟 Give rewards when Affection reaches 100
  useEffect(() => {
    if (affection >= 100) {
      handleAffectionReward();
    }
  }, [affection]);

  // 🌟 Function to handle level-up logic
  const handleLevelUp = () => {
    const requiredExp = catStats.level * 50; // Each level needs 50 * current level EXP
    if (experience >= requiredExp) {
      Alert.alert("Level Up! 🎉", `Your cat reached Level ${catStats.level + 1}!`);
      setExperience(exp => exp - requiredExp); // Reduce experience by required amount
      setCatStats(prev => ({ ...prev, level: prev.level + 1 })); // Level up!
    }
  };

  // 🌟 Watch for Level-Up
  useEffect(() => {
    handleLevelUp();
  }, [experience]);

  // 🌟 Interactions (HARDER – lower affection gain)
  const interactWithCat = (amount) => {
    setAffection(prev => Math.min(prev + amount, 100)); // Increase Affection, max 100
  };

  // 🌟 Determine Cat Mood (Changes Image)
  const getCatMood = () => {
    if (affection > 70) return catHappy;
    if (affection >= 30) return catNeutral;
    return catSad;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Cat Interaction</Text>
      <Text style={styles.points}>Points: {points.toLocaleString()}</Text>
      
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
            Level: {catStats.level}{"\n"}
            Experience: {experience}/{catStats.level * 50}{"\n"}
            Affection: {affection.toFixed(0)}
          </Text>

          {/* Affection Bar */}
          <View style={styles.affectionBar}>
            <View style={{ ...styles.affectionFill, width: `${affection}%` }}></View>
          </View>

          {/* Interaction Buttons (HARDER – affection gain reduced) */}
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

  // Affection Bar Styles
  affectionBar: { 
    width: "80%", 
    height: 20, 
    backgroundColor: "#ddd", 
    borderRadius: 10, 
    marginBottom: 15, 
    overflow: "hidden" 
  },
  affectionFill: { 
    height: "100%", 
    backgroundColor: "#ff69b4", // Pink for Affection
    transition: "width 0.3s"
  },

  buttonRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  actionButton: { backgroundColor: '#007AFF', padding: 10, margin: 5, borderRadius: 5 },
  buttonText: { color: '#fff', fontSize: 16 },
});
