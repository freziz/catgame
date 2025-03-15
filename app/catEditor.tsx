// app/catEditor.tsx
import React, { useContext, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, Animated, PanResponder } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GameContext } from './GameContext';

export default function CatEditor() {
  // Retrieve the catId from URL parameters
  const { catId } = useLocalSearchParams();
  // Destructure global context items for cats and accessories
  const { cats, updateCatCustomization, availableCatAccessories, catAccessoriesInventory, setCatAccessoriesInventory } = useContext(GameContext);
  const router = useRouter();
  
  // Find the cat that matches the given ID
  const cat = cats.find(c => c.id == catId);
  if (!cat) {
    return (
      <View style={styles.container}>
        <Text>Cat not found.</Text>
      </View>
    );
  }
  
  // Customization state holds an array of accessories with position and rotation.
  const [customization, setCustomization] = useState(cat.customization || { accessories: [] });
  
  // Function to add an accessory from inventory to the cat.
  const addAccessory = (accessoryName) => {
    if ((catAccessoriesInventory[accessoryName] || 0) > 0) {
      // New accessory with default position and rotation
      const newAccessory = {
        name: accessoryName,
        x: 50, 
        y: 50,
        rotation: 0,
      };
      const newAccessories = [...(customization.accessories || []), newAccessory];
      setCustomization({ ...customization, accessories: newAccessories });
      updateCatCustomization(cat.id, { ...customization, accessories: newAccessories });
      // Decrement inventory count for the accessory
      setCatAccessoriesInventory(prev => ({
        ...prev,
        [accessoryName]: prev[accessoryName] - 1,
      }));
      Alert.alert("Accessory Added", `Added ${accessoryName} to your cat.`);
    } else {
      Alert.alert("Not Available", `You don't have any ${accessoryName} available.`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Your Cat</Text>
      <View style={styles.catContainer}>
        {/* Render the base cat image */}
        <Image source={require('../assets/cat.png')} style={styles.catImage} />
        {/* Overlay each accessory as draggable */}
        {customization.accessories && customization.accessories.map((acc, index) => (
          <DraggableAccessory 
            key={index} 
            accessory={acc} 
            index={index} 
            customization={customization} 
            setCustomization={setCustomization} 
            updateCatCustomization={updateCatCustomization} 
            catId={cat.id} 
          />
        ))}
      </View>
      <Text style={styles.subtitle}>Available Accessories:</Text>
      {/* List available accessories from inventory */}
      {Object.entries(availableCatAccessories).map(([name, data]) => {
        const count = catAccessoriesInventory[name] || 0;
        return (
          count > 0 && (
            <TouchableOpacity
              key={name}
              style={styles.button}
              onPress={() => addAccessory(name)}
            >
              <Text style={styles.buttonText}>Add {name} (Available: {count})</Text>
            </TouchableOpacity>
          )
        );
      })}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back to Cats</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// DraggableAccessory: Allows dragging an accessory overlay on the cat image.
function DraggableAccessory({ accessory, index, customization, setCustomization, updateCatCustomization, catId }) {
  // Use a ref for animated position
  const pan = React.useRef(new Animated.ValueXY({ x: accessory.x, y: accessory.y })).current;
  const [rotation, setRotation] = useState(accessory.rotation);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Set offset when starting the drag
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        // Update accessory position in customization state
        const newAccessories = [...(customization.accessories || [])];
        newAccessories[index] = { ...newAccessories[index], x: pan.x._value, y: pan.y._value, rotation };
        setCustomization({ ...customization, accessories: newAccessories });
        updateCatCustomization(catId, { ...customization, accessories: newAccessories });
      },
    })
  ).current;

  // Handle rotation on accessory tap
  const handleRotate = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    const newAccessories = [...(customization.accessories || [])];
    newAccessories[index] = { ...newAccessories[index], rotation: newRotation };
    setCustomization({ ...customization, accessories: newAccessories });
    updateCatCustomization(catId, { ...customization, accessories: newAccessories });
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.draggableAccessory,
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
        {/* For demonstration, using the hat image; in a complete version, dynamically load image based on accessory name */}
        <Image source={require('../assets/hat.png')} style={styles.accessoryImage} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding: 20 },
  title: { fontSize: 28, marginBottom: 10 },
  catContainer: { width: 200, height: 200, position: 'relative', marginBottom: 20 },
  catImage: { width: 200, height: 200, resizeMode: 'contain' },
  subtitle: { fontSize: 20, marginVertical: 10 },
  button: { backgroundColor: 'teal', padding: 10, borderRadius: 10, marginVertical: 5 },
  buttonText: { color: '#fff', fontSize: 16 },
  backButton: { marginTop: 20, backgroundColor: 'gray', padding: 10, borderRadius: 10 },
  draggableAccessory: {
    position: 'absolute',
  },
  accessoryImage: { width: 50, height: 50 },
});