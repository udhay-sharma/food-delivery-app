import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@/screens/HomeScreen';
import RestaurantDetailScreen from '@/screens/RestaurantDetailScreen';

export type HomeStackParamList = {
  HomeMain: undefined;
  RestaurantDetail: { restaurantId: string; restaurantName?: string; restaurantPrice?: number };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen 
        name="RestaurantDetail" 
        component={RestaurantDetailScreen} 
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}
