// src/components/WeatherScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WEATHER_API_KEY } from '@env';
import { StackNavigationProp } from '@react-navigation/stack';
import { WeatherData } from '../types';

type RootStackParamList = {
  Weather: undefined;
  Details: { weatherData: WeatherData };
};

type WeatherScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Weather'>;

type Props = {
  navigation: WeatherScreenNavigationProp;
};

const WeatherScreen: React.FC<Props> = ({ navigation }) => {
  const [city, setCity] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recentCities, setRecentCities] = useState<string[]>([]);
  const [isCelsius, setIsCelsius] = useState<boolean>(true);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    const units = isCelsius ? 'metric' : 'imperial';

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=${units}`
      );
      setWeatherData(response.data);
      saveRecentCity(city);
    } catch (err) {
      setError('City not found');
    } finally {
      setLoading(false);
    }
  };

  const saveRecentCity = async (city: string) => {
    const updatedCities = [city, ...recentCities.filter(c => c !== city)].slice(0, 5);
    setRecentCities(updatedCities);
    await AsyncStorage.setItem('recentCities', JSON.stringify(updatedCities));
  };

  const loadRecentCities = async () => {
    try {
      const cities = await AsyncStorage.getItem('recentCities');
      if (cities) setRecentCities(JSON.parse(cities));
    } catch (e) {
      console.error('Failed to load recent cities');
    }
  };

  useEffect(() => {
    loadRecentCities();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather App</Text>
      <TextInput
        placeholder="Enter city name"
        value={city}
        onChangeText={setCity}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={fetchWeather}>
        <Text style={styles.buttonText}>Get Weather</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsCelsius(!isCelsius)}
      >
        <Text style={styles.toggleButtonText}>
          Switch to {isCelsius ? 'Fahrenheit' : 'Celsius'}
        </Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" style={styles.loader} />}
      {error && <Text style={styles.error}>{error}</Text>}

      {!error && weatherData && (
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
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => navigation.navigate('Details', { weatherData })}
          >
            <Text style={styles.detailsButtonText}>See More Details</Text>
          </TouchableOpacity>
        </View>
      )}

      {recentCities.length > 0 && (
        <View style={styles.recentContainer}>
          <Text style={styles.recentTitle}>Recently Searched Cities:</Text>
          <ScrollView style={styles.recentList}>
            {recentCities.map((city, index) => (
              <Text key={index} style={styles.recentCity}>
                {city}
              </Text>
            ))}
          </ScrollView>
        </View>
      )}
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
  recentCity: {
    fontSize: 16,
    color: '#555',
    paddingVertical: 5,
  },
  recentList: {
    maxHeight: 100,
  },
});

export default WeatherScreen;
