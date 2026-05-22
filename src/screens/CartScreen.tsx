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
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';

const TIPS = [
  { label: 'No Tip', value: 0 },
  { label: '₹20', value: 20 },
  { label: '₹30', value: 30 },
  { label: '₹50', value: 50 },
];

const DELIVERY_INSTRUCTIONS = [
  { id: 'no_ring', label: 'Avoid ringing bell', icon: '🔕' },
  { id: 'gate', label: 'Leave at gate', icon: '🚪' },
  { id: 'no_contact', label: 'No contact delivery', icon: '🛑' },
  { id: 'call', label: 'Call before delivery', icon: '📞' },
];

export default function CartScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { cart, activeRestaurant, updateQuantity, removeFromCart, placeOrder } = useApp();

  const [selectedTip, setSelectedTip] = useState(30);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  // Promo Code States
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Delivery Instruction States
  const [selectedInstructions, setSelectedInstructions] = useState<string[]>([]);
  const [customNotes, setCustomNotes] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = activeRestaurant ? activeRestaurant.deliveryFee : 0;
  const tax = subtotal * 0.08; // 8% GST & Restaurant Charges

  // Promo Calculations
  let discount = 0;
  if (appliedPromo === 'BIRYANI50') {
    if (subtotal >= 300) {
      discount = 100;
    }
  } else if (appliedPromo === 'WELCOMEFEAST') {
    discount = subtotal * 0.15;
  }

  const total = Math.max(0, subtotal + deliveryFee + tax + selectedTip - discount);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoError('Please enter a promo code');
      return;
    }

    if (code === 'BIRYANI50') {
      if (subtotal < 300) {
        setPromoError('Minimum order value for BIRYANI50 is ₹300');
        setAppliedPromo(null);
      } else {
        setAppliedPromo('BIRYANI50');
        setPromoError(null);
      }
    } else if (code === 'WELCOMEFEAST') {
      setAppliedPromo('WELCOMEFEAST');
      setPromoError(null);
    } else {
      setPromoError('Invalid promo code. Try BIRYANI50!');
      setAppliedPromo(null);
    }
  };

  const handleQuickApply = (code: string) => {
    if (code === 'BIRYANI50') {
      if (subtotal < 300) {
        setPromoError('Minimum order value for BIRYANI50 is ₹300');
        setAppliedPromo(null);
      } else {
        setAppliedPromo('BIRYANI50');
        setPromoError(null);
      }
    } else if (code === 'WELCOMEFEAST') {
      setAppliedPromo('WELCOMEFEAST');
      setPromoError(null);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError(null);
  };

  const toggleInstruction = (id: string) => {
    setSelectedInstructions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCheckout = () => {
    const order = placeOrder(selectedTip, discount);
    if (order) {
      setPlacedOrderId(order.id);
      setSuccessModalVisible(true);
    }
  };

  const handleTrackDelivery = () => {
    setSuccessModalVisible(false);
    // Reset navigation stack to Main bottom tabs with Orders tab active
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Main',
          state: {
            routes: [
              { name: 'Orders' }
            ]
          }
        }
      ]
    } as any);
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
        <View style={styles.emptyContainer}>
          {/* Empty State */}
          <View style={styles.emptyIconCircle}>
            <Ionicons name="cart-outline" size={48} color={theme.textSecondary} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Your Cart is Empty</Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            Go back to Meghana Biryani Palace or CTR Shri Sagar and add some delicious local delicacies to your cart!
          </Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
            <Text style={styles.browseBtnText}>Browse Restaurants</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {/* Checkout Form Content */}
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

            {/* Estimated Delivery Timeline Banner */}
            <View style={[styles.etaBanner, { backgroundColor: theme.backgroundElement }]}>
              <View style={[styles.etaIconCircle, { backgroundColor: 'rgba(255, 75, 58, 0.1)' }]}>
                <Ionicons name="time" size={20} color="#FF4B3A" />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={[styles.etaText, { color: theme.text }]}>
                  Delivering in <Text style={{ fontWeight: '800', color: '#FF4B3A' }}>25-35 mins</Text>
                </Text>
                <Text style={[styles.etaLocationText, { color: theme.textSecondary }]}>
                  to Koramangala, Bangalore
                </Text>
              </View>
            </View>

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
                    <Text style={styles.itemPrice}>₹{item.price}</Text>
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

            {/* Promo Coupon Section */}
            <View style={styles.promoSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Apply Promo Code</Text>
              <View style={styles.promoInputRow}>
                <TextInput
                  style={[
                    styles.promoInput,
                    {
                      backgroundColor: theme.backgroundElement,
                      color: theme.text,
                      borderColor: promoError ? '#FF3B30' : appliedPromo ? '#4CD964' : theme.backgroundElement,
                    },
                  ]}
                  placeholder="Enter coupon (e.g. BIRYANI50)"
                  placeholderTextColor={theme.textSecondary}
                  value={promoCode}
                  onChangeText={(text) => {
                    setPromoCode(text);
                    if (promoError) setPromoError(null);
                  }}
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  style={[
                    styles.promoApplyBtn,
                    { backgroundColor: appliedPromo ? '#4CD964' : '#FF4B3A' },
                  ]}
                  onPress={handleApplyPromo}
                  activeOpacity={0.8}
                >
                  <Text style={styles.promoApplyText}>{appliedPromo ? 'Applied' : 'Apply'}</Text>
                </TouchableOpacity>
              </View>
              {promoError && <Text style={styles.promoErrorText}>{promoError}</Text>}
              {appliedPromo && (
                <View style={[styles.promoSuccessRow, { backgroundColor: theme.background === '#ffffff' ? '#EBFBEE' : 'rgba(76, 217, 100, 0.1)' }]}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CD964" />
                  <Text style={[styles.promoSuccessText, { color: theme.text }]}>
                    Code <Text style={{ fontWeight: '700' }}>{appliedPromo}</Text> applied! Saved <Text style={{ fontWeight: '800', color: '#4CD964' }}>₹{discount.toFixed(0)}</Text>
                  </Text>
                  <TouchableOpacity onPress={handleRemovePromo} style={{ marginLeft: 'auto' }}>
                    <Text style={{ color: '#FF3B30', fontWeight: '700', fontSize: 12 }}>Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* Quick Tap Coupon Suggestion Chips */}
              <View style={styles.couponChipsRow}>
                <TouchableOpacity
                  style={[
                    styles.couponChip,
                    {
                      backgroundColor: theme.backgroundElement,
                      borderColor: appliedPromo === 'BIRYANI50' ? '#FF4B3A' : 'transparent',
                    },
                  ]}
                  onPress={() => {
                    setPromoCode('BIRYANI50');
                    handleQuickApply('BIRYANI50');
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.couponChipTitle, { color: theme.text }]}>BIRYANI50</Text>
                  <Text style={[styles.couponChipDesc, { color: theme.textSecondary }]}>₹100 Off (Min ₹300)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.couponChip,
                    {
                      backgroundColor: theme.backgroundElement,
                      borderColor: appliedPromo === 'WELCOMEFEAST' ? '#FF4B3A' : 'transparent',
                    },
                  ]}
                  onPress={() => {
                    setPromoCode('WELCOMEFEAST');
                    handleQuickApply('WELCOMEFEAST');
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.couponChipTitle, { color: theme.text }]}>WELCOMEFEAST</Text>
                  <Text style={[styles.couponChipDesc, { color: theme.textSecondary }]}>15% Off (No Min)</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Delivery Instructions Section */}
            <View style={styles.instructionsSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Delivery Instructions</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.instructionChipsRow}>
                {DELIVERY_INSTRUCTIONS.map((instruction) => {
                  const isSelected = selectedInstructions.includes(instruction.id);
                  return (
                    <TouchableOpacity
                      key={instruction.id}
                      style={[
                        styles.instructionChip,
                        {
                          backgroundColor: isSelected ? '#FF4B3A' : theme.backgroundElement,
                          borderColor: isSelected ? '#FF4B3A' : 'transparent',
                        },
                      ]}
                      onPress={() => toggleInstruction(instruction.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.instructionChipIcon, { marginRight: 6 }]}>{instruction.icon}</Text>
                      <Text
                        style={[
                          styles.instructionChipText,
                          { color: isSelected ? '#FFF' : theme.text },
                        ]}
                      >
                        {instruction.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              
              {/* Custom Note input */}
              <View style={[styles.notesContainer, { backgroundColor: theme.backgroundElement }]}>
                <Ionicons name="document-text-outline" size={18} color={theme.textSecondary} style={{ marginRight: 10, marginTop: Platform.OS === 'ios' ? 2 : 4 }} />
                <TextInput
                  style={[styles.notesInput, { color: theme.text }]}
                  placeholder="Add note for delivery partner (e.g. Leave with guard...)"
                  placeholderTextColor={theme.textSecondary}
                  value={customNotes}
                  onChangeText={setCustomNotes}
                  multiline
                  numberOfLines={2}
                />
              </View>
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
                <Text style={[styles.receiptValue, { color: theme.text }]}>₹{subtotal.toFixed(0)}</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={[styles.receiptLabel, { color: theme.textSecondary }]}>Delivery Fee</Text>
                <Text style={[styles.receiptValue, { color: theme.text }]}>₹{deliveryFee.toFixed(0)}</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={[styles.receiptLabel, { color: theme.textSecondary }]}>GST & Restaurant Charges (8%)</Text>
                <Text style={[styles.receiptValue, { color: theme.text }]}>₹{tax.toFixed(0)}</Text>
              </View>

              {selectedTip > 0 && (
                <View style={styles.receiptRow}>
                  <Text style={[styles.receiptLabel, { color: theme.textSecondary }]}>Driver Gratuity</Text>
                  <Text style={[styles.receiptValue, { color: '#4CD964' }]}>+₹{selectedTip.toFixed(0)}</Text>
                </View>
              )}

              {discount > 0 && (
                <View style={styles.receiptRow}>
                  <Text style={[styles.receiptLabel, { color: '#4CD964' }]}>Promo Discount ({appliedPromo})</Text>
                  <Text style={[styles.receiptValue, { color: '#4CD964' }]}>-₹{discount.toFixed(0)}</Text>
                </View>
              )}

              <View style={[styles.receiptDivider, { backgroundColor: theme.background }]} />

              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: theme.text }]}>Total Billing</Text>
                <Text style={styles.totalValue}>₹{total.toFixed(0)}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Place Order Sticky Bottom Action */}
          <View style={[styles.footer, { borderTopColor: theme.backgroundElement, paddingBottom: Math.max(24, insets.bottom) }]}>
            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout} activeOpacity={0.85}>
              <Text style={styles.checkoutBtnText}>Place Delivery Order</Text>
              <View style={styles.checkoutPriceBadge}>
                <Text style={styles.checkoutPriceText}>₹{total.toFixed(0)}</Text>
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
              {activeRestaurant ? activeRestaurant.name : 'The restaurant'} has received your ticket and is preparing fresh local dishes. Track it live on the Orders screen!
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
  etaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 14,
    marginBottom: 24,
  },
  etaIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  etaText: {
    fontSize: 14,
    fontWeight: '600',
  },
  etaLocationText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  promoSection: {
    marginBottom: 24,
  },
  promoInputRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  promoInput: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
    borderWidth: 1.5,
  },
  promoApplyBtn: {
    height: 52,
    paddingHorizontal: 22,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoApplyText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  promoErrorText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    marginLeft: 4,
  },
  promoSuccessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 12,
    gap: 6,
  },
  promoSuccessText: {
    fontSize: 13,
    fontWeight: '600',
  },
  couponChipsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  couponChip: {
    flex: 1,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  couponChipTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  couponChipDesc: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  instructionsSection: {
    marginBottom: 24,
  },
  instructionChipsRow: {
    gap: 8,
    paddingRight: 10,
    paddingBottom: 4,
  },
  instructionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  instructionChipIcon: {
    fontSize: 14,
  },
  instructionChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
  },
  notesInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    height: 48,
    textAlignVertical: 'top',
    padding: 0,
  },
});
