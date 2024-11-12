// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WeatherScreen from './WeatherScreen';
import DetailedScreen from './DetailedScreen';
import { WeatherData } from './types';

type RootStackParamList = {
  Weather: undefined;
  Details: { weatherData: WeatherData };
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Weather">
        <Stack.Screen name="Weather" component={WeatherScreen} />
        <Stack.Screen name="Details" component={DetailedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
