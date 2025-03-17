import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { GameContext } from '../app/context/GameContext'; // Import GameContext

const { width, height } = Dimensions.get('window');

export default function EmojiGame() {
  const { addPoints } = useContext(GameContext); // Access the game's point system
  const [emojis, setEmojis] = useState([]); // Active emojis

  const emojiTypes = [
    { emoji: '🐟', chance: .6, points: 5 },  // 60% chance
    { emoji: '🐭', chance: .3, points: 10 }, // 30% chance
    { emoji: '🐱', chance: .1, points: 100 }, // 10% chance
  ];

  // Function to randomly spawn emojis while playing
  useEffect(() => {
    const interval = setInterval(() => {
      const randomValue = Math.random();
      let selectedEmoji = null;

      for (const type of emojiTypes) {
        if (randomValue < type.chance) {
          selectedEmoji = type;
          break;
        }
      }

      if (selectedEmoji) {
        const newEmoji = {
          id: Math.random().toString(),
          emoji: selectedEmoji.emoji,
          points: selectedEmoji.points,
          x: Math.random() * (width - 50), // Random X position
          y: Math.random() * (height - 200) + 50, // Random Y position, avoiding navbar
        };

        setEmojis((prev) => [...prev, newEmoji]);

        // Remove the emoji after 3 seconds
        setTimeout(() => {
          setEmojis((prev) => prev.filter((e) => e.id !== newEmoji.id));
        }, 3000);
      }
    }, Math.random() * 3000 + 2000); // Random interval between 2-5 sec

    return () => clearInterval(interval);
  }, []);

  // Function to collect emoji and add points
  const collectEmoji = (id, points) => {
    addPoints(points); // Add points to the game
    setEmojis((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <>
      {/* Render emojis in random positions */}
      {emojis.map((emoji) => (
        <TouchableOpacity
          key={emoji.id}
          style={[styles.emoji, { left: emoji.x, top: emoji.y }]}
          onPress={() => collectEmoji(emoji.id, emoji.points)}
        >
          <Text style={styles.emojiText}>{emoji.emoji}</Text>
        </TouchableOpacity>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  emoji: {
    position: 'absolute',
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  emojiText: {
    fontSize: 30,
  },
});

export default EmojiGame;
