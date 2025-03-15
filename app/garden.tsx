// app/garden.tsx
import React, { useContext } from 'react';
import { View, Text, Image, Animated, PanResponder, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { GameContext } from './GameContext';

const { width, height } = Dimensions.get('window');

export default function GardenScreen() {
  const { gardenDecorations, addGardenDecoration, gardeningInventory, availableGardening } = useContext(GameContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Garden Decoration</Text>
      <View style={styles.gardenArea}>
        {gardenDecorations.map((item) => (
          <DraggableItem key={item.id} item={item} />
        ))}
      </View>
      <View style={styles.sidePanel}>
        <Text style={styles.panelTitle}>Gardening Inventory</Text>
        {Object.entries(availableGardening).map(([name, data]) => (
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
              addGardenDecoration(newItem);
            }}
          >
            <Text>{name} (Owned: {gardeningInventory[name] || 0})</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function DraggableItem({ item }) {
  const [pan] = React.useState(new Animated.ValueXY({ x: item.x, y: item.y }));
  const [rotation, setRotation] = React.useState(item.rotation);

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
        { transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate: `${rotation}deg` }] },
      ]}
    >
      <TouchableOpacity onPress={handleRotate}>
        <Image source={item.image} style={styles.itemImage} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 24, textAlign: 'center', marginVertical: 10 },
  gardenArea: { width: width, height: height * 0.5, backgroundColor: '#aaffaa' },
  sidePanel: { position: 'absolute', right: 0, top: 50, backgroundColor: '#fff', padding: 10, borderWidth: 1 },
  panelTitle: { fontWeight: 'bold', marginBottom: 5 },
  inventoryItem: { marginBottom: 10 },
  draggable: { position: 'absolute' },
  itemImage: { width: 50, height: 50 },
});