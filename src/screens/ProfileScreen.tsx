import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';
import { RootStackParamList } from '@/navigation/AppNavigator';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function ProfileScreen() {
  const { userProfile, logout, orders } = useApp();
  const theme = useTheme();
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const menuOptions = [
    {
      id: 'addresses',
      icon: 'location-outline',
      label: 'My Delivery Addresses',
      rightLabel: '3 Saved',
      action: () => {},
    },
    {
      id: 'payments',
      icon: 'card-outline',
      label: 'Payment Methods',
      rightLabel: 'Visa **94',
      action: () => {},
    },
    {
      id: 'settings',
      icon: 'settings-outline',
      label: 'Settings',
      action: () => navigation.navigate('Settings'),
    },
    {
      id: 'help',
      icon: 'help-circle-outline',
      label: 'Help & Support',
      action: () => navigation.navigate('Help'),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card Header */}
        <Animated.View entering={FadeInUp.duration(500)} style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: userProfile.avatar }} style={styles.avatarImage as any} />
            <View style={styles.badgeWrapper}>
              <Ionicons name="sparkles" size={14} color="#FFF" />
            </View>
          </View>
          
          <Text style={[styles.userName, { color: theme.text }]}>{userProfile.name}</Text>
          <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{userProfile.email}</Text>

          <View style={styles.tierTag}>
            <Ionicons name="ribbon" size={14} color="#FFB03B" style={{ marginRight: 4 }} />
            <Text style={styles.tierTagText}>{userProfile.level}</Text>
          </View>
        </Animated.View>

        {/* Stats Section Cards */}
        <Animated.View entering={FadeInUp.duration(500).delay(150)} style={styles.statsCardContainer}>
          <View style={[styles.statBox, { borderRightColor: theme.backgroundElement, borderRightWidth: 1 }]}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Foodie Points</Text>
            <Text style={[styles.statValue, { color: '#FF4B3A' }]}>{userProfile.points}</Text>
          </View>

          <View style={[styles.statBox, { borderRightColor: theme.backgroundElement, borderRightWidth: 1 }]}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Wallet Balance</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>${userProfile.balance.toFixed(2)}</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Feasts</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>{orders.length}</Text>
          </View>
        </Animated.View>

        {/* Options List items */}
        <Animated.View entering={FadeInDown.duration(500).delay(250)} style={styles.menuContainer}>
          {menuOptions.map((option, idx) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.menuItem,
                {
                  borderBottomColor: theme.backgroundElement,
                  borderBottomWidth: idx < menuOptions.length - 1 ? 1 : 0,
                },
              ]}
              onPress={option.action}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuItemIconCircle, { backgroundColor: theme.backgroundElement }]}>
                  <Ionicons name={option.icon as any} size={20} color="#FF4B3A" />
                </View>
                <Text style={[styles.menuItemLabel, { color: theme.text }]}>{option.label}</Text>
              </View>

              <View style={styles.menuItemRight}>
                {option.rightLabel && (
                  <Text style={[styles.menuItemRightLabel, { color: theme.textSecondary }]}>
                    {option.rightLabel}
                  </Text>
                )}
                <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Logout Button */}
        <Animated.View entering={FadeInDown.duration(500).delay(350)}>
          <TouchableOpacity
            style={[styles.logoutBtn, { borderColor: '#FF3B30', borderWidth: 1.5 }]}
            onPress={logout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={styles.logoutBtnText}>Log Out Account</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarWrapper: {
    width: 104,
    height: 104,
    borderRadius: 52,
    padding: 3,
    borderWidth: 2.5,
    borderColor: '#FF4B3A',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  badgeWrapper: {
    backgroundColor: '#FF4B3A',
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4B3A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  tierTag: {
    backgroundColor: '#FFF8EE',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 59, 0.25)',
  },
  tierTagText: {
    color: '#FFB03B',
    fontSize: 12,
    fontWeight: '800',
  },
  statsCardContainer: {
    backgroundColor: '#FF4B3A08',
    flexDirection: 'row',
    borderRadius: 24,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#FF4B3A18',
    marginBottom: 30,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  menuContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.01)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 6,
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70,
    paddingHorizontal: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemRightLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  logoutBtn: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  logoutBtnText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '700',
  },
});
