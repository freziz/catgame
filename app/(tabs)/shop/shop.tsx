// app/(tabs)/shop.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import NavBar from '../../../components/NavBar';
import BuildingsScreen from './BuildingsScreen';
import CatClothesScreen from './CatClothesScreen';
import FurnitureScreen from './FurnitureScreen';
import GardeningScreen from './GardeningScreen';

const Tab = createMaterialTopTabNavigator();

export default function ShopScreen() {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName="Buildings"
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14 },
          tabBarStyle: { backgroundColor: '#fff' },
        }}
        style={styles.tabNavigator}
      >
        <Tab.Screen name="Buildings" component={BuildingsScreen} options={{ title: 'Buildings' }} />
        <Tab.Screen name="CatClothes" component={CatClothesScreen} options={{ title: 'Cat Clothes & Toys' }} />
        <Tab.Screen name="Furniture" component={FurnitureScreen} options={{ title: 'House Furniture' }} />
        <Tab.Screen name="Gardening" component={GardeningScreen} options={{ title: 'Gardening Supplies' }} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the container fills the screen
  },
  tabNavigator: {
    flex: 1, // Ensures the Tab Navigator occupies available space
  },
});
