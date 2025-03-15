// app/components/NavBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

// Reusable NavBar component that displays at the top of each screen
export default function NavBar() {
  const router = useRouter();

  // Function to navigate to a route using expo-router
  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    // The container is positioned absolutely at the top, full width
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => navigateTo('/')}>
        <Text style={styles.navItem}>Game</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateTo('/(tabs)/shop/shop')}>
        <Text style={styles.navItem}>Shop</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateTo('/(tabs)/realestate')}>
        <Text style={styles.navItem}>Real Estate</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateTo('/homeDecoration')}>
        <Text style={styles.navItem}>Home Decoration</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateTo('/garden')}>
        <Text style={styles.navItem}>Garden</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateTo('/(tabs)/cats')}>
        <Text style={styles.navItem}>Cats</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // NavBar fills the top, with horizontal spacing
  navbar: {
    width: '100%', // full width
    flexDirection: 'row', // arrange items in a row
    justifyContent: 'space-around', // space them evenly
    alignItems: 'center', // center vertically
    backgroundColor: '#ddd', // light gray background
    paddingVertical: 20, // vertical padding for comfort
    position: 'absolute', // position absolutely at the top
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100, // ensure it appears above other content
  },
  navItem: {
    fontSize: 16,
    color: 'blue',
  },
});