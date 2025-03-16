// app/GameContext.tsx
import React, { createContext, useState, useEffect } from 'react';

// Create the context so all components can share global state
export const GameContext = createContext(null);

// Configuration objects for each category

// Passive buildings provide passive income.
const availableBuildings = { 
  "Tanbark 🍂": { cost: 50, income: 1 },
  "Tiny Ball 🔴": { cost: 250, income: 2 },
  "Football 🏈": { cost: 2500, income: 1 },
  "Teddy Bear 🧸": { cost: 50000, income: 1 },
  "Stuffed Snowman ⛄": { cost: 2000000, income: 1 },
  "Fern's Bird 🦜": { cost: 175000000, income: 1 },
};

// Furniture items for decorating the home.
const availableFurniture = {
  "Chair 🪑": { cost: 25000, image: require('../assets/sofa.png') },
  "Table 🍽️": { cost: 75000, image: require('../assets/table.png') },
  "Sofa 🛋️": { cost: 150000, image: require('../assets/sofa.png') },
  "Bed 🛌": { cost: 350000, image: require('../assets/table.png') }
};

// Gardening items.
const availableGardening = { 
  "Garden Chair 💺": { cost: 35000, image: require('../assets/bench.png') },
  "Fountain ⛲": { cost: 1000000, image: require('../assets/fountain.png') }, 
};

// Cat accessories.
const availableCatAccessories = { 
  "Hat 🎩": { cost: 50, image: require('../assets/hat.png') }, 
  "Bowtie 🎀": { cost: 30, image: require('../assets/bowtie.png') } 
};

// Homes available for purchase.
// (For upgrades, we’ll assume grid sizes as follows: Shack = 3, Regular House = 4, Garden House = 5, Castle = 6)
const availableHomes = { 
  "Shack 🏚️": { cost: 1000000, floorPlan: require('../assets/small_house.png'), gridSize: 3 }, 
  "Regular House 🏠": { cost: 100000000, floorPlan: require('../assets/large_house.png'), gridSize: 4 },
  "Garden House 🏡": { cost: 500000000, floorPlan: require('../assets/large_house.png'), gridSize: 5 },
  "Castle 🏰": { cost: 1000000000, floorPlan: require('../assets/large_house.png'), gridSize: 6 },
};

const POINTS_PER_CAT = 150;

