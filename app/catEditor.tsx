// app/catEditor.tsx
import React, { useContext, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GameContext } from './GameContext';
import DraggableItem from '../components/DraggableItem';

export default function CatEditor() {
  // Retrieve the catId from URL parameters
  const { catId } = useLocalSearchParams();
  const router = useRouter();
  // Destructure global context items for cats and accessories
  const { cats, updateCatCustomization, availableCatAccessories, catAccessoriesInventory, setCatAccessoriesInventory } = useContext(GameContext);
  
  // Find the cat that matches the given ID
  const cat = cats.find(c => c.id == catId);
  if (!cat) {
    return (
      <View style={styles.container}>
        <Text>Cat not found.</Text>
      </View>
    );
  }
  
  // Customization state holds an array of accessories with position, rotation, and optional size.
  const [customization, setCustomization] = useState(
    cat.customization || { accessories: [] }
  );
  
  // Function to add an accessory from inventory to the cat.
  const addAccessory = (accessoryName) => {
    if ((catAccessoriesInventory[accessoryName] || 0) > 0) {
      // New accessory with default position, rotation, and size.
      const newAccessory = {
        name: accessoryName,
        x: 50,
        y: 50,
        rotation: 0,
        width: 50,
        height: 50,
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
        {/* Overlay each accessory as draggable using DraggableItem */}
        {customization.accessories && customization.accessories.map((acc, index) => (
          <DraggableItem
            key={index}
            item={acc}
            imageSource={
              // For demonstration, we're using the hat image for all accessories.
              // You can replace this logic to load different images based on acc.name.
              require('../assets/hat.png')
            }
            onUpdate={(newProps) => {
              const newAccessories = [...(customization.accessories || [])];
              newAccessories[index] = { ...newAccessories[index], ...newProps };
              setCustomization({ ...customization, accessories: newAccessories });
              updateCatCustomization(cat.id, { ...customization, accessories: newAccessories });
            }}
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

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding: 20 },
  title: { fontSize: 28, marginBottom: 10 },
  catContainer: { width: 200, height: 200, position: 'relative', marginBottom: 20 },
  catImage: { width: 200, height: 200, resizeMode: 'contain' },
  subtitle: { fontSize: 20, marginVertical: 10 },
  button: { backgroundColor: 'teal', padding: 10, borderRadius: 10, marginVertical: 5 },
  buttonText: { color: '#fff', fontSize: 16 },
  backButton: { marginTop: 20, backgroundColor: 'gray', padding: 10, borderRadius: 10 },
});