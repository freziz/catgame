// app/GameContext.tsx
import React, { createContext, useState, useEffect } from 'react';

export const GameContext = createContext(null);

// Configuration for available items:
const availableBuildings = { 
  "Cat Tower": { cost: 50, income: 1 }
};

const availableFurniture = { 
  "Sofa": { cost: 100, image: require('../assets/sofa.png') }, 
  "Table": { cost: 150, image: require('../assets/table.png') } 
};

const availableGardening = { 
  "Fountain": { cost: 150, image: require('../assets/fountain.png') }, 
  "Bench": { cost: 80, image: require('../assets/bench.png') } 
};

const availableCatAccessories = { 
  "Hat": { cost: 50, image: require('../assets/hat.png') }, 
  "Bowtie": { cost: 30, image: require('../assets/bowtie.png') } 
};

const availableHomes = { 
  "Small House": { cost: 1000, floorPlan: require('../assets/small_house.png') }, 
  "Large House": { cost: 3000, floorPlan: require('../assets/large_house.png') } 
};

export function GameProvider({ children }) {
  const [points, setPoints] = useState(0);
  const [totalPointsEarned, setTotalPointsEarned] = useState(0);
  const [clicks, setClicks] = useState(0);
  // Each cat is an object: { id, customization: {} }
  const [cats, setCats] = useState([]);
  // Passive buildings: { "Cat Tower": count, ... }
  const [passiveBuildings, setPassiveBuildings] = useState({});
  // (Other shop inventories and decoration state remain the same)
  const [furnitureInventory, setFurnitureInventory] = useState({});
  const [gardeningInventory, setGardeningInventory] = useState({});
  const [catAccessoriesInventory, setCatAccessoriesInventory] = useState({});
  const [purchasedHome, setPurchasedHome] = useState(null);
  const [homeDecorations, setHomeDecorations] = useState([]);
  const [gardenDecorations, setGardenDecorations] = useState([]);

  // Passive income: every second, add points equal to the sum of (count * income)
  useEffect(() => {
    const interval = setInterval(() => {
      let totalIncome = 0;
      for (const building in passiveBuildings) {
        const count = passiveBuildings[building];
        totalIncome += count * availableBuildings[building].income;
      }
      if (totalIncome > 0) {
        // Do not check for cats here because totalPointsEarned is cumulative
        addPoints(totalIncome, false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [passiveBuildings]);

  // For every 5 total points earned, add a cat (never remove cats)
  const addPoints = (amount, checkCats = true) => {
    setPoints(prev => prev + amount);
    setTotalPointsEarned(prev => {
      const newTotal = prev + amount;
      if (checkCats) {
        const expectedCats = Math.floor(newTotal / 5);
        if (expectedCats > cats.length) {
          setCats(prevCats => {
            const newCats = [...prevCats];
            while (newCats.length < expectedCats) {
              newCats.push({ id: newCats.length, customization: {} });
            }
            return newCats;
          });
        }
      }
      return newTotal;
    });
  };

  // A click adds 1 point (cats are based on total points, not current points)
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

  // Buy shop items for different categories
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

  // Purchase a home from the real estate page
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

  const addHomeDecoration = (item) => {
    setHomeDecorations(prev => [...prev, item]);
  };

  const addGardenDecoration = (item) => {
    setGardenDecorations(prev => [...prev, item]);
  };

  // Update a cat's customization
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
    }}>
      {children}
    </GameContext.Provider>
  );
}