// DetailedScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { WeatherData } from './types';

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
      <Text>Humidity: {weatherData.main.humidity}%</Text>
      <Text>Wind Speed: {weatherData.wind.speed} m/s</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
});

export default DetailedScreen;