export function GameProvider({ children }) {
  // Game state initialization
  const [points, setPoints] = useState(1000000000);
  const [totalPointsEarned, setTotalPointsEarned] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [cats, setCats] = useState([]);
  const [passiveBuildings, setPassiveBuildings] = useState({});
  const [furnitureInventory, setFurnitureInventory] = useState({});
  const [gardeningInventory, setGardeningInventory] = useState({});
  const [catAccessoriesInventory, setCatAccessoriesInventory] = useState({});
  const [purchasedHome, setPurchasedHome] = useState(null);
  const [homeDecorations, setHomeDecorations] = useState([]);
  const [gardenDecorations, setGardenDecorations] = useState([]);

  // Passive income system
  useEffect(() => {
    const interval = setInterval(() => {
      let totalIncome = 0;
      for (const building in passiveBuildings) {
        totalIncome += passiveBuildings[building] * availableBuildings[building].income;
      }
      if (totalIncome > 0) {
        addPoints(totalIncome);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [passiveBuildings]);

  const addPoints = (amount) => {
    setPoints(prev => prev + amount);
    setTotalPointsEarned(prev => {
      const newTotal = prev + amount;
      const expectedCats = Math.floor(newTotal / POINTS_PER_CAT);
      if (expectedCats > cats.length) {
        setCats(prevCats => {
          const newCats = [...prevCats];
          while (newCats.length < expectedCats) {
            newCats.push({ id: newCats.length, customization: {} });
          }
          return newCats;
        });
      }
      return newTotal;
    });
  };

  const handleClick = () => {
    setClicks(prev => prev + 1);
    addPoints(1000);
  };

  const buyBuilding = (buildingName) => {
    const building = availableBuildings[buildingName];
    if (!building) return false;
    if (points >= building.cost) {
      setPoints(prev => prev - building.cost);
      setPassiveBuildings(prev => ({
        ...prev,
        [buildingName]: (prev[buildingName] || 0) + 1,
      }));
      return true;
    }
    return false;
  };

  const buyShopItem = (category, itemName) => {
    let item;
    if (category === 'Furniture') {
      item = availableFurniture[itemName];
      if (!item) return false;
      if (points >= item.cost) {
        setPoints(prev => prev - item.cost);
        setFurnitureInventory(prev => ({
          ...prev,
          [itemName]: (prev[itemName] || 0) + 1,
        }));
        return true;
      }
    } else if (category === 'Gardening') {
      item = availableGardening[itemName];
      if (!item) return false;
      if (points >= item.cost) {
        setPoints(prev => prev - item.cost);
        setGardeningInventory(prev => ({
          ...prev,
          [itemName]: (prev[itemName] || 0) + 1,
        }));
        return true;
      }
    } else if (category === 'CatAccessories') {
      item = availableCatAccessories[itemName];
      if (!item) return false;
      if (points >= item.cost) {
        setPoints(prev => prev - item.cost);
        setCatAccessoriesInventory(prev => ({
          ...prev,
          [itemName]: (prev[itemName] || 0) + 1,
        }));
        return true;
      }
    }
    return false;
  };

  // Buy a home (initial purchase)
  const buyHome = (homeType) => {
    const home = availableHomes[homeType];
    if (!home) return false;
    if (points >= home.cost) {
      setPoints(prev => prev - home.cost);
      setPurchasedHome({ type: homeType, floorPlan: home.floorPlan, gridSize: home.gridSize, decorations: [] });
      return true;
    }
    return false;
  };

  // Upgrade home: Allows purchasing a better house, refunds furniture, and resets grid.
  const upgradeHome = (newHomeType) => {
    const newHome = availableHomes[newHomeType];
    if (!newHome) return false;
    if (!purchasedHome) {
      alert("You haven't purchased a home yet.");
      return false;
    }
    const currentHome = availableHomes[purchasedHome.type];
    if (newHome.cost <= currentHome.cost) {
      alert("This house is not an upgrade.");
      return false;
    }
    if (points < newHome.cost) {
      alert("Not enough points for the upgrade.");
      return false;
    }
    // Deduct full cost for simplicity (alternatively, you could deduct only the difference)
    setPoints(prev => prev - newHome.cost);
    // Return all placed furniture to inventory
    homeDecorations.forEach(decoration => {
      setFurnitureInventory(prev => ({
        ...prev,
        [decoration.name]: (prev[decoration.name] || 0) + 1,
      }));
    });
    // Clear current home decorations
    setHomeDecorations([]);
    // Upgrade to new house (store gridSize from newHome)
    setPurchasedHome({ type: newHomeType, floorPlan: newHome.floorPlan, gridSize: newHome.gridSize, decorations: [] });
    alert("Upgraded to " + newHomeType);
    return true;
  };

  const addHomeDecoration = (item) => {
    setHomeDecorations(prev => [...prev, item]);
  };

  // --- Home Grid Management ---
  const [selectedFurniture, setSelectedFurniture] = useState(null);

  // Select a furniture item from inventory (only if owned)
  const selectFurniture = (name, image) => {
    if (!furnitureInventory[name] || furnitureInventory[name] <= 0) {
      alert(`You do not own any ${name}!`);
      return;
    }
    setSelectedFurniture({ name, image, rotation: 0 });
  };

  // Place the selected furniture in a grid cell (if the cell is empty) and deduct from inventory
  const placeFurniture = (gridPosition) => {
    if (!selectedFurniture) return;
    setHomeDecorations(prev => {
      if (prev.some(item => item.position === gridPosition)) return prev;
      return [...prev, { 
        id: Date.now(),
        name: selectedFurniture.name, 
        image: selectedFurniture.image, 
        position: gridPosition, 
        rotation: selectedFurniture.rotation
      }];
    });
    setFurnitureInventory(prev => ({
      ...prev,
      [selectedFurniture.name]: prev[selectedFurniture.name] - 1,
    }));
    setSelectedFurniture(null);
  };

  // Rotate a placed furniture item by 90°
  const rotateFurniture = (id) => {
    setHomeDecorations(prev =>
      prev.map(item =>
        item.id === id ? { ...item, rotation: (item.rotation + 90) % 360 } : item
      )
    );
  };

  // Remove a furniture item from the grid and return it to inventory
  const removeFurniture = (id) => {
    setHomeDecorations(prev => {
      const itemToRemove = prev.find(item => item.id === id);
      if (!itemToRemove) return prev;
      // Return the item to inventory
      setFurnitureInventory(inv => ({
        ...inv,
        [itemToRemove.name]: (inv[itemToRemove.name] || 0) + 1,
      }));
      return prev.filter(item => item.id !== id);
    });
  };
  // --- End Home Grid Management ---

  const addGardenDecoration = (item) => {
    setGardenDecorations(prev => [...prev, item]);
  };

  const updateCatCustomization = (catId, customization) => {
    setCats(prevCats => prevCats.map(cat => cat.id === catId ? { ...cat, customization } : cat));
  };

  return (
    <GameContext.Provider value={{
      points,
      totalPointsEarned,
      clicks,
      cats,
      passiveBuildings,
      furnitureInventory,
      gardeningInventory,
      catAccessoriesInventory,
      purchasedHome,
      homeDecorations,
      gardenDecorations,
      addPoints,
      handleClick,
      buyBuilding,
      buyShopItem,
      buyHome,
      upgradeHome, // Expose upgradeHome function
      addHomeDecoration,
      addGardenDecoration,
      updateCatCustomization,
      availableBuildings,
      availableFurniture,
      availableGardening,
      availableCatAccessories,
      availableHomes,
      setCatAccessoriesInventory,
      // Home grid management
      selectedFurniture,
      selectFurniture,
      placeFurniture,
      rotateFurniture,
      removeFurniture,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export { GameContext, GameProvider };
