// app/homeDecoration.tsx
import React, { useContext, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
import { GameContext } from './GameContext';
// CHANGED: Import the global DraggableItem instead of DraggableFurniture.
import DraggableItem from '../components/DraggableItem';

export default function HomeDecoration() {
  const { purchasedHome, homeDecorations, addHomeDecoration, furnitureInventory, availableFurniture, updateHomeDecoration } = useContext(GameContext);
  
  // Count how many furniture items of each type have been placed.
  const placedCount = homeDecorations.reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const [sidebarVisible, setSidebarVisible] = useState(true);

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
      <View style={styles.floorPlanContainer}>
        <Image source={purchasedHome.floorPlan} style={styles.floorPlan} />
        {homeDecorations.map((item) => (
          // CHANGED: Use DraggableItem and pass imageSource and onUpdate callback.
          <DraggableItem 
            key={item.id} 
            item={item} 
            imageSource={item.image} 
            onUpdate={(newProps) => {
              console.log('New furniture position', item.id, newProps);
              if (updateHomeDecoration) {
                updateHomeDecoration(item.id, newProps);
              }
            }}
          />
        ))}
      </View>
      <Button
        title={sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
        onPress={() => setSidebarVisible(!sidebarVisible)}
      />
      {sidebarVisible && (
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Furniture Inventory</Text>
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
                      const newItem = {
                        id: Date.now(),
                        name,
                        x: 50,
                        y: 50,
                        rotation: 0,
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 28, textAlign: 'center', marginVertical: 10 },
  floorPlanContainer: {
    position: 'relative',
    width: '100%',
    height: '50%',
    backgroundColor: '#ccc',
    marginBottom: 20,
  },
  floorPlan: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  sidebar: {
    position: 'absolute',
    right: 10,
    top: 50,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
    width: 200,
    maxHeight: '80%',
  },
  sidebarTitle: { fontWeight: 'bold', marginBottom: 5 },
  inventoryItem: { marginBottom: 10 },
});
