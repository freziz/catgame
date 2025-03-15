// app/GameContext.tsx
import React, { createContext, useState, useEffect } from 'react';

// Create the context so all components can share global state
export const GameContext = createContext(null);

// Configuration objects for each item category:

// Passive buildings (e.g., "Cat Tower") provide passive income.
const availableBuildings = { 
  "Cat Tower": { cost: 50, income: 1 }
};

// Furniture items for decorating the purchased home.
const availableFurniture = { 
  "Sofa": { cost: 100, image: require('../assets/sofa.png') }, 
  "Table": { cost: 150, image: require('../assets/table.png') } 
};

// Gardening items for decorating the garden.
const availableGardening = { 
  "Fountain": { cost: 150, image: require('../assets/fountain.png') }, 
  "Bench": { cost: 80, image: require('../assets/bench.png') },
};

// Cat accessories for customizing cats.
const availableCatAccessories = { 
  "Hat": { cost: 50, image: require('../assets/hat.png') }, 
  "Bowtie": { cost: 30, image: require('../assets/bowtie.png') } 
};

// Real estate: Homes available for purchase.
const availableHomes = { 
  "Small House": { cost: 1000, floorPlan: require('../assets/small_house.png') }, 
  "Large House": { cost: 3000, floorPlan: require('../assets/large_house.png') } 
};

const POINTS_PER_CAT = 5; // 1 cat per 5 cumulative points

export function GameProvider({ children }) {
  // Points that the player currently has (spendable).
  const [points, setPoints] = useState(0);
  // Total points ever earned (cumulative, used for determining cats).
  const [totalPointsEarned, setTotalPointsEarned] = useState(0);
  const [clicks, setClicks] = useState(0);
  // Array of cat objects; each cat is created for every 5 cumulative points.
  const [cats, setCats] = useState([]);
  // Passive buildings purchased (e.g., { "Cat Tower": count })
  const [passiveBuildings, setPassiveBuildings] = useState({});
  // Inventories for shop items; these counts indicate how many have been purchased.
  const [furnitureInventory, setFurnitureInventory] = useState({});
  const [gardeningInventory, setGardeningInventory] = useState({});
  const [catAccessoriesInventory, setCatAccessoriesInventory] = useState({});
  // Real estate: purchased home (if any)
  const [purchasedHome, setPurchasedHome] = useState(null);
  // Decorations placed in the home and garden (each item is an object)
  const [homeDecorations, setHomeDecorations] = useState([]);
  const [gardenDecorations, setGardenDecorations] = useState([]);

  // Every second, add passive income based on purchased buildings.
  useEffect(() => {
    const interval = setInterval(() => {
      let totalIncome = 0;
      for (const building in passiveBuildings) {
        const count = passiveBuildings[building];
        totalIncome += count * availableBuildings[building].income;
      }
      if (totalIncome > 0) {
        addPoints(totalIncome);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [passiveBuildings]);

  // addPoints: adds points to the player and updates the total cumulative points.
  // Every POINTS_PER_CAT cumulative points, a new cat is added.
  const addPoints = (amount) => {
    setPoints(prev => prev + amount);
    setTotalPointsEarned(prev => {
      const newTotal = prev + amount;
      // Calculate how many cats should exist (1 cat per POINTS_PER_CAT points).
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

  // handleClick: invoked on each click; adds 50 points.
  const handleClick = () => {
    setClicks(prev => prev + 1);
    addPoints(50);
  };

  // buyBuilding: purchases a passive building (e.g., Cat Tower).
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

  // buyShopItem: purchases an item from a given shop category.
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

  // buyHome: allows the user to purchase a home.
  const buyHome = (homeType) => {
    const home = availableHomes[homeType];
    if (!home) return false;
    if (points >= home.cost) {
      setPoints(prev => prev - home.cost);
      setPurchasedHome({ type: homeType, floorPlan: home.floorPlan, decorations: [] });
      return true;
    }
    return false;
  };

  // addHomeDecoration: adds a furniture item to the home decoration state.
  const addHomeDecoration = (item) => {
    setHomeDecorations(prev => [...prev, item]);
  };

  // addGardenDecoration: adds a gardening item to the garden decoration state.
  const addGardenDecoration = (item) => {
    setGardenDecorations(prev => [...prev, item]);
  };

  // updateCatCustomization: updates a specific cat's customization details.
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
      addHomeDecoration,
      addGardenDecoration,
      updateCatCustomization,
      availableBuildings,
      availableFurniture,
      availableGardening,
      availableCatAccessories,
      availableHomes,
      // Expose setter for accessory inventory (needed in CatEditor)
      setCatAccessoriesInventory,
    }}>
      {children}
    </GameContext.Provider>
  );
}
