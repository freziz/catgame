// context/GameContext.tsx 
import React, { createContext, useState, useEffect } from 'react';

export const GameContext = createContext(null);

// ---------------- Configuration Objects ---------------- //

const availableBuildings = { 
  "Tanbark 🍂": { cost: 50, income: 1 },
  "Tiny Ball 🔴": { cost: 250, income: 2 },
  "Football 🏈": { cost: 2500, income: 4 },
  "Mouse🐁": { cost: 7500, income: 8 },
  "Snake🐍": { cost: 15000, income: 16 },
  "Teddy Bear 🧸": { cost: 30000, income: 32 },
  "Snowman ⛄": { cost: 75000, income: 100 },
  "Fish 🐟": { cost: 150000, income: 200 },
  "Clownfish 🐠": { cost: 350000, income: 400 },
  "Lobster 🦞": { cost: 750000, income: 800 },
  "Dolphin 🐬": { cost: 1500000, income: 1600 },
  "Shark 🦈": { cost: 3500000, income: 4000 },
  "8 Ball 🎱": { cost: 7500000, income: 10000 },
  "Lucky Dice 🎲": { cost: 25000000, income: 15000 },
  "Jack O' Lantern 🎃": { cost: 50000000, income: 50000 },
  "Fern's Bird 🦜": { cost: 1500000000, income: 100000 },
};

const availableFurniture = {
  "Chair 🪑": { cost: 25000, image: require('../../assets/sofa.png') },
  "Table 🍽️": { cost: 75000, image: require('../../assets/table.png') },
  "Sofa 🛋️": { cost: 150000, image: require('../../assets/sofa.png') },
  "Bed 🛌": { cost: 350000, image: require('../../assets/table.png') }
};

const availableGardening = { 
  "Garden Chair 💺": { cost: 35000, image: require('../../assets/bench.png') },
  "Fountain ⛲": { cost: 1000000, image: require('../../assets/fountain.png') }, 
};

const availableCatAccessories = { 
  "Hat 🎩": { cost: 50, image: require('../../assets/hat.png') }, 
  "Bowtie 🎀": { cost: 30, image: require('../../assets/bowtie.png') } 
};

const availableHomes = { 
  "Shack 🏚️": { cost: 1000000, floorPlan: require('../../assets/small_house.png'), gridSize: 3 }, 
  "Regular House 🏠": { cost: 100000000, floorPlan: require('../../assets/large_house.png'), gridSize: 4 },
  "Garden House 🏡": { cost: 500000000, floorPlan: require('../../assets/large_house.png'), gridSize: 5 },
  "Castle 🏰": { cost: 1000000000, floorPlan: require('../../assets/large_house.png'), gridSize: 6 },
};

const availableGardenSizes = {
  "Small Garden": { cost: 500000, gridSize: 3, floorPlan: require('../../assets/small_garden.png') },
  "Medium Garden": { cost: 2000000, gridSize: 4, floorPlan: require('../../assets/medium_garden.png') },
  "Large Garden": { cost: 5000000, gridSize: 5, floorPlan: require('../../assets/large_garden.png') },
};

const POINTS_PER_CAT = 150;
const MAX_CATS = 4; // maximum number of cats that can be unlocked

// ---------------- GameProvider Component ---------------- //

