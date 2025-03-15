// app/homeDecoration.tsx
import React, { useContext } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { GameContext } from './GameContext';
import DraggableItem from '../components/DraggableItem';

const { width, height } = Dimensions.get('window');

export default function HomeDecoration() {
  // Retrieve home-related state from the context.
  const { purchasedHome, homeDecorations, addHomeDecoration, furnitureInventory, availableFurniture } = useContext(GameContext);

  // Count how many furniture items of each type have already been placed.
  const placedCount = homeDecorations.reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + 1;
    return acc;
  }, {});

  if (!purchasedHome) {
    return (
      <View style={styles.container}>
        <Text>You haven't purchased a home yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Decoration</Text>
      {/* The floor plan container should be relative to allow absolute positioning */}
      <View style={styles.floorPlanContainer}>
        <Image source={purchasedHome.floorPlan} style={styles.floorPlan} />
        {/* Render each placed furniture item as a draggable element using the universal DraggableItem */}
        {homeDecorations.map((item) => (
          <DraggableItem
            key={item.id}
            item={item}
            imageSource={item.image}
            onUpdate={(newProps) => {
              console.log('New home decoration position', item.id, newProps);
              // Optionally, update the decoration's position in your state here.
            }}
          />
        ))}
      </View>
      {/* Side panel showing furniture inventory */}
      <View style={styles.sidePanel}>
        <Text style={styles.panelTitle}>Furniture Inventory</Text>
        <ScrollView>
          {Object.entries(availableFurniture).map(([name, data]) => {
            const inventoryCount = furnitureInventory[name] || 0;
            const alreadyPlaced = placedCount[name] || 0;
            const availableCount = inventoryCount - alreadyPlaced;
            return (
              <TouchableOpacity
                key={name}
                style={styles.inventoryItem}
                onPress={() => {
                  if (availableCount > 0) {
                    // Create new furniture item with default position, rotation, and size.
                    const newItem = {
                      id: Date.now(),
                      name,
                      x: 50,
                      y: 50,
                      rotation: 0,
                      width: 50,
                      height: 50,
                      image: data.image,
                    };
                    addHomeDecoration(newItem);
                  } else {
                    Alert.alert("No More Items", `You have no more ${name} available.`);
                  }
                }}
              >
                <Text>{name} (Available: {availableCount})</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 24, textAlign: 'center', marginVertical: 10 },
  // The floorPlanContainer must have relative positioning so that draggable items can be absolutely positioned over it.
  floorPlanContainer: { position: 'relative', width: width, height: height * 0.5 },
  floorPlan: { width: '100%', height: '100%', resizeMode: 'contain' },
  sidePanel: { position: 'absolute', right: 0, top: 50, backgroundColor: '#fff', padding: 10, borderWidth: 1, height: height * 0.5 },
  panelTitle: { fontWeight: 'bold', marginBottom: 5 },
  inventoryItem: { marginBottom: 10 },
});
