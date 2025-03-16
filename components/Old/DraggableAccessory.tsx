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