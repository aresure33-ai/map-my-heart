import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Location {
  lat: number;
  lng: number;
}

export interface LoveTestData {
  name1: string;
  name2: string;
  location1: Location | null;
  location2: Location | null;
  score: number | null;
}

interface LoveTestContextType {
  data: LoveTestData;
  setName1: (name: string) => void;
  setName2: (name: string) => void;
  setLocation1: (location: Location) => void;
  setLocation2: (location: Location) => void;
  calculateScore: () => number;
  reset: () => void;
}

const initialData: LoveTestData = {
  name1: '',
  name2: '',
  location1: null,
  location2: null,
  score: null,
};

const LoveTestContext = createContext<LoveTestContextType | undefined>(undefined);

// Deterministic score calculation based on names and locations
const calculateLoveScore = (name1: string, name2: string, loc1: Location | null, loc2: Location | null): number => {
  // Create a hash from both names
  const combined = (name1.toLowerCase() + name2.toLowerCase()).replace(/\s/g, '');
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Add location influence
  let locationBonus = 0;
  if (loc1 && loc2) {
    const distance = Math.sqrt(
      Math.pow(loc2.lat - loc1.lat, 2) + Math.pow(loc2.lng - loc1.lng, 2)
    );
    // Closer locations get bonus, but not too much
    locationBonus = Math.max(0, 15 - distance * 0.5);
  }
  
  // Calculate base score (35-85 range)
  const baseScore = 35 + Math.abs(hash % 50);
  
  // Add location bonus (up to 15 points)
  const finalScore = Math.min(99, Math.round(baseScore + locationBonus));
  
  return finalScore;
};

export const LoveTestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<LoveTestData>(initialData);

  const setName1 = (name: string) => {
    setData(prev => ({ ...prev, name1: name }));
  };

  const setName2 = (name: string) => {
    setData(prev => ({ ...prev, name2: name }));
  };

  const setLocation1 = (location: Location) => {
    setData(prev => ({ ...prev, location1: location }));
  };

  const setLocation2 = (location: Location) => {
    setData(prev => ({ ...prev, location2: location }));
  };

  const calculateScore = (): number => {
    const score = calculateLoveScore(data.name1, data.name2, data.location1, data.location2);
    setData(prev => ({ ...prev, score }));
    return score;
  };

  const reset = () => {
    setData(initialData);
  };

  return (
    <LoveTestContext.Provider value={{
      data,
      setName1,
      setName2,
      setLocation1,
      setLocation2,
      calculateScore,
      reset,
    }}>
      {children}
    </LoveTestContext.Provider>
  );
};

export const useLoveTest = () => {
  const context = useContext(LoveTestContext);
  if (!context) {
    throw new Error('useLoveTest must be used within a LoveTestProvider');
  }
  return context;
};
