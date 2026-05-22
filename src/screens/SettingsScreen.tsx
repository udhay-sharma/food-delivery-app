import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  const [pushNotif, setPushNotif] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [faceId, setFaceId] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.backgroundElement }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: theme.backgroundElement }]} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>APP CONFIGURATION</Text>
          
          <View style={[styles.itemCard, { backgroundColor: theme.backgroundElement }]}>
            {/* Push Notifications Toggle */}
            <View style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Ionicons name="notifications-outline" size={22} color="#FF4B3A" />
                <Text style={[styles.optionLabel, { color: theme.text }]}>Push Notifications</Text>
              </View>
              <Switch
                value={pushNotif}
                onValueChange={setPushNotif}
                trackColor={{ false: '#767577', true: '#FF4B3A80' }}
                thumbColor={pushNotif ? '#FF4B3A' : '#f4f3f4'}
              />
            </View>

            <View style={styles.divider} />

            {/* Location Toggle */}
            <View style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Ionicons name="location-outline" size={22} color="#FF4B3A" />
                <Text style={[styles.optionLabel, { color: theme.text }]}>Location Services</Text>
              </View>
              <Switch
                value={locationServices}
                onValueChange={setLocationServices}
                trackColor={{ false: '#767577', true: '#FF4B3A80' }}
                thumbColor={locationServices ? '#FF4B3A' : '#f4f3f4'}
              />
            </View>

            <View style={styles.divider} />

            {/* Face ID Toggle */}
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

        <Animated.View entering={FadeInDown.duration(500).delay(150)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>LEGAL & SECURITY</Text>
          <View style={[styles.itemCard, { backgroundColor: theme.backgroundElement }]}>
            <TouchableOpacity style={styles.navRow}>
              <View style={styles.optionLeft}>
                <Ionicons name="shield-checkmark-outline" size={22} color="#FF4B3A" />
                <Text style={[styles.optionLabel, { color: theme.text }]}>Privacy Shield Policies</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.navRow}>
              <View style={styles.optionLeft}>
                <Ionicons name="document-text-outline" size={22} color="#FF4B3A" />
                <Text style={[styles.optionLabel, { color: theme.text }]}>User License Agreement (EULA)</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
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
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 6,
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
  optionLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
});
