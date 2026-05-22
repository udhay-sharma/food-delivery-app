import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';
import { RootStackParamList } from '@/navigation/AppNavigator';

const SEARCH_CATEGORIES = [
  { id: '1', name: 'Hyderabadi Biryani', gradient: ['#FF5E36', '#FF8F3D'], icon: 'flame', searchKey: 'Biryani' },
  { id: '2', name: 'South Indian Dosa', gradient: ['#4CD964', '#5AD8A6'], icon: 'restaurant', searchKey: 'Dosa' },
  { id: '3', name: 'North Indian Curry', gradient: ['#FF9500', '#FFCC00'], icon: 'leaf', searchKey: 'North Indian' },
  { id: '4', name: 'Spicy Kebab Rolls', gradient: ['#5856D6', '#8E8E93'], icon: 'egg', searchKey: 'Roll' },
  { id: '5', name: 'Sweet Sundaes', gradient: ['#FF2D55', '#FF5B7F'], icon: 'ice-cream', searchKey: 'Sundae' },
  { id: '6', name: 'Chilled Mango Shakes', gradient: ['#007AFF', '#05A2FF'], icon: 'cafe', searchKey: 'Shake' },
];

const TRENDING_SEARCHES = [
  'Chicken Biryani',
  'CTR Masala Dosa',
  'Butter Chicken',
  'Kebab',
  'Paneer Tikka',
  'Filter Coffee',
];

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function SearchScreen() {
  const { restaurants } = useApp();
  const theme = useTheme();
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from AsyncStorage on mount
  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const storedSearches = await AsyncStorage.getItem('@recent_searches');
        if (storedSearches) {
          setRecentSearches(JSON.parse(storedSearches));
        }
      } catch (error) {
        console.error('Failed to load recent searches:', error);
      }
    };
    loadRecentSearches();
  }, []);

  // Save a search term to history
  const saveSearchTerm = async (term: string) => {
    const trimmed = term.trim();
    if (trimmed === '') return;

    const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
    setRecentSearches(updated);
    try {
      await AsyncStorage.setItem('@recent_searches', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save recent searches:', error);
    }
  };

  const handleSearchSubmit = () => {
    saveSearchTerm(query);
  };

  const handleCardPress = (restaurantId: string, restaurantName?: string, restaurantPrice?: number) => {
    saveSearchTerm(query);
    navigation.navigate('RestaurantDetail', { restaurantId, restaurantName, restaurantPrice });
  };

  // Clear query button action
  const clearQuery = () => setQuery('');

  // Handle selecting a category
  const handleCategoryPress = (searchKey: string) => {
    setQuery(searchKey);
    saveSearchTerm(searchKey);
  };

  const handleDeleteRecent = async (search: string) => {
    const updated = recentSearches.filter((s) => s !== search);
    setRecentSearches(updated);
    try {
      await AsyncStorage.setItem('@recent_searches', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to delete recent search:', error);
    }
  };

  const handleClearAllRecent = async () => {
    setRecentSearches([]);
    try {
      await AsyncStorage.removeItem('@recent_searches');
    } catch (error) {
      console.error('Failed to clear all recent searches:', error);
    }
  };

  // Live filter restaurants and dishes
  const matchingRestaurants = query.trim() === ''
    ? []
    : restaurants.filter((restaurant) => {
        const matchesName = restaurant.name.toLowerCase().includes(query.toLowerCase());
        const matchesCuisine = restaurant.cuisine.toLowerCase().includes(query.toLowerCase());
        const matchesMenu = restaurant.menu.some((food) =>
          food.name.toLowerCase().includes(query.toLowerCase()) ||
          food.description.toLowerCase().includes(query.toLowerCase())
        );
        return matchesName || matchesCuisine || matchesMenu;
      });

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      {/* Search Header Input bar */}
      <View style={styles.header}>
        <View style={[styles.searchContainer, { backgroundColor: theme.backgroundElement }]}>
          <Ionicons name="search" size={20} color={theme.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Search for restaurants, items, cuisines..."
            placeholderTextColor={theme.textSecondary}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearchSubmit}
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearQuery} style={styles.clearBtn} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {query.length > 0 ? (
        <View style={styles.resultsContainer}>
          {/* Results Section */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Search Results ({matchingRestaurants.length})
          </Text>

          {matchingRestaurants.length === 0 ? (
            <View style={styles.emptyResults}>
              <Ionicons name="search-outline" size={54} color={theme.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No Results Found</Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                {"We couldn't find matches for \"" + query + "\". Try checking your spelling."}
              </Text>
            </View>
          ) : (
            <FlatList
              data={matchingRestaurants}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 110 }}
              renderItem={({ item, index }) => {
                // Find if there is a menu item that matches the query for visual feedback
                const matchingFoodItem = item.menu.find(
                  (food) =>
                    food.name.toLowerCase().includes(query.toLowerCase()) ||
                    food.description.toLowerCase().includes(query.toLowerCase())
                );

                return (
                  <Animated.View entering={FadeInDown.duration(400).delay(index * 60)}>
                    <TouchableOpacity
                      style={[
                        styles.resultCard,
                        {
                          backgroundColor:
                            theme.background === '#ffffff' ? '#FFF' : theme.backgroundElement,
                        },
                      ]}
                      activeOpacity={0.9}
                      onPress={() => handleCardPress(item.id, item.name, item.menu[0]?.price)}
                    >
                      <Image source={{ uri: item.image }} style={styles.resultImage} />
                      <View style={styles.resultDetails}>
                        <View style={styles.resultRow}>
                          <Text style={[styles.resultName, { color: theme.text }]}>{item.name}</Text>
                          <View style={styles.metaBadge}>
                            <Ionicons name="star" size={12} color="#FFB03B" />
                            <Text style={[styles.metaText, { color: theme.text }]}>{item.rating}</Text>
                          </View>
                        </View>
                        <Text style={[styles.resultCuisine, { color: theme.textSecondary }]}>
                          {item.cuisine}
                        </Text>

                        <View style={styles.resultMeta}>
                          <Text style={[styles.metaTime, { color: theme.textSecondary }]}>
                            {item.deliveryTime}
                          </Text>
                          <View style={styles.dotSeparator} />
                          <Text style={[styles.metaFee, { color: theme.textSecondary }]}>
                            ₹{item.deliveryFee} delivery
                          </Text>
                        </View>

                        {matchingFoodItem && (
                          <View
                            style={[
                              styles.matchingFoodBadge,
                              { backgroundColor: theme.backgroundElement },
                            ]}
                          >
                            <Ionicons name="restaurant-outline" size={12} color="#FF4B3A" />
                            <Text
                              style={[styles.matchingFoodText, { color: theme.textSecondary }]}
                              numberOfLines={1}
                            >
                              Includes:{' '}
                              <Text style={{ fontWeight: '800', color: theme.text }}>
                                {matchingFoodItem.name}
                              </Text>{' '}
                              (₹{matchingFoodItem.price})
                            </Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              }}
            />
          )}
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.discoverScroll}>
          {/* Discover Screen Standard View */}
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={styles.recentContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Searches</Text>
                <TouchableOpacity onPress={handleClearAllRecent}>
                  <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.recentTagsContainer}>
                {recentSearches.map((search, idx) => (
                  <Animated.View
                    key={`search-${idx}`}
                    entering={FadeIn.delay(idx * 50)}
                    layout={Layout.springify()}
                  >
                    <TouchableOpacity
                      style={[styles.recentTag, { backgroundColor: theme.backgroundElement }]}
                      activeOpacity={0.7}
                      onPress={() => handleCategoryPress(search)}
                    >
                      <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
                      <Text style={[styles.recentTagText, { color: theme.text }]}>{search}</Text>
                      <TouchableOpacity
                        onPress={() => handleDeleteRecent(search)}
                        style={styles.recentDeleteBtn}
                      >
                        <Ionicons name="close" size={14} color={theme.textSecondary} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </View>
          )}

          {/* Trending Searches */}
          <View style={styles.trendingContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Trending Searches</Text>
            <View style={styles.trendingTagsContainer}>
              {TRENDING_SEARCHES.map((item, idx) => (
                <TouchableOpacity
                  key={`trending-${idx}`}
                  style={[
                    styles.trendingTag,
                    {
                      backgroundColor: theme.backgroundElement,
                      borderColor: theme.border,
                      borderWidth: 1,
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handleCategoryPress(item)}
                >
                  <Ionicons name="trending-up-outline" size={14} color="#FF4B3A" />
                  <Text style={[styles.trendingTagText, { color: theme.text }]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Categories Grid Selector */}
          <View style={styles.gridSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Browse Cuisines</Text>
            <View style={styles.gridContainer}>
              {SEARCH_CATEGORIES.map((item, idx) => (
                <Animated.View
                  key={item.id}
                  entering={FadeInDown.duration(400).delay(idx * 80)}
                  style={styles.gridItemWrapper}
                >
                  <TouchableOpacity
                    style={[styles.gridCard, { backgroundColor: item.gradient[0] }]}
                    activeOpacity={0.85}
                    onPress={() => handleCategoryPress(item.searchKey)}
                  >
                    <View style={styles.gridIconCircle}>
                      <Ionicons name={item.icon as any} size={22} color={item.gradient[0]} />
                    </View>
                    <Text style={styles.gridTitle}>{item.name}</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontWeight: '500',
  },
  clearBtn: {
    padding: 4,
  },
  discoverScroll: {
    paddingHorizontal: 24,
    paddingBottom: 110,
  },
  recentContainer: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  clearAllText: {
    color: '#FF4B3A',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  recentTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  recentTagText: {
    fontSize: 14,
    fontWeight: '600',
  },
  recentDeleteBtn: {
    padding: 2,
    marginLeft: 4,
  },
  trendingContainer: {
    marginBottom: 24,
  },
  trendingTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  trendingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  trendingTagText: {
    fontSize: 13,
    fontWeight: '700',
  },
  gridSection: {
    marginTop: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItemWrapper: {
    width: '48%',
    marginBottom: 4,
  },
  gridCard: {
    height: 120,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  gridIconCircle: {
    backgroundColor: '#FFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  resultCard: {
    flexDirection: 'row',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  resultImage: {
    width: 90,
    height: 90,
    borderRadius: 14,
  },
  resultDetails: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultName: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
    flex: 1,
    marginRight: 6,
  },
  resultCuisine: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#8E8E93',
    marginHorizontal: 6,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '700',
  },
  metaTime: {
    fontSize: 12,
    fontWeight: '600',
  },
  metaFee: {
    fontSize: 12,
    fontWeight: '600',
  },
  matchingFoodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
    gap: 6,
  },
  matchingFoodText: {
    fontSize: 11,
    fontWeight: '500',
    flex: 1,
  },
  emptyResults: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
});
