import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const EmptyState: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../Assets/Images/Image.png')}
        style={styles.image}
      />
      <Text style={styles.welcomeText}>Welcome to GPS Store</Text>
      <Text style={styles.gpsText}>Your GPS store is empty</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 150,
    height: 176,
  },
  image: {
    height: 126,
    width: 126,
  },
  welcomeText: {
    fontFamily: 'poppins',
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 30,
    letterSpacing: -0.3,
    textAlign: 'center',
    color: '#333333',
  },
  gpsText: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 19.5,
    letterSpacing: -0.3,
  },
});

export default EmptyState;
