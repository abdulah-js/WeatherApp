// src/components/DetailedScreen.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { WeatherData } from '../types';

type RootStackParamList = {
  Details: { weatherData: WeatherData };
};

type DetailedScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

type Props = {
  route: DetailedScreenRouteProp;
};

const DetailedScreen: React.FC<Props> = ({ route }) => {
  const { weatherData } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather Details</Text>
      
      <View style={styles.card}>
        <Text style={styles.detailText}>City: {weatherData.name}</Text>
        <Text style={styles.detailText}>Temperature: {weatherData.main.temp} °C</Text>
        <Text style={styles.detailText}>Description: {weatherData.weather[0].description}</Text>
        <Text style={styles.detailText}>Humidity: {weatherData.main.humidity}%</Text>
        <Text style={styles.detailText}>Wind Speed: {weatherData.wind.speed} m/s</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  detailText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
});

export default DetailedScreen;
