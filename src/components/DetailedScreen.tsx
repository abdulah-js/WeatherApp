// src/components/DetailedScreen.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { WeatherData } from '../types';

// Define navigation types for type safety in route props
type RootStackParamList = {
  Details: { weatherData: WeatherData };
};
type DetailedScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

type Props = {
  route: DetailedScreenRouteProp;
};

const DetailedScreen: React.FC<Props> = ({ route }) => {
  // Extract weather data passed from the WeatherScreen
  const { weatherData } = route.params;

  return (
    <View style={styles.container}>
      {/* Page Title */}
      <Text style={styles.title}>Weather Details</Text>
      
      {/* Card to display detailed weather information */}
      <View style={styles.card}>
        {/* City name */}
        <Text style={styles.detailText}>City: {weatherData.name}</Text>
        
        {/* Temperature */}
        <Text style={styles.detailText}>Temperature: {weatherData.main.temp} °C</Text>
        
        {/* Weather description */}
        <Text style={styles.detailText}>Description: {weatherData.weather[0].description}</Text>
        
        {/* Humidity level */}
        <Text style={styles.detailText}>Humidity: {weatherData.main.humidity}%</Text>
        
        {/* Wind speed */}
        <Text style={styles.detailText}>Wind Speed: {weatherData.wind.speed} m/s</Text>
      </View>
    </View>
  );
};

// Styles for DetailedScreen components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2', // Light background for better contrast
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333', // Dark color for high readability
  },
  card: {
    backgroundColor: '#fff', // White background for the card
    borderRadius: 10,
    padding: 20,
    alignItems: 'center', // Center-align text within the card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4, // Adds shadow for a card-like effect
  },
  detailText: {
    fontSize: 18,
    color: '#333', // Dark color for easy readability
    marginBottom: 10, // Spacing between each detail
  },
});

export default DetailedScreen;