export function GameProvider({ children }) {
  // Basic game state
  const [points, setPoints] = useState(500);
  const [totalPointsEarned, setTotalPointsEarned] = useState(0);
  const [clicks, setClicks] = useState(0);
  // Instead of auto-adding cats, start with an empty list
  const [cats, setCats] = useState([]);
  const [passiveBuildings, setPassiveBuildings] = useState({});

  // Shop inventories
  const [furnitureInventory, setFurnitureInventory] = useState({});
  const [gardeningInventory, setGardeningInventory] = useState({});
  const [catAccessoriesInventory, setCatAccessoriesInventory] = useState({});

  // Real estate and decoration state
  const [purchasedHome, setPurchasedHome] = useState(null);
  const [purchasedGarden, setPurchasedGarden] = useState(null);
  const [homeDecorations, setHomeDecorations] = useState([]);
  const [gardenDecorations, setGardenDecorations] = useState([]);
  const [catAccessories, setCatAccessories] = useState([]);


  // ---------------- Passive Income System ---------------- //
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

  // Adjust addPoints so that points never drop below 0.
  const addPoints = (amount) => {
    setPoints(prev => Math.max(prev + amount, 0));
    setTotalPointsEarned(prev => prev + amount);
  };

  const handleClick = () => {
    setClicks(prev => prev + 1);
    addPoints(1);
  };

  // ---------------- Cat Unlocking ---------------- //
  // Instead of auto-unlocking, provide a function to unlock a cat when the threshold is met.
  const unlockCat = () => {
    if (cats.length >= MAX_CATS) {
      alert("All cats are already unlocked.");
      return;
    }
    const requiredPoints = POINTS_PER_CAT * (cats.length + 1);
    if (totalPointsEarned >= requiredPoints) {
      setCats(prev => [...prev, { id: prev.length, customization: {} }]);
    } else {
      alert("Not enough points to unlock this cat.");
    }
  };

  // ---------------- Building & Shop Functions ---------------- //
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
    setPoints(prev => prev - newHome.cost);
    // Refund all placed home furniture.
    homeDecorations.forEach(decoration => {
      setFurnitureInventory(prev => ({
        ...prev,
        [decoration.name]: (prev[decoration.name] || 0) + 1,
      }));
    });
    setHomeDecorations([]);
    setPurchasedHome({ type: newHomeType, floorPlan: newHome.floorPlan, gridSize: newHome.gridSize, decorations: [] });
    alert("Upgraded to " + newHomeType);
    return true;
  };

  // Garden purchasing/upgrading functions.
  const buyGarden = (gardenType) => {
    const garden = availableGardenSizes[gardenType];
    if (!garden) return false;
    if (points >= garden.cost) {
      setPoints(prev => prev - garden.cost);
      setPurchasedGarden({ type: gardenType, floorPlan: garden.floorPlan, gridSize: garden.gridSize, decorations: [] });
      return true;
    }
    return false;
  };

  const upgradeGarden = (newGardenType) => {
    const newGarden = availableGardenSizes[newGardenType];
    if (!newGarden) return false;
    if (!purchasedGarden) {
      alert("You haven't purchased a garden yet.");
      return false;
    }
    const currentGarden = availableGardenSizes[purchasedGarden.type];
    if (newGarden.cost <= currentGarden.cost) {
      alert("This garden is not an upgrade.");
      return false;
    }
    if (points < newGarden.cost) {
      alert("Not enough points for the upgrade.");
      return false;
    }
    setPoints(prev => prev - newGarden.cost);
    // Refund all placed garden items.
    gardenDecorations.forEach(decoration => {
      setGardeningInventory(prev => ({
        ...prev,
        [decoration.name]: (prev[decoration.name] || 0) + 1,
      }));
    });
    setGardenDecorations([]);
    setPurchasedGarden({ type: newGardenType, floorPlan: newGarden.floorPlan, gridSize: newGarden.gridSize, decorations: [] });
    alert("Garden upgraded to " + newGardenType);
    return true;
  };

  // ---------------- Home Grid Management ---------------- //
  const [selectedFurniture, setSelectedFurniture] = useState(null);

  const selectFurniture = (name, image) => {
    if (!furnitureInventory[name] || furnitureInventory[name] <= 0) {
      alert(`You do not own any ${name}!`);
      return;
    }
    setSelectedFurniture({ name, image, rotation: 0 });
  };

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

  const rotateFurniture = (id) => {
    setHomeDecorations(prev =>
      prev.map(item =>
        item.id === id ? { ...item, rotation: (item.rotation + 90) % 360 } : item
      )
    );
  };

  const removeFurniture = (id) => {
    setHomeDecorations(prev => {
      const itemToRemove = prev.find(item => item.id === id);
      if (!itemToRemove) return prev;
      setFurnitureInventory(inv => ({
        ...inv,
        [itemToRemove.name]: (inv[itemToRemove.name] || 0) + 1,
      }));
      return prev.filter(item => item.id !== id);
    });
  };

  // ---------------- Garden Grid Management ---------------- //
  const [selectedGardenItem, setSelectedGardenItem] = useState(null);

  const selectGardenItem = (name, image) => {
    if (!gardeningInventory[name] || gardeningInventory[name] <= 0) {
      alert(`You do not own any ${name}!`);
      return;
    }
    setSelectedGardenItem({ name, image, rotation: 0 });
  };

  const placeGardenItem = (gridPosition) => {
    if (!selectedGardenItem) return;
    setGardenDecorations(prev => {
      if (prev.some(item => item.position === gridPosition)) return prev;
      return [...prev, {
        id: Date.now(),
        name: selectedGardenItem.name,
        image: selectedGardenItem.image,
        position: gridPosition,
        rotation: selectedGardenItem.rotation,
      }];
    });
    setGardeningInventory(prev => ({
      ...prev,
      [selectedGardenItem.name]: prev[selectedGardenItem.name] - 1,
    }));
    setSelectedGardenItem(null);
  };

  const rotateGardenItem = (id) => {
    setGardenDecorations(prev =>
      prev.map(item =>
        item.id === id ? { ...item, rotation: (item.rotation + 90) % 360 } : item
      )
    );
  };

  const removeGardenItem = (id) => {
    setGardenDecorations(prev => {
      const itemToRemove = prev.find(item => item.id === id);
      if (!itemToRemove) return prev;
      setGardeningInventory(prev => ({
        ...prev,
        [itemToRemove.name]: (prev[itemToRemove.name] || 0) + 1,
      }));
      return prev.filter(item => item.id !== id);
    });
  };

  const updateGardenItemPosition = (id, newProps) => {
    setGardenDecorations(prev =>
      prev.map(item => (item.id === id ? { ...item, ...newProps } : item))
    );
  };

  // ---------------- End Garden Management ---------------- //

