// WeatherScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { WeatherData } from './types';

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

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiKey = 'eabb9d016803f984d2d9bb67a6943c29';
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeatherData(response.data);
    } catch (err) {
      setError('City not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter city name"
        value={city}
        onChangeText={setCity}
        style={styles.input}
      />
      <Button title="Get Weather" onPress={fetchWeather} />

      {loading && <ActivityIndicator size="large" style={styles.loader} />}
      {error && <Text style={styles.error}>{error}</Text>}

      {weatherData && (
        <View style={styles.weatherContainer}>
          <Text>City: {weatherData.name}</Text>
          <Text>Temperature: {weatherData.main.temp} °C</Text>
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
});

export default WeatherScreen;
