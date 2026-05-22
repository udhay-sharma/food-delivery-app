import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import { AppProvider } from '@/context/AppContext';
import { ThemeProvider, useAppTheme } from '@/context/ThemeContext';
import AppNavigator from '@/navigation/AppNavigator';

// Deep Linking Configuration
const linking = {
  prefixes: ['foodapp://'],
  config: {
    screens: {
      Onboarding: 'onboarding',
      Login: 'login',
      Main: {
        screens: {
          Home: {
            screens: {
              HomeMain: 'home',
              RestaurantDetail: 'restaurant/:restaurantId',
            },
          },
          Search: 'search',
          Orders: 'orders',
          Profile: {
            screens: {
              ProfileMain: 'profile',
              Settings: 'settings',
              Help: 'help',
            },
          },
        },
      },
      RestaurantDetail: 'restaurant/:restaurantId',
      Cart: 'cart',
      Settings: 'settings',
      Help: 'help',
    },
  },
};

function AppContent() {
  const { theme } = useAppTheme();

  return (
    <NavigationContainer linking={linking as any}>
      <AppNavigator />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
