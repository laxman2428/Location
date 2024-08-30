// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

import React, {useState} from 'react';
import {
  StyleSheet,
  Alert,
  Pressable,
  FlatList,
  SafeAreaView,
  View,
  Text,
  Image,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import useCoordinates from '../utils/AsyncStorage';
import Icon from 'react-native-vector-icons/AntDesign';
import CustomModal from '../components/CustomModal';
import fetchAddress from '../api/Api';
import EmptyState from '../components/EmptyState';
Icon.loadFont();

function Home(): React.JSX.Element {
  const {coordinates, saveCoordinates} = useCoordinates();
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const requestLocationPermission = async () => {
    try {
      const authorization = await Geolocation.requestAuthorization('whenInUse');
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
    } catch (error) {
      console.error('Location permission error:', error);
    }
  };

  const getCoordinates = () => {
    Geolocation.getCurrentPosition(
      position => {
        const newCoordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const updatedCoordinates = [...coordinates, newCoordinates];
        saveCoordinates(updatedCoordinates);
      },
      error => {
        console.error('Error getting coordinates:', error);
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
    saveCoordinates(updatedCoords);
  };

  const handlePress = async (lat: number, lng: number, index: number) => {
    try {
      const fetchedAddress = await fetchAddress(lat, lng);
      setSelectedIndex(index);
      setAddress(fetchedAddress);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching address:', error);
      Alert.alert('Error', 'Failed to fetch address.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstContainer} />
      <View style={styles.secondContainer}>
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
                    source={require('../assets/Images/OneDrive-Logo.wine.png')}
                    style={styles.image}
                  />
                  <Text style={styles.latLon}>
                    {item.lat}, {item.lng}
                  </Text>
                </View>
                <Pressable
                  onPress={() => deleteCoordinate(index)}
                  style={styles.deleteIcon}>
                  <Icon name="delete" size={20} color="red" />
                </Pressable>
              </View>
            </Pressable>
          )}
          keyExtractor={(item, index) => `${item.lat}-${item.lng}-${index}`}
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
  secondContainer: {
    height: 35,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
  },
  text: {
    color: '#8B8B8B',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
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
  deleteIcon: {
    marginRight: 10,
  },
  icon: {
    position: 'absolute',
    bottom: 100,
    right: 40,
  },
});

export default Home;
