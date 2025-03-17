// app/components/FallingFoodManager.tsx
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import FallingCatFood from './FallingCatFood';

export interface FallingFoodManagerHandle {
  spawnFood: () => void;
}

interface FallingFoodManagerProps {
  maxFoods?: number;
}

const FallingFoodManager = forwardRef<FallingFoodManagerHandle, FallingFoodManagerProps>(
  ({ maxFoods = 15 }, ref) => {
    const [foods, setFoods] = useState<number[]>([]);

    useImperativeHandle(ref, () => ({
      spawnFood: () => {
        if (foods.length < maxFoods) {
          const id = Date.now() + Math.random();
          setFoods(prev => [...prev, id]);
        }
      },
    }), [foods, maxFoods]);

    return (
      <>
        {foods.map(id => (
          <FallingCatFood
            key={id}
            onComplete={() =>
              setFoods(prev => prev.filter(foodId => foodId !== id))
            }
          />
        ))}
      </>
    );
  }
);

export default React.memo(FallingFoodManager);
