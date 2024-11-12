// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WeatherScreen from './src/components/WeatherScreen';
import DetailedScreen from './src/components/DetailedScreen';
import { WeatherData } from './src/types';

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
