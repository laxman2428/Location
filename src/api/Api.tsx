import axios from 'axios';
import {Alert} from 'react-native';
import {API_KEY} from '../utils/AppConstants';

const API_Key = API_KEY;

const fetchAddress = async (lat: number, lng: number) => {
  let address = '';
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_Key}`,
    );
    address = response.data.results[0]?.formatted_address || 'Unknown';
  } catch (error) {
    console.error('Failed to fetch address:', error);
    Alert.alert('Error', 'Failed to fetch the address.');
  }
  return address;
};

export default fetchAddress;
