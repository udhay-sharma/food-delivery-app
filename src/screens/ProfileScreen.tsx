import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';
import { RootStackParamList } from '@/navigation/AppNavigator';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function ProfileScreen() {
  const { userProfile, logout, orders, updateProfile } = useApp();
  const theme = useTheme();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const insets = useSafeAreaInsets();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editEmail, setEditEmail] = useState(userProfile.email);
  const [editCuisine, setEditCuisine] = useState(userProfile.favCuisine);

  const handleSave = () => {
    if (editName.trim() === '' || editEmail.trim() === '') return;
    updateProfile(editName, editEmail, editCuisine);
    setIsEditing(false);
  };

  const menuOptions = [
    {
      id: 'addresses',
      icon: 'location-outline',
      label: 'My Delivery Addresses',
      rightLabel: `${userProfile.savedAddresses} Saved`,
      action: () => {},
    },
    {
      id: 'payments',
      icon: 'card-outline',
      label: 'Payment Methods',
      rightLabel: 'UPI / Cards',
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
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card Header */}
        <Animated.View entering={FadeInUp.duration(500)} style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons name="person" size={50} color="#FF4B3A" />
            </View>
            <TouchableOpacity 
              style={styles.badgeWrapper} 
              activeOpacity={0.8}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Ionicons name={isEditing ? 'close' : 'create'} size={14} color="#FFF" />
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <Animated.View entering={FadeInDown.duration(300)} style={styles.editForm}>
              <View style={[styles.inputRow, { backgroundColor: theme.backgroundElement }]}>
                <Ionicons name="person-outline" size={16} color={theme.textSecondary} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Enter Name"
                  placeholderTextColor={theme.textSecondary}
                  value={editName}
                  onChangeText={setEditName}
                  autoCorrect={false}
                />
              </View>

              <View style={[styles.inputRow, { backgroundColor: theme.backgroundElement }]}>
                <Ionicons name="mail-outline" size={16} color={theme.textSecondary} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Enter Email"
                  placeholderTextColor={theme.textSecondary}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={[styles.inputRow, { backgroundColor: theme.backgroundElement }]}>
                <Ionicons name="pizza-outline" size={16} color={theme.textSecondary} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Favorite Cuisine"
                  placeholderTextColor={theme.textSecondary}
                  value={editCuisine}
                  onChangeText={setEditCuisine}
                  autoCorrect={false}
                />
              </View>

              <View style={styles.btnRow}>
                <TouchableOpacity 
                  style={[styles.editBtn, styles.cancelBtn, { borderColor: theme.border }]} 
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={[styles.editBtnText, { color: theme.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.editBtn, styles.saveBtn, { backgroundColor: '#FF4B3A' }]} 
                  onPress={handleSave}
                >
                  <Text style={[styles.editBtnText, { color: '#FFF' }]}>Save</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ) : (
            <Animated.View entering={FadeInUp.duration(300)} style={{ alignItems: 'center' }}>
              <View style={styles.nameRow}>
                <Text style={[styles.userName, { color: theme.text }]}>{userProfile.name}</Text>
                <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editIconBtn}>
                  <Ionicons name="create-outline" size={16} color="#FF4B3A" />
                </TouchableOpacity>
              </View>
              <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{userProfile.email}</Text>

              <View style={styles.badgeRow}>
                <View style={styles.tierTag}>
                  <Ionicons name="ribbon" size={12} color="#FFB03B" style={{ marginRight: 4 }} />
                  <Text style={styles.tierTagText}>{userProfile.level}</Text>
                </View>
                <View style={[styles.favTag, { backgroundColor: theme.backgroundElement }]}>
                  <Ionicons name="heart" size={12} color="#FF4B3A" style={{ marginRight: 4 }} />
                  <Text style={[styles.favTagText, { color: theme.text }]}>{userProfile.favCuisine}</Text>
                </View>
              </View>
              
              <Text style={[styles.memberSinceText, { color: theme.textSecondary }]}>
                Member since {userProfile.memberSince}
              </Text>
            </Animated.View>
          )}
        </Animated.View>

        {/* Stats Section Cards */}
        <Animated.View entering={FadeInUp.duration(500).delay(150)} style={styles.statsCardContainer}>
          <View style={[styles.statBox, { borderRightColor: theme.backgroundElement, borderRightWidth: 1 }]}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Foodie Points</Text>
            <Text style={[styles.statValue, { color: '#FF4B3A' }]}>{userProfile.points}</Text>
          </View>

          <View style={[styles.statBox, { borderRightColor: theme.backgroundElement, borderRightWidth: 1 }]}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Feast Wallet</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>₹{userProfile.balance.toFixed(0)}</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Feasts</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {userProfile.totalOrders + orders.length - 1}
            </Text>
          </View>
        </Animated.View>

        {/* Loyalty Reward Program Progress */}
        <Animated.View entering={FadeInUp.duration(500).delay(200)} style={[styles.loyaltyCard, { backgroundColor: theme.backgroundElement }]}>
          <View style={styles.loyaltyHeader}>
            <View style={styles.loyaltyTitleCol}>
              <Ionicons name="sparkles" size={18} color="#FFB03B" />
              <Text style={[styles.loyaltyTitle, { color: theme.text }]}>Loyalty Club Rewards</Text>
            </View>
            <Text style={styles.loyaltyPoints}>{userProfile.points} / 1000 Pts</Text>
          </View>
          
          <View style={[styles.progressBarBg, { backgroundColor: theme.backgroundSelected }]}>
            <View style={[styles.progressBarFill, { width: '85%' }]} />
          </View>
          
          <Text style={[styles.loyaltyAdvice, { color: theme.textSecondary }]}>
            Order more delicious meals to unlock <Text style={{ color: '#FFB03B', fontWeight: '800' }}>Biryani Emperor</Text> rewards tier!
          </Text>
        </Animated.View>

        {/* Options List items */}
        <Animated.View entering={FadeInDown.duration(500).delay(250)} style={[styles.menuContainer, { borderColor: theme.border }]}>
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
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 110,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
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
    marginBottom: 12,
  },
  avatarImage: {
    width: 94,
    height: 94,
    borderRadius: 47,
    overflow: 'hidden',
    resizeMode: 'cover',
  },
  avatarPlaceholder: {
    width: 94,
    height: 94,
    borderRadius: 47,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  badgeWrapper: {
    backgroundColor: '#FF4B3A',
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4B3A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  editIconBtn: {
    padding: 4,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  tierTag: {
    backgroundColor: '#FFF8EE',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 59, 0.25)',
  },
  tierTagText: {
    color: '#FFB03B',
    fontSize: 11,
    fontWeight: '800',
  },
  favTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  favTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  memberSinceText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 10,
  },
  editForm: {
    width: '100%',
    gap: 10,
    marginTop: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    height: '100%',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  editBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    borderWidth: 1.5,
  },
  saveBtn: {
    backgroundColor: '#FF4B3A',
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  statsCardContainer: {
    backgroundColor: '#FF4B3A08',
    flexDirection: 'row',
    borderRadius: 24,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#FF4B3A18',
    marginBottom: 20,
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
  loyaltyCard: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
  },
  loyaltyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  loyaltyTitleCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  loyaltyTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  loyaltyPoints: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFB03B',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFB03B',
    borderRadius: 4,
  },
  loyaltyAdvice: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  menuContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.01)',
    borderWidth: 1,
    paddingHorizontal: 6,
    marginBottom: 24,
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
