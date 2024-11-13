# WeatherApp

A simple weather app built using React Native and TypeScript that fetches and displays current weather information for a given city using the OpenWeatherMap API. The app includes a search feature for cities, displays recent searches, allows switching between Celsius and Fahrenheit, and shows additional weather details on a separate screen.

## Features

- Search for City Weather: Get current weather information by entering a city name.
- Recent Searches: Save and display recently searched cities for quick access.
- Unit Toggle: Switch between Celsius and Fahrenheit.
- Detailed Weather Information: View additional weather details like humidity and wind speed.
- Error Handling: Handles invalid city names and API errors gracefully.
- Responsive UI: Optimized for a clean and user-friendly experience.

## Prerequisites

- Node.js (LTS version recommended)
- Expo CLI (for easier setup and testing)
- OpenWeatherMap API key (sign up at OpenWeatherMap to obtain an API key)

## Getting Started

## 1. Clone the Repository:

```bash
git clone https://github.com/your-username/WeatherApp.git
cd WeatherApp
```

## 2. Install Dependencies:

```bash
npm install
```

## 3. Add Environment Variables:

- Create a .env file in the root directory.
- Add your OpenWeatherMap API key to the .env file:

```bash
WEATHER_API_KEY=your_actual_api_key_here
```

## 4. Run the App:

- Start the app in development mode with Expo:

```bash
npm start
```

- Use the Expo Developer Tools in your browser to open the app on an iOS/Android simulator or a physical device with the Expo Go app.

## Folder Structure

```bash
WeatherApp/
├── App.tsx
├── src/
│   ├── components/
│   │   ├── WeatherScreen.tsx
│   │   └── DetailedScreen.tsx
│   └── types.ts
├── .env
└── README.md
```

- App.tsx: Main entry point of the app, sets up navigation between screens.
- src/components/WeatherScreen.tsx: Displays the main weather screen with search, recent searches, and weather data.
- src/components/DetailedScreen.tsx: Shows additional details like humidity and wind speed.
- src/types.ts: Defines TypeScript types used in the app.

## Approach

## 1. Component Structure:

- The app is organized into components for each screen: WeatherScreen for the main weather view and DetailedScreen for additional weather information.
- Navigation is handled by React Navigation, enabling smooth transitions between screens.

## 2. API Integration:

- The app uses the OpenWeatherMap API to fetch weather data for a specified city.
- Axios is used for API requests, and error handling is implemented to display messages for invalid city names or network issues.

## 3. State Management:

- State is managed locally within each component using useState and useEffect.
- Recent searches are stored in AsyncStorage, allowing the app to persist data across sessions.

## 4. UI and UX Design:

- The app features a clean, card-based design with consistent styling for readability and ease of use.
- The unit toggle and search functionality enhance user interaction, making the app more dynamic.

## Challenges Faced

## 1. Managing AsyncStorage for Recent Searches:

- Implementing and updating recent searches required careful handling to prevent duplicates and ensure only the last five searches are stored.
- This was achieved by filtering and limiting recent search entries before saving to AsyncStorage.

## 2. Error Handling for API Requests:

- Handling various error cases, such as invalid city names and network failures, was crucial for a good user experience.
- Different messages are displayed depending on the type of error to inform the user about potential issues accurately.

## 3. Environment Variable Management:

Storing the API key securely was a priority. We used react-native-dotenv to load the API key from a .env file and avoid exposing it directly in the code.

## Future Improvements
- Offline Mode: Cache the last fetched weather data to show when offline.
- Search History Screen: Add a dedicated screen to display full search history with options to clear or remove entries.
- Enhanced Error Handling: Implement more specific error handling for cases like rate-limiting or unsupported locations.

## License
This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License.

