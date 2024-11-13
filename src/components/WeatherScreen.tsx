// src/components/WeatherScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WEATHER_API_KEY } from '@env';
import { StackNavigationProp } from '@react-navigation/stack';
import { WeatherData } from '../types';

// Define navigation types for type safety in navigation props
type RootStackParamList = {
  Weather: undefined;
  Details: { weatherData: WeatherData };
};
type WeatherScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Weather'>;

type Props = {
  navigation: WeatherScreenNavigationProp;
};

const WeatherScreen: React.FC<Props> = ({ navigation }) => {
  // State to manage the city input, weather data, loading, and error state
  const [city, setCity] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recentCities, setRecentCities] = useState<string[]>([]);
  const [isCelsius, setIsCelsius] = useState<boolean>(true); // Unit toggle between Celsius/Fahrenheit

  // Fetch weather data from the API based on the entered city and current unit
  const fetchWeather = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    const units = isCelsius ? 'metric' : 'imperial';

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=${units}`
      );
      setWeatherData(response.data); // Store fetched weather data in state
      saveRecentCity(city); // Save the searched city to recent searches
    } catch (err) {
      setError('City not found'); // Show error if city not found or request fails
    } finally {
      setLoading(false); // Stop loading indicator once the request completes
    }
  };

  // Save the most recent search to local storage and update recentCities state
  const saveRecentCity = async (city: string) => {
    const updatedCities = [city, ...recentCities.filter(c => c !== city)].slice(0, 5); // Keep last 5 unique cities
    setRecentCities(updatedCities);
    await AsyncStorage.setItem('recentCities', JSON.stringify(updatedCities)); // Persist to AsyncStorage
  };

  // Load recent search cities from AsyncStorage on component mount
  const loadRecentCities = async () => {
    try {
      const cities = await AsyncStorage.getItem('recentCities');
      if (cities) setRecentCities(JSON.parse(cities)); // Parse and set recent cities if data exists
    } catch (e) {
      console.error('Failed to load recent cities'); // Log error if loading fails
    }
  };

  // Load recent cities only once when the component mounts
  useEffect(() => {
    loadRecentCities();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather App</Text>
      
      {/* Input for city name */}
      <TextInput
        placeholder="Enter city name"
        value={city}
        onChangeText={setCity}
        style={styles.input}
      />

      {/* Button to fetch weather */}
      <TouchableOpacity style={styles.button} onPress={fetchWeather}>
        <Text style={styles.buttonText}>Get Weather</Text>
      </TouchableOpacity>

      {/* Button to toggle between Celsius and Fahrenheit */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsCelsius(!isCelsius)}
      >
        <Text style={styles.toggleButtonText}>
          Switch to {isCelsius ? 'Fahrenheit' : 'Celsius'}
        </Text>
      </TouchableOpacity>

      {/* Show loading indicator while fetching data */}
      {loading && <ActivityIndicator size="large" style={styles.loader} />}

      {/* Show error message if city is not found */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Display weather data card if data is available */}
      {weatherData && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{weatherData.name}</Text>
          <Text style={styles.cardTemp}>
            {weatherData.main.temp}°{isCelsius ? 'C' : 'F'}
          </Text>
          <Text style={styles.cardDescription}>{weatherData.weather[0].description}</Text>
          <Image
            source={{ uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png` }}
            style={styles.icon}
          />
          
          {/* Navigate to Details screen with more weather information */}
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => navigation.navigate('Details', { weatherData })}
          >
            <Text style={styles.detailsButtonText}>See More Details</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Recent searches list */}
      {recentCities.length > 0 && (
        <View style={styles.recentContainer}>
          <Text style={styles.recentTitle}>Recently Searched Cities:</Text>
          
          {/* Render recent cities as a scrollable list */}
          <FlatList
            data={recentCities}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text style={styles.recentCity}>{item}</Text>}
            style={styles.recentList}
          />
        </View>
      )}
    </View>
  );
};

// Styles for WeatherScreen components
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  toggleButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  loader: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
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
    marginTop: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  cardTemp: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 10,
  },
  cardDescription: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
  },
  icon: {
    width: 80,
    height: 80,
    marginTop: 10,
  },
  detailsButton: {
    marginTop: 15,
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  recentContainer: {
    marginTop: 30,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  recentList: {
    maxHeight: 100,
  },
  recentCity: {
    fontSize: 16,
    color: '#555',
    paddingVertical: 5,
  },
});

export default WeatherScreen;
