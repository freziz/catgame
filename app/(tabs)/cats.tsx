// app/(tabs)/cats.tsx
import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { GameContext } from '../GameContext';

export default function CatsScreen() {
  const { cats } = useContext(GameContext);
  const router = useRouter();

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.catItem}
      onPress={() => router.push(`/CatDetail?catId=${item.id}`)}
    >
      <Image source={require('../../assets/cat.png')} style={styles.catImage} />
      <Text>Cat #{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cats</Text>
      <FlatList
        data={cats}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={3}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 10 },
  title: { fontSize: 28, marginBottom: 10 },
  list: { alignItems: 'center' },
  catItem: { margin: 5, alignItems: 'center' },
  catImage: { width: 50, height: 50 },
});