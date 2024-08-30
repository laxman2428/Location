import {useState, useEffect} from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Coordinate = {
  lat: number;
  lng: number;
};

export const useCoordinates = () => {
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);

  useEffect(() => {
    loadCoordinates();
  }, []);

  const loadCoordinates = async () => {
    try {
      const storedCoordinates = await AsyncStorage.getItem('coordinates');
      if (storedCoordinates) {
        setCoordinates(JSON.parse(storedCoordinates));
      }
    } catch (error) {
      console.error('Failed to load coordinates:', error);
      Alert.alert('Error', 'Failed to load coordinates.');
    }
  };

  const saveCoordinates = async (newCoords: Coordinate[]) => {
    try {
      await AsyncStorage.setItem('coordinates', JSON.stringify(newCoords));
      setCoordinates(newCoords);
    } catch (error) {
      console.error('Failed to save coordinates:', error);
      Alert.alert('Error', 'Failed to save coordinates.');
    }
  };

  return {
    coordinates,
    loadCoordinates,
    saveCoordinates,
  };
};

export default useCoordinates;
