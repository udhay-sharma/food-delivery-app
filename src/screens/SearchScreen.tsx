import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';
import { RootStackParamList } from '@/navigation/AppNavigator';

const SEARCH_CATEGORIES = [
  { id: '1', name: 'Fast Food', gradient: ['#FF5E36', '#FF8F3D'], icon: 'hamburger' },
  { id: '2', name: 'Salads & Healthy', gradient: ['#4CD964', '#5AD8A6'], icon: 'leaf' },
  { id: '3', name: 'Pizza & Pasta', gradient: ['#FF9500', '#FFCC00'], icon: 'pizza' },
  { id: '4', name: 'Asian Cuisines', gradient: ['#5856D6', '#8E8E93'], icon: 'restaurant' },
  { id: '5', name: 'Sweet Bakery', gradient: ['#FF2D55', '#FF5B7F'], icon: 'ice-cream' },
  { id: '6', name: 'Coffee & Drinks', gradient: ['#007AFF', '#05A2FF'], icon: 'cafe' },
];

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function SearchScreen() {
  const { restaurants } = useApp();
  const theme = useTheme();
  const navigation = useNavigation<SearchScreenNavigationProp>();

  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(['Double Cheese', 'Truffle Fries', 'Pizzeria']);

  // Clear query button action
  const clearQuery = () => setQuery('');

  // Handle selecting a category
  const handleCategoryPress = (categoryName: string) => {
    setQuery(categoryName);
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

  const handleDeleteRecent = (search: string) => {
    setRecentSearches(prev => prev.filter(s => s !== search));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearQuery} style={styles.clearBtn} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {query.length > 0 ? (
        /* Results Section */
        <View style={styles.resultsContainer}>
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
              renderItem={({ item, index }) => (
                <Animated.View entering={FadeInDown.duration(400).delay(index * 60)}>
                  <TouchableOpacity
                    style={[styles.resultCard, { backgroundColor: theme.background === '#ffffff' ? '#FFF' : theme.backgroundElement }]}
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: item.id })}
                  >
                    <Image source={{ uri: item.image }} style={styles.resultImage} />
                    <View style={styles.resultDetails}>
                      <Text style={[styles.resultName, { color: theme.text }]}>{item.name}</Text>
                      <Text style={[styles.resultCuisine, { color: theme.textSecondary }]}>{item.cuisine}</Text>
                      
                      <View style={styles.resultMeta}>
                        <View style={styles.metaBadge}>
                          <Ionicons name="star" size={12} color="#FFB03B" />
                          <Text style={[styles.metaText, { color: theme.text }]}>{item.rating}</Text>
                        </View>
                        <Text style={[styles.metaTime, { color: theme.textSecondary }]}>{item.deliveryTime}</Text>
                        <Text style={[styles.metaFee, { color: theme.textSecondary }]}>${item.deliveryFee} Del.</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              )}
            />
          )}
        </View>
      ) : (
        /* Discover Screen Standard View */
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.discoverScroll}>
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={styles.recentContainer}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Searches</Text>
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
                      onPress={() => setQuery(search)}
                    >
                      <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
                      <Text style={[styles.recentTagText, { color: theme.text }]}>{search}</Text>
                      <TouchableOpacity onPress={() => handleDeleteRecent(search)} style={styles.recentDeleteBtn}>
                        <Ionicons name="close" size={14} color={theme.textSecondary} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </View>
          )}

          {/* Categories Grid Selector */}
          <View style={styles.gridSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Browse Food Types</Text>
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
                    onPress={() => handleCategoryPress(item.name.split(' ')[0])}
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
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
    paddingBottom: 40,
  },
  recentContainer: {
    marginBottom: 24,
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
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: 14,
  },
  resultDetails: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  resultName: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
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
    gap: 10,
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
