import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { useTheme } from '@/hooks/use-theme';
import { useApp } from '@/context/AppContext';
import HomeStackNavigator from './HomeStackNavigator';
import SearchScreen from '@/screens/SearchScreen';
import OrdersScreen from '@/screens/OrdersScreen';
import DrawerNavigator from './DrawerNavigator';

export type BottomTabParamList = {
  Home: undefined;
  Search: undefined;
  Orders: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const theme = useTheme();
  const { cart } = useApp();
  const cartQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? '';
        const shouldHideTabBar = routeName === 'RestaurantDetail';

        return {
          headerShown: false,
          tabBarActiveTintColor: '#FF4B3A', // Vibrant coral/orange primary color
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarStyle: {
            display: shouldHideTabBar ? 'none' : 'flex',
            backgroundColor: theme.background,
            borderTopWidth: 1,
            borderTopColor: theme.backgroundElement,
            paddingBottom: Platform.OS === 'ios' ? 24 : 12,
            paddingTop: 8,
            height: Platform.OS === 'ios' ? 88 : 68,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            fontFamily: Platform.OS === 'ios' ? 'System' : 'normal',
          },
          tabBarIcon: ({ color, size, focused }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Search':
                iconName = focused ? 'search' : 'search-outline';
                break;
              case 'Orders':
                iconName = focused ? 'receipt' : 'receipt-outline';
                break;
              case 'Profile':
                iconName = focused ? 'person' : 'person-outline';
                break;
              default:
                iconName = 'help-circle-outline';
            }

            return <Ionicons name={iconName} size={size - 2} color={color} />;
          },
        };
      }}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen} 
        options={{
          tabBarBadge: cartQty > 0 ? cartQty : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#FF4B3A',
            color: '#FFF',
            fontSize: 10,
            fontWeight: 'bold',
          }
        }}
      />
      <Tab.Screen name="Profile" component={DrawerNavigator} />
    </Tab.Navigator>
  );
}
