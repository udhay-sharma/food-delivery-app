import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaces for our data models
export interface FoodItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  deliveryTime: string;
  deliveryFee: number;
  cuisine: string;
  image: string;
  promo?: string;
  menu: FoodItem[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export type OrderStatus = 'PLACED' | 'PREPARING' | 'TRANSIT' | 'DELIVERED';

export interface Order {
  id: string;
  restaurantName: string;
  restaurantImage: string;
  items: CartItem[];
  subtotal: number;
  tip: number;
  total: number;
  status: OrderStatus;
  date: string;
}

interface AppContextType {
  restaurants: Restaurant[];
  cart: CartItem[];
  activeRestaurant: Restaurant | null;
  orders: Order[];
  isOnboarded: boolean;
  isLoggedIn: boolean;
  isLoading: boolean;
  userProfile: {
    name: string;
    email: string;
    avatar: string;
    level: string;
    points: number;
    balance: number;
    memberSince: string;
    favCuisine: string;
    totalOrders: number;
    savedAddresses: number;
  };
  addToCart: (item: FoodItem, restaurant: Restaurant) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  placeOrder: (tipAmount: number, discountAmount?: number) => Order | null;
  completeOnboarding: () => void;
  login: () => void;
  logout: () => void;
  updateProfile: (name: string, email: string, favCuisine: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// High-quality dummy data localized for India (Bangalore)
const DUMMY_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Meghana Biryani Palace',
    cuisine: 'Biryani, North Indian',
    rating: 4.8,
    reviewsCount: 2480,
    deliveryTime: '25-35 min',
    deliveryFee: 39,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    promo: 'Flat ₹100 Off with BIRYANI50',
    menu: [
      {
        id: 'food-1-1',
        name: 'Meghana Chicken Biryani',
        price: 329,
        description: 'Our signature basmati rice biryani cooked with succulent tender chicken chunks, rich spices, and served with spicy raita.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=60',
        category: 'Popular',
      },
      {
        id: 'food-1-2',
        name: 'Paneer Tikka Biryani',
        price: 289,
        description: 'Fragrant long-grain basmati rice layered with soft chargrilled paneer cubes, saffron, and house biryani spices.',
        image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400&auto=format&fit=crop&q=60',
        category: 'Biryani',
      },
      {
        id: 'food-1-3',
        name: 'Empire Chicken Kebab (6 Pcs)',
        price: 219,
        description: 'Deep-fried crispy, spicy chicken pieces marinated in local spices and served with fresh lemon slices and onions.',
        image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&auto=format&fit=crop&q=60',
        category: 'Starters',
      },
    ],
  },
  {
    id: 'rest-2',
    name: 'CTR Shri Sagar',
    cuisine: 'South Indian, Dosa',
    rating: 4.9,
    reviewsCount: 3120,
    deliveryTime: '15-20 min',
    deliveryFee: 29,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
    promo: '₹40 Off on Orders above ₹199',
    menu: [
      {
        id: 'food-2-1',
        name: 'CTR Benne Masala Dosa',
        price: 110,
        description: 'Crispy golden brown rice crepe enriched with generous dollops of local butter, spiced potato mash, and fresh coconut chutney.',
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&auto=format&fit=crop&q=60',
        category: 'Popular',
      },
      {
        id: 'food-2-2',
        name: 'Idli Vada Combo',
        price: 80,
        description: 'Two soft, fluffy steamed rice cakes (idli) paired with a crispy, savory lentil donut (vada) served with sambar.',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop&q=60',
        category: 'South Indian',
      },
      {
        id: 'food-2-3',
        name: 'Traditional Filter Coffee',
        price: 45,
        description: 'Iconic hot brew made by mixing frothed, chicory-infused milk with traditional drip-decoction.',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=60',
        category: 'Drinks',
      },
    ],
  },
  {
    id: 'rest-3',
    name: 'Empire Restaurant & Grill',
    cuisine: 'North Indian, Rolls',
    rating: 4.7,
    reviewsCount: 1940,
    deliveryTime: '20-30 min',
    deliveryFee: 39,
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80',
    promo: 'Buy 1 Get 1 on Chicken Rolls',
    menu: [
      {
        id: 'food-3-1',
        name: 'Double Chicken Double Egg Roll',
        price: 189,
        description: 'Soft layered paratha wrapped with double flame-grilled chicken, egg omelette, chopped onions, and chatpata mint chutney.',
        image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&auto=format&fit=crop&q=60',
        category: 'Popular',
      },
      {
        id: 'food-3-2',
        name: 'Paneer Tikka Roll',
        price: 159,
        description: 'Grilled tandoori paneer wrapped in flatbread with green peppers, onions, and house mayonnaise.',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop&q=60',
        category: 'Rolls',
      },
      {
        id: 'food-3-3',
        name: 'Butter Chicken Masala',
        price: 349,
        description: 'Rich, creamy, buttery gravy with tandoori grilled chicken chunks tossed in tomato and cashew sauce.',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&auto=format&fit=crop&q=60',
        category: 'North Indian',
      },
    ],
  },
  {
    id: 'rest-4',
    name: 'Corner House Ice Creams',
    cuisine: 'Desserts & Shakes',
    rating: 4.9,
    reviewsCount: 4150,
    deliveryTime: '10-20 min',
    deliveryFee: 19,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80',
    promo: 'Free Cookie on Orders ₹250+',
    menu: [
      {
        id: 'food-4-1',
        name: 'Death by Chocolate Sundae',
        price: 249,
        description: 'Legendary sundae featuring layers of warm chocolate cake, vanilla ice cream, hot chocolate fudge, and roasted peanuts.',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=60',
        category: 'Popular',
      },
      {
        id: 'food-4-2',
        name: 'Thick Mango Shake',
        price: 179,
        description: 'Rich mango pulp blended with premium vanilla cream, chilled milk, topped with mango chunks.',
        image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&auto=format&fit=crop&q=60',
        category: 'Shakes',
      },
    ],
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-9302',
      restaurantName: 'CTR Shri Sagar',
      restaurantImage: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
      items: [
        { id: 'food-2-1', name: 'CTR Benne Masala Dosa', price: 110, quantity: 2 },
        { id: 'food-2-3', name: 'Traditional Filter Coffee', price: 45, quantity: 1 }
      ],
      subtotal: 265,
      tip: 30,
      total: 334,
      status: 'DELIVERED',
      date: 'May 20, 2026',
    }
  ]);

  const [userProfile, setUserProfile] = useState({
    name: 'Arjun Sharma',
    email: 'arjun.sharma@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    level: 'Biryani Boss',
    points: 850,
    balance: 2450.00,
    memberSince: 'Oct 2023',
    favCuisine: 'South Indian & Biryani',
    totalOrders: 142,
    savedAddresses: 3,
  });

  // Automatically advance any active order status in background for high fidelity
  useEffect(() => {
    const activeOrderIndices = orders
      .map((o, idx) => ({ ...o, idx }))
      .filter((o) => o.status !== 'DELIVERED');

    if (activeOrderIndices.length === 0) return;

    const timer = setTimeout(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.status === 'PLACED') {
            return { ...order, status: 'PREPARING' };
          } else if (order.status === 'PREPARING') {
            return { ...order, status: 'TRANSIT' };
          } else if (order.status === 'TRANSIT') {
            return { ...order, status: 'DELIVERED' };
          }
          return order;
        })
      );
    }, 15000); // Progress the delivery simulation every 15 seconds!

    return () => clearTimeout(timer);
  }, [orders]);

  const addToCart = (item: FoodItem, restaurant: Restaurant) => {
    // If buying from a new restaurant, clear old cart automatically
    if (activeRestaurant && activeRestaurant.id !== restaurant.id) {
      setCart([{ id: item.id, name: item.name, price: item.price, quantity: 1, image: item.image }]);
      setActiveRestaurant(restaurant);
      return;
    }

    if (!activeRestaurant) {
      setActiveRestaurant(restaurant);
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prevCart, { id: item.id, name: item.name, price: item.price, quantity: 1, image: item.image }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const updated = prevCart.filter((i) => i.id !== itemId);
      if (updated.length === 0) {
        setActiveRestaurant(null);
      }
      return updated;
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prevCart) => {
      const updated = prevCart
        .map((i) => {
          if (i.id === itemId) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[];

      if (updated.length === 0) {
        setActiveRestaurant(null);
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    setActiveRestaurant(null);
  };

  const placeOrder = (tipAmount: number, discountAmount = 0) => {
    if (cart.length === 0 || !activeRestaurant) return null;

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = Math.max(0, subtotal + activeRestaurant.deliveryFee + tipAmount - discountAmount);
    
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      restaurantName: activeRestaurant.name,
      restaurantImage: activeRestaurant.image,
      items: [...cart],
      subtotal,
      tip: tipAmount,
      total: parseFloat(total.toFixed(2)),
      status: 'PLACED',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    setOrders((prev) => [newOrder, ...prev]);
    
    // Deduct from profile balance and add points
    setUserProfile((prev) => ({
      ...prev,
      points: prev.points + Math.round(subtotal),
      balance: prev.balance >= total ? prev.balance - total : prev.balance,
    }));

    clearCart();
    return newOrder;
  };

  // Recover auth and onboarding states from AsyncStorage on mount
  useEffect(() => {
    const loadPersistedState = async () => {
      try {
        const storedOnboarded = await AsyncStorage.getItem('@onboarding_status');
        const storedLoggedIn = await AsyncStorage.getItem('@login_status');
        
        if (storedOnboarded !== null) {
          setIsOnboarded(storedOnboarded === 'true');
        }
        if (storedLoggedIn !== null) {
          setIsLoggedIn(storedLoggedIn === 'true');
        }
      } catch (error) {
        console.error('Failed to load persisted state from AsyncStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPersistedState();
  }, []);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('@onboarding_status', 'true');
    } catch (error) {
      console.error('Failed to persist onboarding status:', error);
    }
    setIsOnboarded(true);
  };

  const login = async () => {
    try {
      await AsyncStorage.setItem('@login_status', 'true');
    } catch (error) {
      console.error('Failed to persist login status:', error);
    }
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@login_status');
      await AsyncStorage.removeItem('@onboarding_status');
    } catch (error) {
      console.error('Failed to clear persisted auth states:', error);
    }
    setIsLoggedIn(false);
    setIsOnboarded(false); // Reset to allow full onboarding demo flow again!
  };

  const updateProfile = (name: string, email: string, favCuisine: string) => {
    setUserProfile((prev) => ({
      ...prev,
      name,
      email,
      favCuisine,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        restaurants: DUMMY_RESTAURANTS,
        cart,
        activeRestaurant,
        orders,
        isOnboarded,
        isLoggedIn,
        isLoading,
        userProfile,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        placeOrder,
        completeOnboarding,
        login,
        logout,
        updateProfile,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
