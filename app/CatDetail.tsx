// app/CatDetail.tsx
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GameContext } from './GameContext';
import DraggableItem from '../components/DraggableItem';

export default function CatDetail() {
  // Retrieve the catId from URL parameters
  const { catId } = useLocalSearchParams();
  const router = useRouter();

  // Destructure needed values from the game context
  const {
    cats,
    updateCatCustomization,
    catAccessoriesInventory,
    setCatAccessoriesInventory,
  } = useContext(GameContext);

  // Find the cat with the given ID
  const cat = cats.find((c) => c.id == catId);
  if (!cat) {
    return (
      <View style={styles.container}>
        <Text>Cat not found.</Text>
      </View>
    );
  }

  // Use local state for the cat’s customization (accessories)
  const [customization, setCustomization] = useState(
    cat.customization || { accessories: [] }
  );

  // Only allow these two accessories on this screen
  const allowedAccessories = ['Hat', 'Bowtie'];

  // Function to add an accessory (only if it was purchased)
  const addAccessory = (accessoryName: string) => {
    if ((catAccessoriesInventory[accessoryName] || 0) > 0) {
      // Create a new accessory with default properties.
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
      // Deduct one from the inventory.
      setCatAccessoriesInventory((prev: any) => ({
        ...prev,
        [accessoryName]: prev[accessoryName] - 1,
      }));
      Alert.alert('Accessory Added', `Added ${accessoryName} to your cat.`);
    } else {
      Alert.alert('Not Available', `You haven't purchased any ${accessoryName}.`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cat #{cat.id}</Text>
      <View style={styles.catContainer}>
        {/* Render the base cat image */}
        <Image source={require('../assets/cat.png')} style={styles.catImage} />
        {/* Overlay each accessory as draggable using DraggableItem */}
        {customization.accessories &&
          customization.accessories.map((acc, index) => (
            <DraggableItem
              key={index}
              item={acc}
              imageSource={
                acc.name === 'Hat'
                  ? require('../assets/hat.png')
                  : require('../assets/bowtie.png')
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
      <Text style={styles.subtitle}>Add Accessories</Text>
      {/* List available accessories from inventory */}
      {allowedAccessories.map((acc) => (
        <TouchableOpacity
          key={acc}
          style={styles.button}
          onPress={() => addAccessory(acc)}
        >
          <Text style={styles.buttonText}>
            Add {acc} (Purchased: {catAccessoriesInventory[acc] || 0})
          </Text>
        </TouchableOpacity>
      ))}
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
