import React from 'react';
import { Dimensions, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { 
  createDrawerNavigator, 
  DrawerContentScrollView, 
  DrawerItem,
  DrawerContentComponentProps 
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/hooks/use-theme';
import { useApp } from '@/context/AppContext';
import ProfileScreen from '@/screens/ProfileScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import HelpScreen from '@/screens/HelpScreen';

export type ProfileDrawerParamList = {
  ProfileMain: undefined;
  Settings: undefined;
  Help: undefined;
};

const Drawer = createDrawerNavigator<ProfileDrawerParamList>();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const theme = useTheme();
  const { userProfile, logout } = useApp();

  return (
    <DrawerContentScrollView 
      {...props} 
      contentContainerStyle={{ flexGrow: 1, backgroundColor: theme.background }}
    >
      {/* Drawer Header with user avatar and name */}
      <View style={[styles.drawerHeader, { borderBottomColor: theme.backgroundElement }]}>
        <View style={[styles.avatarCircle, { backgroundColor: theme.backgroundElement }]}>
          <Ionicons name="person" size={28} color="#FF4B3A" />
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.profileName, { color: theme.text }]} numberOfLines={1}>
            {userProfile.name}
          </Text>
          <Text style={[styles.profileEmail, { color: theme.textSecondary }]} numberOfLines={1}>
            {userProfile.email}
          </Text>
        </View>
      </View>

      {/* Drawer Navigation List items */}
      <View style={styles.drawerItemsContainer}>
        <DrawerItem
          label="My Profile"
          labelStyle={[styles.drawerItemLabel, { color: theme.text }]}
          icon={() => <Ionicons name="person-outline" size={20} color="#FF4B3A" />}
          onPress={() => props.navigation.navigate('ProfileMain')}
        />

        <DrawerItem
          label="My Orders"
          labelStyle={[styles.drawerItemLabel, { color: theme.text }]}
          icon={() => <Ionicons name="receipt-outline" size={20} color="#FF4B3A" />}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate('Orders');
          }}
        />

        <DrawerItem
          label="Settings"
          labelStyle={[styles.drawerItemLabel, { color: theme.text }]}
          icon={() => <Ionicons name="settings-outline" size={20} color="#FF4B3A" />}
          onPress={() => props.navigation.navigate('Settings')}
        />

        <DrawerItem
          label="Help & FAQs"
          labelStyle={[styles.drawerItemLabel, { color: theme.text }]}
          icon={() => <Ionicons name="help-circle-outline" size={20} color="#FF4B3A" />}
          onPress={() => props.navigation.navigate('Help')}
        />
      </View>

      {/* Footer Logout Option */}
      <View style={[styles.drawerFooter, { borderTopColor: theme.backgroundElement }]}>
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={() => {
            props.navigation.closeDrawer();
            logout();
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  const theme = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerTintColor: '#FF4B3A',
        headerStyle: {
          backgroundColor: theme.background,
          borderBottomWidth: 1,
          borderBottomColor: theme.backgroundElement,
        },
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 18,
        },
        drawerActiveTintColor: '#FF4B3A',
        drawerInactiveTintColor: theme.textSecondary,
        drawerStyle: {
          backgroundColor: theme.background,
          width: Dimensions.get('window').width * 0.72,
        },
      }}
    >
      <Drawer.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{
          drawerLabel: 'My Profile',
          title: 'My Profile',
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerLabel: 'Settings',
          title: 'Settings',
        }}
      />
      <Drawer.Screen
        name="Help"
        component={HelpScreen}
        options={{
          drawerLabel: 'Help & FAQs',
          title: 'Help & FAQs',
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF4B3A',
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  profileEmail: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  drawerItemsContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  drawerItemLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: -12,
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    justifyContent: 'flex-end',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 15,
    fontWeight: '700',
  },
});

