// app/homeDecoration.tsx
import React, { useContext } from 'react';
import { View, Text, Image, Animated, PanResponder, StyleSheet, Dimensions, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { GameContext } from './GameContext';

const { width, height } = Dimensions.get('window');

export default function HomeDecoration() {
  // Destructure needed state and functions from context
  const { purchasedHome, homeDecorations, addHomeDecoration, furnitureInventory, availableFurniture } = useContext(GameContext);

  // Calculate how many items of each furniture type have been placed
  const placedCount = homeDecorations.reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + 1;
    return acc;
  }, {});

  if (!purchasedHome) {
    // If no home purchased, inform the user
    return (
      <View style={styles.container}>
        <Text>You haven't purchased a home yet.</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Floor plan display */}
      <Text style={styles.title}>Home Decoration</Text>
      <Image source={purchasedHome.floorPlan} style={styles.floorPlan} />
      {/* Render each placed furniture item as a draggable element */}
      {homeDecorations.map((item) => (
        <DraggableFurniture key={item.id} item={item} />
      ))}
      {/* Side panel showing furniture inventory */}
      <View style={styles.sidePanel}>
        <Text style={styles.panelTitle}>Furniture Inventory</Text>
        <ScrollView>
          {Object.entries(availableFurniture).map(([name, data]) => {
            // Calculate available count: inventory minus items already placed
            const inventoryCount = furnitureInventory[name] || 0;
            const alreadyPlaced = placedCount[name] || 0;
            const availableCount = inventoryCount - alreadyPlaced;
            return (
              <TouchableOpacity
                key={name}
                style={styles.inventoryItem}
                onPress={() => {
                  if (availableCount > 0) {
                    // Create new furniture item with default position and rotation
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
    </View>
  );
}

// DraggableFurniture: a component that makes a furniture item draggable and rotatable.
function DraggableFurniture({ item }) {
  // Create Animated values for position
  const [pan] = React.useState(new Animated.ValueXY({ x: item.x, y: item.y }));
  const [rotation, setRotation] = React.useState(item.rotation);

  // Configure pan responder for drag gestures
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset({ x: pan.x._value, y: pan.y._value });
      pan.setValue({ x: 0, y: 0 });
    },
    onPanResponderMove: Animated.event(
      [null, { dx: pan.x, dy: pan.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: () => {
      pan.flattenOffset();
    },
  });

  // Rotate the item by 90 degrees on press
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.draggable,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { rotate: `${rotation}deg` },
          ],
        },
      ]}
    >
      <TouchableOpacity onPress={handleRotate}>
        <Image source={item.image} style={styles.furnitureImage} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 24, textAlign: 'center', marginVertical: 10 },
  floorPlan: { width: width, height: height * 0.5, resizeMode: 'contain' },
  sidePanel: { position: 'absolute', right: 0, top: 50, backgroundColor: '#fff', padding: 10, borderWidth: 1, height: height * 0.5 },
  panelTitle: { fontWeight: 'bold', marginBottom: 5 },
  inventoryItem: { marginBottom: 10 },
  draggable: { position: 'absolute' },
  furnitureImage: { width: 50, height: 50 },
});