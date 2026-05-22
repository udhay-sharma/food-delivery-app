import React, { createContext, useContext, useState, useEffect } from 'react';

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
  userProfile: {
    name: string;
    email: string;
    avatar: string;
    level: string;
    points: number;
    balance: number;
  };
  addToCart: (item: FoodItem, restaurant: Restaurant) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  placeOrder: (tipAmount: number) => Order | null;
  completeOnboarding: () => void;
  login: () => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// High-quality dummy data
const DUMMY_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Burger Bistro & Co.',
    cuisine: 'Burgers & Fries',
    rating: 4.8,
    reviewsCount: 1240,
    deliveryTime: '15-25 min',
    deliveryFee: 1.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    promo: 'Free Delivery on $15+',
    menu: [
      {
        id: 'food-1-1',
        name: 'The Antigravity Stack',
        price: 14.99,
        description: 'Double flame-grilled Angus beef, melted cheddar, crisp lettuce, heirloom tomato, and our secret antigravity truffle glaze on a brioche bun.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=60',
        category: 'Popular',
      },
      {
        id: 'food-1-2',
        name: 'Crispy Truffle Fries',
        price: 5.49,
        description: 'Golden, hand-cut Idaho potatoes tossed in white truffle oil, grated parmesan, and fresh chopped parsley.',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&auto=format&fit=crop&q=60',
        category: 'Sides',
      },
      {
        id: 'food-1-3',
        name: 'Smoky Bacon Avocado Burger',
        price: 15.99,
        description: 'Single Angus patty, applewood smoked bacon, fresh Hass avocado, chipotle aioli, and pepper jack cheese.',
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&auto=format&fit=crop&q=60',
        category: 'Burgers',
      },
    ],
  },
  {
    id: 'rest-2',
    name: 'Pizzeria Bella Vita',
    cuisine: 'Italian & Pizza',
    rating: 4.9,
    reviewsCount: 980,
    deliveryTime: '20-30 min',
    deliveryFee: 2.49,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    promo: 'Buy 1 Get 1 Margerita',
    menu: [
      {
        id: 'food-2-1',
        name: 'Burrata & Prosciutto Pizza',
        price: 18.99,
        description: 'San Marzano tomato sauce, fresh creamy burrata ball, thin-sliced Prosciutto di Parma, arugula, and balsamic reduction drizzle.',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=60',
        category: 'Popular',
      },
      {
        id: 'food-2-2',
        name: 'Spicy Diavola Pizza',
        price: 16.49,
        description: 'Spicy calabrian salami, fresh mozzarella, house-infused chili honey, and shredded basil.',
        image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400&auto=format&fit=crop&q=60',
        category: 'Pizza',
      },
      {
        id: 'food-2-3',
        name: 'Classic Garlic Knots',
        price: 6.99,
        description: 'Fresh baked dough knots drenched in garlic butter, romano cheese, served with marinara dipping sauce.',
        image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=400&auto=format&fit=crop&q=60',
        category: 'Sides',
      },
    ],
  },
  {
    id: 'rest-3',
    name: 'Sushi Zen Garden',
    cuisine: 'Japanese & Sushi',
    rating: 4.7,
    reviewsCount: 650,
    deliveryTime: '25-35 min',
    deliveryFee: 3.49,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80',
    promo: '15% Off Your First Order',
    menu: [
      {
        id: 'food-3-1',
        name: 'Golden Dragon Roll',
        price: 16.99,
        description: 'Shrimp tempura and cucumber topped with spicy tuna, thin avocado slices, sweet unagi sauce, and microgreens.',
        image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&auto=format&fit=crop&q=60',
        category: 'Signature Rolls',
      },
      {
        id: 'food-3-2',
        name: 'Premium Omakase Set',
        price: 29.99,
        description: '8 pieces of chef-selected nigiri sushi (Bluefin Tuna, Salmon Belly, Yellowtail, Sweet Shrimp) and 1 spicy tuna roll.',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&auto=format&fit=crop&q=60',
        category: 'Sushi Sets',
      },
      {
        id: 'food-3-3',
        name: 'Edamame with Sea Salt',
        price: 4.99,
        description: 'Steamed young soybeans sprinkled with coarse Maldon sea salt.',
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=60',
        category: 'Sides',
      },
    ],
  },
  {
    id: 'rest-4',
    name: 'Sweet Harmony Desserts',
    cuisine: 'Desserts & Bakery',
    rating: 4.9,
    reviewsCount: 820,
    deliveryTime: '10-20 min',
    deliveryFee: 1.49,
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop&q=80',
    promo: 'Free Cookie on Orders $10+',
    menu: [
      {
        id: 'food-4-1',
        name: 'Molten Lava Cake',
        price: 8.99,
        description: 'Decadent dark chocolate cake with a rich liquid center, served with a scoop of premium Madagascar vanilla bean ice cream.',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=60',
        category: 'Desserts',
      },
      {
        id: 'food-4-2',
        name: 'Matcha Strawberry Crepe',
        price: 9.49,
        description: 'Warm, thin crepe filled with high-grade Japanese matcha pastry cream, fresh sliced strawberries, and fresh whipped cream.',
        image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&auto=format&fit=crop&q=60',
        category: 'Crepes',
      },
    ],
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-9302',
      restaurantName: 'Pizzeria Bella Vita',
      restaurantImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
      items: [
        { id: 'food-2-2', name: 'Spicy Diavola Pizza', price: 16.49, quantity: 1 },
        { id: 'food-2-3', name: 'Classic Garlic Knots', price: 6.99, quantity: 1 }
      ],
      subtotal: 23.48,
      tip: 3.00,
      total: 28.97,
      status: 'DELIVERED',
      date: 'May 20, 2026',
    }
  ]);

  const [userProfile, setUserProfile] = useState({
    name: 'Alex Mercer',
    email: 'alex.mercer@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    level: 'Gold Foodie',
    points: 850,
    balance: 42.50,
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

  const placeOrder = (tipAmount: number) => {
    if (cart.length === 0 || !activeRestaurant) return null;

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = subtotal + activeRestaurant.deliveryFee + tipAmount;
    
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

  const completeOnboarding = () => setIsOnboarded(true);
  const login = () => setIsLoggedIn(true);
  const logout = () => {
    setIsLoggedIn(false);
    setIsOnboarded(false); // Reset to allow full onboarding demo flow again!
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
        userProfile,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        placeOrder,
        completeOnboarding,
        login,
        logout,
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
