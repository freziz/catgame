// app/homeDecoration.tsx
import React, { useContext, useState } from 'react';
import { View, Text, Image, Animated, PanResponder, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { GameContext } from './GameContext';

const { width, height } = Dimensions.get('window');

export default function HomeDecoration() {
  const { purchasedHome, homeDecorations, addHomeDecoration, furnitureInventory, availableFurniture } = useContext(GameContext);
  
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
      <Image source={purchasedHome.floorPlan} style={styles.floorPlan} />
      {/* Render placed furniture */}
      {homeDecorations.map((item) => (
        <DraggableFurniture key={item.id} item={item} />
      ))}
      {/* Side panel to add furniture */}
      <View style={styles.sidePanel}>
        <Text style={styles.panelTitle}>Furniture Inventory</Text>
        {Object.entries(availableFurniture).map(([name, data]) => (
          <TouchableOpacity
            key={name}
            style={styles.inventoryItem}
            onPress={() => {
              const newItem = {
                id: Date.now(),
                name,
                x: 50,
                y: 50,
                rotation: 0,
                image: data.image,
              };
              addHomeDecoration(newItem);
            }}
          >
            <Text>{name} (Owned: {furnitureInventory[name] || 0})</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function DraggableFurniture({ item }) {
  const [pan] = useState(new Animated.ValueXY({ x: item.x, y: item.y }));
  const [rotation, setRotation] = useState(item.rotation);

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
  sidePanel: { position: 'absolute', right: 0, top: 50, backgroundColor: '#fff', padding: 10, borderWidth: 1 },
  panelTitle: { fontWeight: 'bold', marginBottom: 5 },
  inventoryItem: { marginBottom: 10 },
  draggable: { position: 'absolute' },
  furnitureImage: { width: 50, height: 50 },
});