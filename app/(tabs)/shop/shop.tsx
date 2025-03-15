// app/(tabs)/shop.tsx
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BuildingsScreen from './BuildingsScreen';
import CatClothesScreen from './CatClothesScreen';
import FurnitureScreen from './FurnitureScreen';
import GardeningScreen from './GardeningScreen';

const Tab = createMaterialTopTabNavigator();

export default function ShopScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Buildings" component={BuildingsScreen} options={{ title: 'Buildings' }} />
      <Tab.Screen name="CatClothes" component={CatClothesScreen} options={{ title: 'Cat Clothes & Toys' }} />
      <Tab.Screen name="Furniture" component={FurnitureScreen} options={{ title: 'House Furniture' }} />
      <Tab.Screen name="Gardening" component={GardeningScreen} options={{ title: 'Gardening Supplies' }} />
    </Tab.Navigator>
  );
}