// ---------------- Cat Accessory Management ---------------- //
const [selectedCatItem, setSelectedCatItem] = useState(null);

const selectCatItem = (name, image) => {
  if (!catAccessoriesInventory[name] || catAccessoriesInventory[name] <= 0) {
    alert(`You do not own any ${name}!`);
    return;
  }
  setSelectedCatItem({ name, image, rotation: 0 });
};

const placeCatItem = (gridPosition) => {
  if (!selectedCatItem) return;
  setCatAccessories(prev => {
    if (prev.some(item => item.position === gridPosition)) return prev;
    return [...prev, {
      id: Date.now(),
      name: selectedCatItem.name,
      image: selectedCatItem.image,
      position: gridPosition,
      rotation: selectedCatItem.rotation,
    }];
  });
  setCatAccessoriesInventory(prev => ({
    ...prev,
    [selectedCatItem.name]: prev[selectedCatItem.name] - 1,
  }));
  setSelectedCatItem(null);
};

const rotateCatItem = (id) => {
  setCatAccessories(prev =>
    prev.map(item =>
      item.id === id ? { ...item, rotation: (item.rotation + 90) % 360 } : item
    )
  );
};

const removeCatItem = (id) => {
  setCatAccessories(prev => {
    const itemToRemove = prev.find(item => item.id === id);
    if (!itemToRemove) return prev;
    setCatAccessoriesInventory(prev => ({
      ...prev,
      [itemToRemove.name]: (prev[itemToRemove.name] || 0) + 1,
    }));
    return prev.filter(item => item.id !== id);
  });
};

const updateCatItemPosition = (id, newProps) => {
  setCatAccessories(prev =>
    prev.map(item => (item.id === id ? { ...item, ...newProps } : item))
  );
};
//end cat accessory management//

return (
  <GameContext.Provider value={{
    // Basic game state (including setPoints for use in other screens)
    points,
    setPoints,
    totalPointsEarned,
    clicks,
    cats,
    passiveBuildings,
    furnitureInventory,
    gardeningInventory,
    catAccessoriesInventory,
    purchasedHome,
    purchasedGarden,
    homeDecorations,
    gardenDecorations,
    
    // Basic functions
    addPoints,
    handleClick,
    buyBuilding,
    buyShopItem,
    buyHome,
    upgradeHome,
    buyGarden,
    upgradeGarden,
    unlockCat,  // new function for unlocking cats
    
    // Home grid management
    selectedFurniture,
    selectFurniture,
    placeFurniture,
    rotateFurniture,
    removeFurniture,
    
    // Garden grid management
    selectedGardenItem,
    selectGardenItem,
    placeGardenItem,
    rotateGardenItem,
    removeGardenItem,
    updateGardenItemPosition,

    // 🐱 **Cat Accessories Management (MISSING BEFORE)** 🐱
    selectedCatItem,
    selectCatItem,
    placeCatItem,
    rotateCatItem,
    removeCatItem,
    updateCatItemPosition, 

    //more
    catAccessories,
    setCatAccessories,
    selectedCatItem,
    selectCatItem,
    placeCatItem,
    rotateCatItem,  
    removeCatItem,
    updateCatItemPosition,

    // Configuration objects
    availableBuildings,
    availableFurniture,
    availableGardening,
    availableCatAccessories,
    availableHomes,
    availableGardenSizes,
  }}>
    {children}
  </GameContext.Provider>
);
}

export { GameContext, GameProvider };
