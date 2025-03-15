// app/(tabs)/index.tsx, app/(tabs)/explore.tsx, app/(tabs)/another_screen.tsx
import { View, Text, StyleSheet } from 'react-native';

export default function TabScreen(props:any) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.children || "Tab Content"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});