// app/catEditor.tsx
import React, { useContext, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GameContext } from './GameContext';

export default function CatEditor() {
  const { catId } = useLocalSearchParams();
  const { cats, updateCatCustomization, availableCatAccessories } = useContext(GameContext);
  const router = useRouter();
  
  const cat = cats.find(c => c.id == catId);
  if (!cat) {
    return (
      <View style={styles.container}>
        <Text>Cat not found.</Text>
      </View>
    );
  }
  
  const [customization, setCustomization] = useState(cat.customization || { accessories: [] });
  
  const addAccessory = (accessoryName) => {
    const currentAccessories = customization.accessories || [];
    const newAccessories = [...currentAccessories, accessoryName];
    setCustomization({ ...customization, accessories: newAccessories });
    updateCatCustomization(cat.id, { ...customization, accessories: newAccessories });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Your Cat</Text>
      <Image source={require('../assets/cat.png')} style={styles.catImage} />
      <Text>Accessories:</Text>
      {customization.accessories && customization.accessories.map((acc, index) => (
        <Text key={index}>{acc}</Text>
      ))}
      <Text style={styles.subtitle}>Buy Accessories</Text>
      {Object.entries(availableCatAccessories).map(([name, data]) => (
        <TouchableOpacity
          key={name}
          style={styles.button}
          onPress={() => {
            addAccessory(name);
            alert("Added " + name);
          }}
        >
          <Text style={styles.buttonText}>Add {name}</Text>
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
  catImage: { width: 100, height: 100, marginBottom: 10 },
  subtitle: { fontSize: 20, marginVertical: 10 },
  button: { backgroundColor: 'teal', padding: 10, borderRadius: 10, marginVertical: 5 },
  buttonText: { color: '#fff', fontSize: 16 },
  backButton: { marginTop: 20, backgroundColor: 'gray', padding: 10, borderRadius: 10 },
});