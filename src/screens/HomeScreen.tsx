import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useApp, Restaurant } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';
import { RootStackParamList } from '@/navigation/AppNavigator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'all', name: 'All Foods', icon: 'fast-food' },
  { id: 'burgers', name: 'Burgers', icon: 'hamburger', filterWord: 'Burgers' },
  { id: 'pizza', name: 'Pizza', icon: 'pizza', filterWord: 'Pizza' },
  { id: 'sushi', name: 'Sushi', icon: 'leaf', filterWord: 'Sushi' },
  { id: 'desserts', name: 'Desserts', icon: 'ice-cream', filterWord: 'Desserts' },
];

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function HomeScreen() {
  const { restaurants, userProfile } = useApp();
  const theme = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter restaurants based on category selected
  const filteredRestaurants = selectedCategory === 'all'
    ? restaurants
    : restaurants.filter(r => r.cuisine.toLowerCase().includes(CATEGORIES.find(c => c.id === selectedCategory)?.filterWord?.toLowerCase() || ''));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header Section */}
      <View style={[styles.header, { borderBottomColor: theme.backgroundElement }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.deliverToText, { color: theme.textSecondary }]}>DELIVER TO</Text>
          <TouchableOpacity style={styles.locationSelector} activeOpacity={0.7}>
            <Ionicons name="location" size={16} color="#FF4B3A" />
            <Text style={[styles.locationName, { color: theme.text }]} numberOfLines={1}>
              1024 Antigravity Way, CA
            </Text>
            <Ionicons name="chevron-down" size={14} color={theme.text} style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </View>

        {/* Right Header Controls */}
        <TouchableOpacity style={[styles.profileButton, { backgroundColor: theme.backgroundElement }]} activeOpacity={0.8}>
          <Image source={{ uri: userProfile.avatar }} style={styles.profileAvatar} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner Welcome Message */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.welcomeContainer}>
          <Text style={[styles.welcomeText, { color: theme.text }]}>
            Hello, <Text style={{ color: '#FF4B3A' }}>{userProfile.name.split(' ')[0]}!</Text>
          </Text>
          <Text style={[styles.welcomeSubtext, { color: theme.textSecondary }]}>
            What delicacies are we craving today?
          </Text>
        </Animated.View>

        {/* Fake Search Bar linking to Search Tab */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
          <TouchableOpacity
            style={[styles.searchBarShortcut, { backgroundColor: theme.backgroundElement }]}
            activeOpacity={0.9}
            onPress={() => (navigation as any).navigate('Search')}
          >
            <Ionicons name="search-outline" size={20} color={theme.textSecondary} />
            <Text style={[styles.searchBarText, { color: theme.textSecondary }]}>
              Search for meals, kitchens, or cuisines...
            </Text>
            <View style={styles.searchFilterBadge}>
              <Ionicons name="options-outline" size={16} color="#FFF" />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Coupon Discount Banner */}
        <Animated.View entering={FadeInDown.duration(500).delay(150)} style={styles.promoCard}>
          <View style={styles.promoDetails}>
            <View style={styles.promoTag}>
              <Text style={styles.promoTagText}>SPECIAL OFFER</Text>
            </View>
            <Text style={styles.promoTitle}>Free Delivery</Text>
            <Text style={styles.promoSubtitle}>On your first burger feast today!</Text>
            <TouchableOpacity style={styles.promoBtn} activeOpacity={0.8}>
              <Text style={styles.promoBtnText}>Order Now</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.promoImageWrapper}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=60' }}
              style={styles.promoImage}
            />
          </View>
        </Animated.View>

        {/* Category Horizontal Selector */}
        <View style={styles.categorySection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Explore Categories</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={CATEGORIES}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.categoryList}
            renderItem={({ item, index }) => {
              const isSelected = selectedCategory === item.id;
              return (
                <Animated.View entering={FadeInRight.duration(400).delay(index * 80)}>
                  <TouchableOpacity
                    style={[
                      styles.categoryCard,
                      {
                        backgroundColor: isSelected ? '#FF4B3A' : theme.backgroundElement,
                      },
                    ]}
                    onPress={() => setSelectedCategory(item.id)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.categoryIconCircle,
                        { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : theme.background },
                      ]}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color={isSelected ? '#FFF' : '#FF4B3A'}
                      />
                    </View>
                    <Text
                      style={[
                        styles.categoryCardText,
                        { color: isSelected ? '#FFF' : theme.text },
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            }}
          />
        </View>

        {/* Popular Cuisines Section */}
        <View style={styles.restaurantsSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Popular Near You</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {filteredRestaurants.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="sad-outline" size={40} color={theme.textSecondary} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No restaurants found in this category.
              </Text>
            </View>
          ) : (
            filteredRestaurants.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInDown.duration(500).delay(index * 100)}
              >
                <TouchableOpacity
                  style={[styles.restaurantCard, { backgroundColor: theme.background === '#ffffff' ? '#FFF' : theme.backgroundElement }]}
                  onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: item.id })}
                  activeOpacity={0.9}
                >
                  <Image source={{ uri: item.image }} style={styles.restaurantImage} />
                  
                  {item.promo && (
                    <View style={styles.promoBadge}>
                      <Text style={styles.promoBadgeText}>{item.promo}</Text>
                    </View>
                  )}

                  <View style={styles.restaurantInfo}>
                    <View style={styles.restaurantHeader}>
                      <Text style={[styles.restaurantName, { color: theme.text }]}>{item.name}</Text>
                      <View style={styles.ratingRow}>
                        <Ionicons name="star" size={14} color="#FFB03B" />
                        <Text style={[styles.ratingText, { color: theme.text }]}>{item.rating}</Text>
                        <Text style={[styles.reviewsCount, { color: theme.textSecondary }]}>
                          ({item.reviewsCount}+)
                        </Text>
                      </View>
                    </View>

                    <Text style={[styles.cuisineText, { color: theme.textSecondary }]}>
                      {item.cuisine}
                    </Text>

                    <View style={styles.restaurantFooter}>
                      <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
                        <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                          {item.deliveryTime}
                        </Text>
                      </View>

                      <View style={styles.dotSeparator} />

                      <View style={styles.metaItem}>
                        <Ionicons name="bicycle-outline" size={14} color={theme.textSecondary} />
                        <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                          ${item.deliveryFee} Delivery
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  header: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  deliverToText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationName: {
    fontSize: 15,
    fontWeight: '700',
    maxWidth: SCREEN_WIDTH * 0.55,
    marginLeft: 4,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatar: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  welcomeContainer: {
    marginVertical: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  welcomeSubtext: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  searchBarShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: 16,
    paddingLeft: 18,
    paddingRight: 6,
    marginBottom: 20,
  },
  searchBarText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
  },
  searchFilterBadge: {
    backgroundColor: '#FF4B3A',
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoCard: {
    height: 150,
    borderRadius: 24,
    backgroundColor: '#FF4B3A',
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#FF4B3A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  promoDetails: {
    flex: 1.2,
    padding: 20,
    justifyContent: 'center',
  },
  promoTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  promoTagText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
  promoTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
  },
  promoSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 10,
  },
  promoBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  promoBtnText: {
    color: '#FF4B3A',
    fontSize: 11,
    fontWeight: '800',
  },
  promoImageWrapper: {
    flex: 0.8,
    height: '100%',
  },
  promoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categorySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  categoryList: {
    paddingRight: 24,
    gap: 12,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 50,
    gap: 10,
  },
  categoryIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryCardText: {
    fontSize: 14,
    fontWeight: '700',
  },
  restaurantsSection: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  seeAllText: {
    color: '#FF4B3A',
    fontSize: 14,
    fontWeight: '700',
  },
  restaurantCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  restaurantImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  promoBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#FF4B3A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  promoBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  restaurantInfo: {
    padding: 16,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
  },
  reviewsCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  cuisineText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  restaurantFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C4C4C4',
    marginHorizontal: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 10,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});
