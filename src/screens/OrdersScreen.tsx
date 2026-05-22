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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

import { useApp, Order, OrderStatus } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';

export default function OrdersScreen() {
  const { orders, addToCart, restaurants } = useApp();
  const theme = useTheme();
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const activeOrders = orders.filter((o) => o.status !== 'DELIVERED');
  const pastOrders = orders.filter((o) => o.status === 'DELIVERED');

  const handleReorder = (order: Order) => {
    // Find restaurant in our db
    const restaurant = restaurants.find((r) => r.name === order.restaurantName);
    if (!restaurant) return;

    // Add each item back to the cart
    order.items.forEach((item) => {
      // Find item details from restaurant menu
      const menuItem = restaurant.menu.find((m) => m.name === item.name);
      if (menuItem) {
        addToCart(menuItem, restaurant);
      }
    });

    // Navigate to Cart
    (navigation as any).navigate('Cart');
  };

  // Helper to render stepper status
  const renderDeliveryTracker = (status: OrderStatus) => {
    const steps: { label: string; icon: keyof typeof Ionicons.glyphMap; statusKey: OrderStatus }[] = [
      { label: 'Placed', icon: 'checkmark-circle', statusKey: 'PLACED' },
      { label: 'Preparing', icon: 'flame', statusKey: 'PREPARING' },
      { label: 'In Transit', icon: 'bicycle', statusKey: 'TRANSIT' },
      { label: 'Delivered', icon: 'gift', statusKey: 'DELIVERED' },
    ];

    const getStatusIndex = (current: OrderStatus) => {
      if (current === 'PLACED') return 0;
      if (current === 'PREPARING') return 1;
      if (current === 'TRANSIT') return 2;
      return 3;
    };

    const currentIdx = getStatusIndex(status);

    return (
      <View style={styles.trackerContainer}>
        <Text style={[styles.trackerTitle, { color: theme.text }]}>Live Tracking</Text>
        <View style={styles.stepperWrapper}>
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentIdx;
            const isActive = idx === currentIdx;
            const color = isCompleted ? '#FF4B3A' : theme.textSecondary;

            return (
              <React.Fragment key={step.statusKey}>
                {/* Step Connector line */}
                {idx > 0 && (
                  <View
                    style={[
                      styles.connectorLine,
                      {
                        backgroundColor: idx <= currentIdx ? '#FF4B3A' : theme.backgroundElement,
                      },
                    ]}
                  />
                )}
                
                {/* Step Dot & Label */}
                <View style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepIconWrapper,
                      {
                        backgroundColor: isCompleted ? '#FF4B3A' : theme.backgroundElement,
                        borderColor: isActive ? '#FFB03B' : 'transparent',
                        borderWidth: isActive ? 2 : 0,
                      },
                    ]}
                  >
                    <Ionicons name={step.icon} size={14} color={isCompleted ? '#FFF' : theme.textSecondary} />
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      {
                        color: isCompleted ? theme.text : theme.textSecondary,
                        fontWeight: isCompleted ? '700' : '500',
                      },
                    ]}
                  >
                    {step.label}
                  </Text>
                </View>
              </React.Fragment>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Navigation Headers */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Orders</Text>
      </View>

      {/* Segmented Selection Control */}
      <View style={[styles.tabBar, { backgroundColor: theme.backgroundElement }]}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'active' && styles.activeTabButton]}
          onPress={() => setActiveTab('active')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === 'active' ? '#FF4B3A' : theme.textSecondary },
            ]}
          >
            Active Orders ({activeOrders.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'history' && styles.activeTabButton]}
          onPress={() => setActiveTab('history')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === 'history' ? '#FF4B3A' : theme.textSecondary },
            ]}
          >
            Past Receipts ({pastOrders.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Interactive Lists */}
      {activeTab === 'active' ? (
        activeOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="receipt-outline" size={44} color="#FF4B3A" />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No Active Feasts</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              Place an order from Burger Bistro or Pizzeria Bella Vita to track its live delivery steps here!
            </Text>
          </View>
        ) : (
          <FlatList
            data={activeOrders}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Animated.View entering={FadeInDown.duration(500).delay(index * 100)} style={[styles.orderCard, { backgroundColor: theme.background === '#ffffff' ? '#FFF' : theme.backgroundElement }]}>
                {/* Restaurant Info Header */}
                <View style={styles.cardHeader}>
                  <Image source={{ uri: item.restaurantImage }} style={styles.restaurantImage as any} />
                  <View style={styles.headerDetails}>
                    <Text style={[styles.restaurantName, { color: theme.text }]}>{item.restaurantName}</Text>
                    <Text style={[styles.orderDate, { color: theme.textSecondary }]}>
                      Placed today • ID: {item.id}
                    </Text>
                  </View>
                  <View style={styles.activeStatusTag}>
                    <Text style={styles.activeStatusTagText}>In Progress</Text>
                  </View>
                </View>

                {/* Items Description */}
                <View style={styles.itemsSummary}>
                  {item.items.map((cartItem) => (
                    <View key={cartItem.id} style={styles.itemRow}>
                      <Text style={[styles.itemText, { color: theme.text }]}>
                        {cartItem.quantity}x <Text style={{ fontWeight: '500' }}>{cartItem.name}</Text>
                      </Text>
                      <Text style={[styles.itemPrice, { color: theme.text }]}>
                        ${(cartItem.price * cartItem.quantity).toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Live Stepper Tracker */}
                {renderDeliveryTracker(item.status)}

                {/* Price Summary footer */}
                <View style={[styles.cardFooter, { borderTopColor: theme.backgroundElement }]}>
                  <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>Total Billing</Text>
                  <Text style={[styles.totalAmount, { color: '#FF4B3A' }]}>${item.total.toFixed(2)}</Text>
                </View>
              </Animated.View>
            )}
          />
        )
      ) : pastOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="archive-outline" size={44} color={theme.textSecondary} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>History is Empty</Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            You haven't ordered anything yet. Once a delivery reaches status "Delivered", it resides in history!
          </Text>
        </View>
      ) : (
        <FlatList
          data={pastOrders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.duration(500).delay(index * 100)} style={[styles.orderCard, { backgroundColor: theme.background === '#ffffff' ? '#FFF' : theme.backgroundElement }]}>
              {/* Restaurant Info Header */}
              <View style={styles.cardHeader}>
                <Image source={{ uri: item.restaurantImage }} style={styles.restaurantImage as any} />
                <View style={styles.headerDetails}>
                  <Text style={[styles.restaurantName, { color: theme.text }]}>{item.restaurantName}</Text>
                  <Text style={[styles.orderDate, { color: theme.textSecondary }]}>
                    Ordered on {item.date} • ID: {item.id}
                  </Text>
                </View>
                <View style={styles.deliveredTag}>
                  <Text style={styles.deliveredTagText}>Completed</Text>
                </View>
              </View>

              {/* Receipt Summary */}
              <View style={styles.itemsSummary}>
                {item.items.map((cartItem) => (
                  <View key={cartItem.id} style={styles.itemRow}>
                    <Text style={[styles.itemText, { color: theme.textSecondary }]}>
                      {cartItem.quantity}x {cartItem.name}
                    </Text>
                    <Text style={[styles.itemPrice, { color: theme.textSecondary }]}>
                      ${(cartItem.price * cartItem.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Price Details + Action row */}
              <View style={[styles.cardFooter, { borderTopColor: theme.backgroundElement, paddingTop: 14 }]}>
                <View>
                  <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>Receipt Total</Text>
                  <Text style={[styles.totalAmount, { color: theme.text }]}>${item.total.toFixed(2)}</Text>
                </View>

                <TouchableOpacity
                  style={styles.reorderButton}
                  onPress={() => handleReorder(item)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="repeat" size={16} color="#FFF" />
                  <Text style={styles.reorderText}>Reorder</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        />
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 24,
    height: 52,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTabButton: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  orderCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  restaurantImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  headerDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  orderDate: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  activeStatusTag: {
    backgroundColor: '#FFF0EE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  activeStatusTagText: {
    color: '#FF4B3A',
    fontSize: 11,
    fontWeight: '800',
  },
  deliveredTag: {
    backgroundColor: '#EEFCEF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  deliveredTagText: {
    color: '#4CD964',
    fontSize: 11,
    fontWeight: '800',
  },
  itemsSummary: {
    marginBottom: 16,
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 14,
    fontWeight: '700',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  trackerContainer: {
    backgroundColor: 'rgba(255, 75, 58, 0.03)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 75, 58, 0.08)',
    marginBottom: 16,
  },
  trackerTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  stepperWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    width: 60,
  },
  stepIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: 10,
    marginTop: 6,
    textAlign: 'center',
  },
  connectorLine: {
    flex: 1,
    height: 3,
    marginTop: -16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  reorderButton: {
    backgroundColor: '#FF4B3A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#FF4B3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  reorderText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF0EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
});
