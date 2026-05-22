import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';



const TIPS = [
  { label: 'No Tip', value: 0 },
  { label: '$2.00', value: 2 },
  { label: '$3.00', value: 3 },
  { label: '$5.00', value: 5 },
];

export default function CartScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { cart, activeRestaurant, updateQuantity, removeFromCart, placeOrder } = useApp();

  const [selectedTip, setSelectedTip] = useState(3);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = activeRestaurant ? activeRestaurant.deliveryFee : 0;
  const tax = subtotal * 0.08; // 8% sales tax
  const total = subtotal + deliveryFee + tax + selectedTip;

  const handleCheckout = () => {
    const order = placeOrder(selectedTip);
    if (order) {
      setPlacedOrderId(order.id);
      setSuccessModalVisible(true);
    }
  };

  const handleTrackDelivery = () => {
    setSuccessModalVisible(false);
    navigation.goBack(); // Close Cart modal
    // Navigate to Orders Tab
    (navigation as any).navigate('Orders');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header Panel */}
      <View style={[styles.header, { borderBottomColor: theme.backgroundElement }]}>
        <TouchableOpacity style={[styles.closeBtn, { backgroundColor: theme.backgroundElement }]} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="close" size={20} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Your Cravings Cart</Text>
        <View style={{ width: 38 }} /> {/* Spacer to align title */}
      </View>

      {cart.length === 0 ? (
        /* Empty State */
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="cart-outline" size={48} color={theme.textSecondary} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Your Cart is Empty</Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            Go back to Burger Bistro or Pizzeria Bella Vita and add some delicious snacks to your cart!
          </Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
            <Text style={styles.browseBtnText}>Browse Restaurants</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Checkout Form Content */
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Active Restaurant Callout */}
            {activeRestaurant && (
              <View style={[styles.restaurantBanner, { backgroundColor: theme.backgroundElement }]}>
                <Image source={{ uri: activeRestaurant.image }} style={styles.restImage as any} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={[styles.restName, { color: theme.text }]} numberOfLines={1}>
                    {activeRestaurant.name}
                  </Text>
                  <Text style={[styles.restCuisine, { color: theme.textSecondary }]}>
                    Ordering fresh dishes
                  </Text>
                </View>
              </View>
            )}

            {/* Cart Items List */}
            <View style={styles.itemsSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Items Review</Text>
              {cart.map((item, index) => (
                <Animated.View
                  key={item.id}
                  entering={FadeInUp.duration(400).delay(index * 60)}
                  style={[styles.itemCard, { borderBottomColor: theme.backgroundElement }]}
                >
                  {item.image && <Image source={{ uri: item.image }} style={styles.itemImage as any} />}
                  
                  <View style={styles.itemDetails}>
                    <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                  </View>

                  {/* Quantity adjustments counter */}
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={[styles.qtyBtn, { backgroundColor: theme.backgroundElement }]}
                      onPress={() => updateQuantity(item.id, -1)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="remove" size={14} color={theme.text} />
                    </TouchableOpacity>
                    
                    <Text style={[styles.qtyText, { color: theme.text }]}>{item.quantity}</Text>
                    
                    <TouchableOpacity
                      style={[styles.qtyBtn, { backgroundColor: theme.backgroundElement }]}
                      onPress={() => updateQuantity(item.id, 1)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="add" size={14} color={theme.text} />
                    </TouchableOpacity>
                  </View>

                  {/* Delete Item Button */}
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => removeFromCart(item.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={16} color="#FF3B30" />
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>

            {/* Driver Tip Picker Selector */}
            <View style={styles.tipSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Support Your Courier</Text>
              <Text style={[styles.tipSubtitle, { color: theme.textSecondary }]}>
                100% of delivery tips are transferred directly to your driver.
              </Text>
              
              <View style={styles.tipRow}>
                {TIPS.map((tip) => {
                  const isSelected = selectedTip === tip.value;
                  return (
                    <TouchableOpacity
                      key={tip.label}
                      style={[
                        styles.tipCard,
                        {
                          backgroundColor: isSelected ? '#FF4B3A' : theme.backgroundElement,
                        },
                      ]}
                      onPress={() => setSelectedTip(tip.value)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.tipCardText, { color: isSelected ? '#FFF' : theme.text }]}>
                        {tip.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Billing Receipt calculations */}
            <View style={[styles.receiptSection, { backgroundColor: theme.backgroundElement }]}>
              <Text style={[styles.receiptTitle, { color: theme.text }]}>Bill Calculations</Text>
              
              <View style={styles.receiptRow}>
                <Text style={[styles.receiptLabel, { color: theme.textSecondary }]}>Basket Subtotal</Text>
                <Text style={[styles.receiptValue, { color: theme.text }]}>${subtotal.toFixed(2)}</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={[styles.receiptLabel, { color: theme.textSecondary }]}>Delivery Fee</Text>
                <Text style={[styles.receiptValue, { color: theme.text }]}>${deliveryFee.toFixed(2)}</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={[styles.receiptLabel, { color: theme.textSecondary }]}>Sales Tax & Service (8%)</Text>
                <Text style={[styles.receiptValue, { color: theme.text }]}>${tax.toFixed(2)}</Text>
              </View>

              {selectedTip > 0 && (
                <View style={styles.receiptRow}>
                  <Text style={[styles.receiptLabel, { color: theme.textSecondary }]}>Driver Gratuity</Text>
                  <Text style={[styles.receiptValue, { color: '#4CD964' }]}>+${selectedTip.toFixed(2)}</Text>
                </View>
              )}

              <View style={[styles.receiptDivider, { backgroundColor: theme.background }]} />

              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: theme.text }]}>Total Billing</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Place Order Sticky Bottom Action */}
          <View style={[styles.footer, { borderTopColor: theme.backgroundElement }]}>
            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout} activeOpacity={0.85}>
              <Text style={styles.checkoutBtnText}>Place Delivery Order</Text>
              <View style={styles.checkoutPriceBadge}>
                <Text style={styles.checkoutPriceText}>${total.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Modern Success Animation Checkout Overlay Modal */}
      <Modal visible={successModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View entering={ZoomIn.duration(400)} style={[styles.modalCard, { backgroundColor: theme.background === '#ffffff' ? '#FFF' : theme.backgroundElement }]}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-done" size={48} color="#FFF" />
            </View>

            <Text style={[styles.modalTitle, { color: theme.text }]}>Order Placed!</Text>
            <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
              Your receipt has been authorized. Order ID: <Text style={{ fontWeight: '700', color: '#FF4B3A' }}>{placedOrderId}</Text>
            </Text>
            <Text style={[styles.modalParagraph, { color: theme.textSecondary }]}>
              Burger Bistro has received your ticket and is preparing flame-grilled dishes. Track it live on the Orders screen!
            </Text>

            <TouchableOpacity style={styles.trackBtn} onPress={handleTrackDelivery} activeOpacity={0.85}>
              <Text style={styles.trackBtnText}>Track Your Delivery</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  restaurantBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 14,
    marginBottom: 24,
  },
  restImage: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  restName: {
    fontSize: 16,
    fontWeight: '800',
  },
  restCuisine: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  itemsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
  },
  itemPrice: {
    color: '#FF4B3A',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginRight: 10,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '800',
  },
  deleteBtn: {
    padding: 6,
  },
  tipSection: {
    marginBottom: 24,
  },
  tipSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: -8,
    marginBottom: 12,
  },
  tipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tipCard: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipCardText: {
    fontSize: 13,
    fontWeight: '700',
  },
  receiptSection: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  receiptTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 14,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  receiptLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  receiptValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  receiptDivider: {
    height: 1,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  totalValue: {
    color: '#FF4B3A',
    fontSize: 22,
    fontWeight: '800',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
  },
  checkoutBtn: {
    backgroundColor: '#FF4B3A',
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 6,
    shadowColor: '#FF4B3A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  checkoutBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  checkoutPriceBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  checkoutPriceText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  browseBtn: {
    backgroundColor: '#FF4B3A',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#FF4B3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  browseBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalCard: {
    width: '100%',
    borderRadius: 32,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  successIconCircle: {
    backgroundColor: '#4CD964',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#4CD964',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
  },
  modalParagraph: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 14,
    marginBottom: 24,
    paddingHorizontal: 6,
  },
  trackBtn: {
    backgroundColor: '#FF4B3A',
    width: '100%',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4B3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  trackBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
