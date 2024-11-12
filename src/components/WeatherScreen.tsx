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
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { WeatherData } from '../types';
import { WEATHER_API_KEY } from '@env';

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
      console.log(err);
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
      <TextInput
        placeholder="Enter city name"
        value={city}
        onChangeText={setCity}
        style={styles.input}
      />
      <Button title="Get Weather" onPress={fetchWeather} />
      <Button
        title={`Switch to ${isCelsius ? 'Fahrenheit' : 'Celsius'}`}
        onPress={() => setIsCelsius(!isCelsius)}
      />

      {loading && <ActivityIndicator size="large" style={styles.loader} />}
      {error && <Text style={styles.error}>{error}</Text>}

      {weatherData && (
        <View style={styles.weatherContainer}>
          <Text>City: {weatherData.name}</Text>
          <Text>Temperature: {weatherData.main.temp} {isCelsius ? '°C' : '°F'}</Text>
          <Text>Description: {weatherData.weather[0].description}</Text>
          <Image
            source={{ uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png` }}
            style={styles.icon}
          />
          <Button
            title="See More Details"
            onPress={() => navigation.navigate('Details', { weatherData })}
          />
        </View>
      )}

      {recentCities.length > 0 && (
        <View style={styles.recentContainer}>
          <Text>Recently Searched Cities:</Text>
          {recentCities.map((city, index) => (
            <Text key={index}>{city}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderBottomWidth: 1, marginBottom: 20, padding: 10 },
  loader: { marginTop: 20 },
  error: { color: 'red', marginTop: 20 },
  weatherContainer: { marginTop: 20 },
  icon: { width: 50, height: 50 },
  recentContainer: { marginTop: 20 },
});

export default WeatherScreen;
