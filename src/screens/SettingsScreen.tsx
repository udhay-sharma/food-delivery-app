import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';
import { useAppTheme, ThemeSettingType } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';

const LANGUAGES = ['English', 'Hindi (हिन्दी)', 'Kannada (ಕನ್ನಡ)', 'Tamil (தமிழ்)'];

export default function SettingsScreen() {
  const theme = useTheme();
  const { themeSetting, setThemeSetting } = useAppTheme();
  const { logout } = useApp();

  const [pushNotif, setPushNotif] = useState(true);
  const [promoNotif, setPromoNotif] = useState(false);
  const [locationServices, setLocationServices] = useState(true);
  const [faceId, setFaceId] = useState(false);
  const [langIndex, setLangIndex] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const cycleLanguage = () => {
    setLangIndex((prev) => (prev + 1) % LANGUAGES.length);
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const themes: { key: ThemeSettingType; label: string; icon: any }[] = [
    { key: 'light', label: 'Light', icon: 'sunny-outline' },
    { key: 'dark', label: 'Dark', icon: 'moon-outline' },
    { key: 'system', label: 'System', icon: 'phone-portrait-outline' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Theme Settings Selector */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>APP APPEARANCE</Text>
          <View style={[styles.themeSelectorContainer, { backgroundColor: theme.backgroundElement }]}>
            {themes.map((t) => {
              const isActive = themeSetting === t.key;
              return (
                <TouchableOpacity
                  key={t.key}
                  style={[
                    styles.themeTab,
                    isActive && { backgroundColor: '#FF4B3A' },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setThemeSetting(t.key)}
                >
                  <Ionicons name={t.icon} size={16} color={isActive ? '#FFF' : theme.textSecondary} />
                  <Text style={[styles.themeTabText, { color: isActive ? '#FFF' : theme.textSecondary }]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* Configurations Toggles */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>PREFERENCES</Text>
          
          <View style={[styles.itemCard, { backgroundColor: theme.backgroundElement }]}>
            {/* Push Notifications Toggle */}
            <View style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Ionicons name="notifications-outline" size={22} color="#FF4B3A" />
                <Text style={[styles.optionLabel, { color: theme.text }]}>Order Updates</Text>
              </View>
              <Switch
                value={pushNotif}
                onValueChange={setPushNotif}
                trackColor={{ false: '#767577', true: '#FF4B3A80' }}
                thumbColor={pushNotif ? '#FF4B3A' : '#f4f3f4'}
              />
            </View>

            <View style={styles.divider} />

            {/* Promo Notifications Toggle */}
            <View style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Ionicons name="gift-outline" size={22} color="#FF4B3A" />
                <Text style={[styles.optionLabel, { color: theme.text }]}>Offers & Coupons</Text>
              </View>
              <Switch
                value={promoNotif}
                onValueChange={setPromoNotif}
                trackColor={{ false: '#767577', true: '#FF4B3A80' }}
                thumbColor={promoNotif ? '#FF4B3A' : '#f4f3f4'}
              />
            </View>

            <View style={styles.divider} />

            {/* Location Toggle */}
            <View style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Ionicons name="location-outline" size={22} color="#FF4B3A" />
                <Text style={[styles.optionLabel, { color: theme.text }]}>Location Tracking</Text>
              </View>
              <Switch
                value={locationServices}
                onValueChange={setLocationServices}
                trackColor={{ false: '#767577', true: '#FF4B3A80' }}
                thumbColor={locationServices ? '#FF4B3A' : '#f4f3f4'}
              />
            </View>

            <View style={styles.divider} />

            {/* Language Selection */}
            <TouchableOpacity style={styles.navRow} activeOpacity={0.7} onPress={cycleLanguage}>
              <View style={styles.optionLeft}>
                <Ionicons name="globe-outline" size={22} color="#FF4B3A" />
                <Text style={[styles.optionLabel, { color: theme.text }]}>App Language</Text>
              </View>
              <View style={styles.optionRight}>
                <Text style={[styles.optionValue, { color: '#FF4B3A' }]}>{LANGUAGES[langIndex].split(' ')[0]}</Text>
                <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Security Settings */}
        <Animated.View entering={FadeInDown.duration(500).delay(150)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>SECURITY</Text>
          <View style={[styles.itemCard, { backgroundColor: theme.backgroundElement }]}>
            {/* Biometric Toggle */}
            <View style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Ionicons name="scan-outline" size={22} color="#FF4B3A" />
                <Text style={[styles.optionLabel, { color: theme.text }]}>Biometric Lock (Face ID)</Text>
              </View>
              <Switch
                value={faceId}
                onValueChange={setFaceId}
                trackColor={{ false: '#767577', true: '#FF4B3A80' }}
                thumbColor={faceId ? '#FF4B3A' : '#f4f3f4'}
              />
            </View>
          </View>
        </Animated.View>

        {/* About App */}
        <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ABOUT APPNATION</Text>
          <View style={[styles.itemCard, { backgroundColor: theme.backgroundElement }]}>
            <View style={styles.aboutInfoRow}>
              <Text style={[styles.aboutLabel, { color: theme.text }]}>App Version</Text>
              <Text style={[styles.aboutValue, { color: theme.textSecondary }]}>v1.2.4 Premium</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.aboutDescBlock}>
              <Text style={[styles.aboutDescText, { color: theme.textSecondary }]}>
                {"QuickEats is Bangalore's premium micro-delivery service bringing gourmet cuisines, crispy dosas, and authentic biryani hot to your doorstep. Designed beautifully for dynamic iOS & Android systems."}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Custom Confirmation Logout Button */}
        <Animated.View entering={FadeInDown.duration(500).delay(250)}>
          <TouchableOpacity
            style={[styles.logoutBtn, { borderColor: '#FF3B30', borderWidth: 1.5 }]}
            onPress={() => setShowLogoutModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={styles.logoutBtnText}>Log Out Account</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Elegant Custom Logout Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View entering={ZoomIn.duration(300)} style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
            <View style={styles.modalIconCircle}>
              <Ionicons name="alert-circle" size={40} color="#FF3B30" />
            </View>
            
            <Text style={[styles.modalTitle, { color: theme.text }]}>Log Out Account?</Text>
            <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
              Are you sure you want to log out? You will need to log back in to order your favorite feasts.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalCancelBtn, { borderColor: theme.border }]} 
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={[styles.modalBtnText, { color: theme.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalConfirmBtn, { backgroundColor: '#FF3B30' }]} 
                onPress={handleLogout}
              >
                <Text style={[styles.modalBtnText, { color: '#FFF' }]}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: 60,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 110,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 6,
  },
  themeSelectorContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 6,
    gap: 6,
  },
  themeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 12,
    gap: 6,
  },
  themeTabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  itemCard: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  optionValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  aboutInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  aboutLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  aboutValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  aboutDescBlock: {
    paddingVertical: 12,
  },
  aboutDescText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
  logoutBtn: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  logoutBtnText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF3B3012',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelBtn: {
    borderWidth: 1.5,
  },
  modalConfirmBtn: {
    backgroundColor: '#FF3B30',
  },
  modalBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
