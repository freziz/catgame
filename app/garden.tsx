// app/garden.tsx
import React, { useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { GameContext } from './GameContext';
import DraggableItem from '../components/DraggableItem';

const { width, height } = Dimensions.get('window');

export default function GardenDecoration() {
  const {
    gardeningInventory,
    gardenDecorations,
    addGardenDecoration,
    availableGardening,
    updateGardenItemPosition, // Make sure this exists in your GameContext
  } = useContext(GameContext);

  // Count placed garden items.
  const placedCount = gardenDecorations.reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + 1;
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Garden Decoration</Text>
      {/* Garden area container with relative positioning */}
      <View style={styles.gardenArea}>
        {gardenDecorations.map((item) => (
          <DraggableItem
            key={item.id}
            item={item}
            imageSource={item.image}
            onUpdate={(newPos) => {
              console.log('New garden item position', item.id, newPos);
              // If you have an update function in context, call it here:
              if (updateGardenItemPosition) {
                updateGardenItemPosition(item.id, newPos);
              }
            }}
          />
        ))}
      </View>
      <View style={styles.sidePanel}>
        <Text style={styles.panelTitle}>Gardening Inventory</Text>
        <ScrollView>
          {Object.entries(availableGardening).map(([name, data]) => {
            const inventoryCount = gardeningInventory[name] || 0;
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
                    addGardenDecoration(newItem);
                  } else {
                    Alert.alert(
                      "No More Items",
                      `You have no more ${name} available.`
                    );
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
  // Garden area container must be relative so that the draggable items position absolutely
  gardenArea: {
    position: 'relative',
    width: width,
    height: height * 0.5,
    backgroundColor: '#aaffaa',
  },
  sidePanel: {
    position: 'absolute',
    right: 0,
    top: 50,
    backgroundColor: '#fff',
    padding: 10,
    borderWidth: 1,
    height: height * 0.5,
  },
  panelTitle: { fontWeight: 'bold', marginBottom: 5 },
  inventoryItem: { marginBottom: 10 },
});