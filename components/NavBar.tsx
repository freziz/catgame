// app/components/NavBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

// Reusable NavBar component that displays at the top of each screen
export default function NavBar() {
  const router = useRouter();

  // Function to navigate to a route using expo-router
  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    // The outer container holds the scrollable navbar
    <View style={styles.navbarContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.navbar}
      >
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
        <TouchableOpacity onPress={() => navigateTo('/CatInteractionScreen')}>
          <Text style={styles.navItem}>Cats</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  navbarContainer: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#222',
    paddingVertical: 10,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  navbar: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingHorizontal: 10, 
  },
  navItem: {
    fontSize: 12, 
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingVertical: 6, 
    paddingHorizontal: 12,
    backgroundColor: '#444',
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 5, // Adds spacing between items
  },
});

export default NavBar;
