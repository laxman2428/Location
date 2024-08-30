/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {useState, useEffect} from 'react';
import {StyleSheet, Alert, Pressable, FlatList} from 'react-native';
import {SafeAreaView, View, Text, Image} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';
import CustomModal from './Components/CustomModal';
import axios from 'axios';
import EmptyState from './Components/EmptyState';
Icon.loadFont();

const API_KEY = 'AIzaSyB6TMTc78V7AJnp2dLXY8TuW86wx9LRMJA';

function App(): React.JSX.Element {
  const [coordinates, setCoordinates] = useState<{lat: number; lng: number}[]>(
    [],
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    loadCoordinates();
  }, []);

  const loadCoordinates = async () => {
    try {
      const storedCoOrdinates = await AsyncStorage.getItem('coordinates');
      if (storedCoOrdinates) {
        setCoordinates(JSON.parse(storedCoOrdinates));
      }
    } catch (error) {
      console.error('Failed to load CoOrdinates:', error);
    }
  };

  const saveCoordinates = async (newCoords: {lat: number; lng: number}[]) => {
    try {
      await AsyncStorage.setItem('coordinates', JSON.stringify(newCoords));
    } catch (error) {
      console.error('Failed to save coordinates:', error);
    }
  };

  const requestLocationPermission = () => {
    Geolocation.requestAuthorization('whenInUse')
      .then(authorization => {
        if (
          authorization === 'granted' ||
          authorization === 'whenInUse' ||
          authorization === 'always'
        ) {
          getCoordinates();
        } else {
          Alert.alert(
            'Permission Denied',
            'Location permission is required to fetch coordinates.',
          );
        }
      })
      .catch(error => {
        console.error('Location permission error:', error);
      });
  };

  const getCoordinates = () => {
    Geolocation.getCurrentPosition(
      position => {
        const newCoOrdinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const updatedCoOrdinates = [...coordinates, newCoOrdinates];
        setCoordinates(updatedCoOrdinates);
        saveCoordinates(updatedCoOrdinates);
      },
      error => {
        console.error(error);
        Alert.alert(
          'Error',
          'Failed to get coordinates. Make sure location services are enabled and permissions are granted.',
        );
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const deleteCoordinate = (indexToDelete: number) => {
    const updatedCoords = coordinates.filter(
      (_, index) => index !== indexToDelete,
    );
    setCoordinates(updatedCoords);
    saveCoordinates(updatedCoords);
  };

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`,
      );
      const address = response.data.results[0]?.formatted_address || 'Unknown';
      setAddress(address);
      setModalVisible(true);
    } catch (error) {
      console.error('Failed to fetch address:', error);
      Alert.alert('Error', 'Failed to fetch the address.');
    }
  };

  const handlePress = (lat: number, lng: number, index: number) => {
    fetchAddress(lat, lng);
    setSelectedIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstContainer} />
      <View style={styles.secondConatiner}>
        <Text style={styles.text}>Coordinates</Text>
      </View>
      {coordinates.length > 0 ? (
        <FlatList
          data={coordinates}
          renderItem={({item, index}) => (
            <Pressable onPress={() => handlePress(item.lat, item.lng, index)}>
              <View
                style={[
                  styles.display,
                  selectedIndex === index && styles.pressedItem,
                ]}>
                <View style={styles.imageText}>
                  <Image
                    source={require('./Assets/Images/OneDrive-Logo.wine.png')}
                    style={styles.image}
                  />
                  <Text>
                    {item.lat}, {item.lng}
                  </Text>
                </View>
                <Pressable
                  onPress={() => deleteCoordinate(index)}
                  style={{marginRight: 10}}>
                  <Icon name="delete" size={20} color="red" />
                </Pressable>
              </View>
            </Pressable>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <EmptyState />
      )}
      <Pressable onPress={requestLocationPermission} style={styles.icon}>
        <Icon name="pluscircle" size={50} color="#33B5EF" />
      </Pressable>
      {modalVisible && (
        <CustomModal
          visible={modalVisible}
          address={address}
          onClose={() => {
            setModalVisible(false);
            setSelectedIndex(null);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  firstContainer: {
    height: 55,
    backgroundColor: '#33B5EF',
  },
  secondConatiner: {
    height: 35,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
  },
  text: {
    color: '#8B8B8B',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    width: 72,
    height: 18,
    marginLeft: 15,
  },
  pressedItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  image: {
    height: 23,
    width: 35,
    marginLeft: 9,
    marginRight: 20,
  },
  imageText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  display: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  latLon: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22.5,
    letterSpacing: -0.3,
  },
  icon: {
    position: 'absolute',
    bottom: 100,
    right: 40,
  },
});

export default App;
