import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

import { useApp } from '@/context/AppContext';
import OnboardingScreen from '@/screens/OnboardingScreen';
import LoginScreen from '@/screens/LoginScreen';
import BottomTabNavigator from './BottomTabNavigator';
import RestaurantDetailScreen from '@/screens/RestaurantDetailScreen';
import CartScreen from '@/screens/CartScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import HelpScreen from '@/screens/HelpScreen';

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Main: undefined;
  RestaurantDetail: { restaurantId: string; restaurantName?: string; restaurantPrice?: number };
  Cart: undefined;
  Settings: undefined;
  Help: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isOnboarded, isLoggedIn, isLoading } = useApp();

  // Premium branded load splash
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF4B3A' }}>
        <Animated.View entering={FadeIn.duration(600)} style={{ alignItems: 'center' }}>
          <Ionicons name="pizza" size={80} color="#FFF" />
          <Text style={{ color: '#FFF', fontSize: 26, fontWeight: '800', marginTop: 16, letterSpacing: -0.5 }}>
            QuickEats
          </Text>
          <ActivityIndicator size="small" color="#FFF" style={{ marginTop: 24 }} />
        </Animated.View>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isOnboarded ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : !isLoggedIn ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={BottomTabNavigator} />
          <Stack.Screen 
            name="RestaurantDetail" 
            component={RestaurantDetailScreen} 
            options={{
              presentation: 'card',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen 
            name="Cart" 
            component={CartScreen} 
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{
              headerShown: true,
              headerTitle: 'Settings',
              headerBackTitle: 'Profile',
              headerTintColor: '#FFFFFF',
              headerStyle: {
                backgroundColor: '#FF4B3A',
              },
              headerTitleStyle: {
                fontWeight: '800',
              },
              presentation: 'card',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen 
            name="Help" 
            component={HelpScreen} 
            options={{
              headerShown: true,
              headerTitle: 'Help & Support',
              headerBackTitle: 'Profile',
              headerTintColor: '#FFFFFF',
              headerStyle: {
                backgroundColor: '#FF4B3A',
              },
              headerTitleStyle: {
                fontWeight: '800',
              },
              presentation: 'card',
              animation: 'slide_from_right',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
