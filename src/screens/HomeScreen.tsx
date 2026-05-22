import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';
import { RootStackParamList } from '@/navigation/AppNavigator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'all', name: 'All Foods', icon: 'fast-food' },
  { id: 'biryani', name: 'Biryani', icon: 'flame', filterWord: 'Biryani' },
  { id: 'dosa', name: 'Dosa & South', icon: 'restaurant', filterWord: 'Dosa' },
  { id: 'rolls', name: 'Kebab Rolls', icon: 'egg', filterWord: 'Roll' },
  { id: 'desserts', name: 'Desserts & Shakes', icon: 'ice-cream', filterWord: 'Dessert' },
];

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function HomeScreen() {
  const { restaurants, userProfile, orders, addToCart } = useApp();
  const theme = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const insets = useSafeAreaInsets();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filter restaurants based on category selected
  const filteredRestaurants = selectedCategory === 'all'
    ? restaurants
    : restaurants.filter(r => r.cuisine.toLowerCase().includes(CATEGORIES.find(c => c.id === selectedCategory)?.filterWord?.toLowerCase() || ''));

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  // Handle Quick Reorder from past history
  const handleQuickReorder = (pastOrder: typeof orders[0]) => {
    const parentRest = restaurants.find(r => r.name === pastOrder.restaurantName);
    if (!parentRest) return;

    pastOrder.items.forEach(item => {
      // Find food details
      const foodDetails = parentRest.menu.find(f => f.id === item.id);
      if (foodDetails) {
        // Add to cart based on original quantity
        for (let i = 0; i < item.quantity; i++) {
          addToCart(foodDetails, parentRest);
        }
      }
    });

    triggerToast(`Added ${pastOrder.items.length} items from ${pastOrder.restaurantName} to Cart!`);
  };

  // Instant Add to Cart for Trending Dishes
  const handleInstantAdd = (foodId: string, restId: string) => {
    const targetRest = restaurants.find(r => r.id === restId);
    if (!targetRest) return;
    const targetFood = targetRest.menu.find(f => f.id === foodId);
    if (!targetFood) return;

    addToCart(targetFood, targetRest);
    triggerToast(`Added ${targetFood.name} to Cart!`);
  };

  // Custom static trending dishes list
  const trendingDishes = [
    {
      id: 'food-1-1',
      restId: 'rest-1',
      restName: 'Meghana Biryani Palace',
      name: 'Meghana Chicken Biryani',
      price: 329,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'food-2-1',
      restId: 'rest-2',
      restName: 'CTR Shri Sagar',
      name: 'CTR Benne Masala Dosa',
      price: 110,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'food-3-1',
      restId: 'rest-3',
      restName: 'Empire Restaurant & Grill',
      name: 'Double Chicken Egg Roll',
      price: 189,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=300&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      {/* Top Header Section */}
      <View style={[styles.header, { borderBottomColor: theme.backgroundElement }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.deliverToText, { color: theme.textSecondary }]}>DELIVER TO</Text>
          <TouchableOpacity style={styles.locationSelector} activeOpacity={0.7}>
            <Ionicons name="location" size={16} color="#FF4B3A" />
            <Text style={[styles.locationName, { color: theme.text }]} numberOfLines={1}>
              45, 80 Feet Rd, Koramangala, Bengaluru
            </Text>
            <Ionicons name="chevron-down" size={14} color={theme.text} style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </View>

        {/* Right Header Controls */}
        <TouchableOpacity style={[styles.profileButton, { backgroundColor: theme.backgroundElement }]} activeOpacity={0.8}>
          <Ionicons name="person" size={18} color="#FF4B3A" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner Welcome Message */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.welcomeContainer}>
          <Text style={[styles.welcomeText, { color: theme.text }]}>
            Hello, <Text style={{ color: '#FF4B3A' }}>{userProfile.name.split(' ')[0]}!</Text>
          </Text>
          <Text style={[styles.welcomeSubtext, { color: theme.textSecondary }]}>
            Craving some authentic spices or hot filter coffee today?
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
              Search biryani, dosa, momos, rolls...
            </Text>
            <View style={styles.searchFilterBadge}>
              <Ionicons name="options-outline" size={16} color="#FFF" />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Featured Restaurants Carousel */}
        <Animated.View entering={FadeInDown.duration(500).delay(150)} style={styles.featuredContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Featured Offers</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.featuredList}
            snapToInterval={SCREEN_WIDTH * 0.82 + 16}
            decelerationRate="fast"
          >
            {restaurants.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.featuredCard, { backgroundColor: theme.card }]}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('RestaurantDetail', { 
                  restaurantId: item.id, 
                  restaurantName: item.name, 
                  restaurantPrice: item.menu[0]?.price 
                })}
              >
                <Image source={{ uri: item.image }} style={styles.featuredImage} />
                <View style={styles.featuredGradientOverlay} />
                
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>{item.promo || '50% OFF'}</Text>
                </View>

                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredName}>{item.name}</Text>
                  <View style={styles.featuredMetaRow}>
                    <Ionicons name="time" size={12} color="#FFF" />
                    <Text style={styles.featuredMetaText}>{item.deliveryTime}</Text>
                    <View style={styles.featuredSeparator} />
                    <Ionicons name="star" size={12} color="#FFB03B" />
                    <Text style={styles.featuredMetaText}>{item.rating}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Dynamic Quick Reorder Section */}
        {orders.length > 0 && (
          <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.reorderContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Order It Again?</Text>
            <View style={[styles.reorderCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border, borderWidth: 1 }]}>
              <View style={styles.reorderLeft}>
                <Ionicons name="receipt-outline" size={24} color="#FF4B3A" />
                <View style={styles.reorderInfo}>
                  <Text style={[styles.reorderRestName, { color: theme.text }]}>{orders[0].restaurantName}</Text>
                  <Text style={[styles.reorderSummary, { color: theme.textSecondary }]} numberOfLines={1}>
                    {orders[0].items.map(i => `${i.name} x${i.quantity}`).join(', ')}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[styles.reorderBtn, { backgroundColor: '#FF4B3A' }]} 
                activeOpacity={0.8}
                onPress={() => handleQuickReorder(orders[0])}
              >
                <Ionicons name="refresh" size={14} color="#FFF" />
                <Text style={styles.reorderBtnText}>Reorder</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Category Horizontal Selector */}
        <View style={styles.categorySection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Explore Cuisines</Text>
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
                        size={18}
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

        {/* Trending Dishes Section */}
        <Animated.View entering={FadeInDown.duration(500).delay(250)} style={styles.trendingSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Trending Dishes</Text>
          <View style={styles.trendingGrid}>
            {trendingDishes.map((dish, idx) => (
              <View 
                key={dish.id}
                style={[styles.trendingDishCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border, borderWidth: 1 }]}
              >
                <Image source={{ uri: dish.image }} style={styles.trendingDishImage} />
                <View style={styles.trendingDishDetails}>
                  <Text style={[styles.trendingDishName, { color: theme.text }]} numberOfLines={1}>{dish.name}</Text>
                  <Text style={[styles.trendingDishRest, { color: theme.textSecondary }]} numberOfLines={1}>{dish.restName}</Text>
                  
                  <View style={styles.trendingDishFooter}>
                    <Text style={[styles.trendingDishPrice, { color: theme.text }]}>₹{dish.price}</Text>
                    <View style={styles.trendingDishMeta}>
                      <Ionicons name="star" size={12} color="#FFB03B" />
                      <Text style={[styles.trendingDishRatingText, { color: theme.text }]}>{dish.rating}</Text>
                    </View>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={[styles.trendingAddBtn, { backgroundColor: '#FF4B3A' }]}
                  activeOpacity={0.8}
                  onPress={() => handleInstantAdd(dish.id, dish.restId)}
                >
                  <Ionicons name="add" size={18} color="#FFF" />
                  <Text style={styles.trendingAddText}>ADD</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Nearby Restaurants Section */}
        <View style={styles.restaurantsSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Popular Restaurants</Text>
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
                  onPress={() => navigation.navigate('RestaurantDetail', { 
                    restaurantId: item.id, 
                    restaurantName: item.name, 
                    restaurantPrice: item.menu[0]?.price 
                  })}
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
                          ₹{item.deliveryFee} delivery
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

      {/* Floating Success Feedback Toast */}
      {successToast && (
        <Animated.View entering={FadeInDown} style={styles.toastContainer}>
          <View style={styles.toastCard}>
            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
            <Text style={styles.toastText}>{successToast}</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationName: {
    fontSize: 14,
    fontWeight: '700',
    maxWidth: SCREEN_WIDTH * 0.65,
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
    paddingBottom: 110,
    paddingHorizontal: 24,
  },
  welcomeContainer: {
    marginVertical: 18,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  welcomeSubtext: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
    lineHeight: 18,
  },
  searchBarShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 16,
    paddingLeft: 18,
    paddingRight: 6,
    marginBottom: 24,
  },
  searchBarText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
  },
  searchFilterBadge: {
    backgroundColor: '#FF4B3A',
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredContainer: {
    marginBottom: 24,
  },
  featuredList: {
    gap: 16,
  },
  featuredCard: {
    width: SCREEN_WIDTH * 0.82,
    height: 160,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  featuredBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#FF4B3A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  featuredBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
  },
  featuredInfo: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
  },
  featuredName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredMetaText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  featuredSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#FFF',
    marginHorizontal: 4,
  },
  reorderContainer: {
    marginBottom: 24,
  },
  reorderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
  },
  reorderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 10,
  },
  reorderInfo: {
    flex: 1,
  },
  reorderRestName: {
    fontSize: 14,
    fontWeight: '800',
  },
  reorderSummary: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  reorderBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  categorySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
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
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryCardText: {
    fontSize: 13,
    fontWeight: '800',
  },
  trendingSection: {
    marginBottom: 24,
  },
  trendingGrid: {
    gap: 12,
  },
  trendingDishCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    position: 'relative',
  },
  trendingDishImage: {
    width: 64,
    height: 64,
    borderRadius: 14,
  },
  trendingDishDetails: {
    flex: 1,
    marginLeft: 12,
    marginRight: 70,
  },
  trendingDishName: {
    fontSize: 14,
    fontWeight: '800',
  },
  trendingDishRest: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  trendingDishFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 10,
  },
  trendingDishPrice: {
    fontSize: 13,
    fontWeight: '800',
  },
  trendingDishMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trendingDishRatingText: {
    fontSize: 11,
    fontWeight: '700',
  },
  trendingAddBtn: {
    position: 'absolute',
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 2,
  },
  trendingAddText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
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
    fontSize: 13,
    fontWeight: '800',
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
    fontSize: 17,
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
    fontSize: 11,
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
  toastContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  toastCard: {
    backgroundColor: '#34C759',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 50,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  toastText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
