import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp, Layout } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDES = [
  {
    icon: 'restaurant',
    title: 'Find Your Cravings',
    description: 'Explore the finest local restaurants and gourmet cuisines curated just for your specific taste buds.',
    color: '#FF4B3A',
    bgColor: '#FFF0EE',
  },
  {
    icon: 'bicycle',
    title: 'Pristine & Fast Delivery',
    description: 'Track your delicious meals in real-time as they travel from the flame grill straight to your front door.',
    color: '#FFB03B',
    bgColor: '#FFF8EE',
  },
  {
    icon: 'sparkles',
    title: 'Loyalty Feast & Rewards',
    description: 'Earn foodie points with every single purchase and unlock exclusive golden coupons and free desserts.',
    color: '#4CD964',
    bgColor: '#EEFCEF',
  },
];

export default function OnboardingScreen() {
  const { completeOnboarding } = useApp();
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [currentIdx, setCurrentIdx] = useState(0);

  const handleNext = () => {
    if (currentIdx < SLIDES.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      completeOnboarding();
      navigation.replace('Login');
    }
  };

  const activeSlide = SLIDES[currentIdx];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header Skip button */}
      <View style={styles.header}>
        {currentIdx < SLIDES.length - 1 ? (
          <TouchableOpacity 
            onPress={() => {
              completeOnboarding();
              navigation.replace('Login');
            }} 
            activeOpacity={0.7}
          >
            <Text style={[styles.skipText, { color: theme.textSecondary }]}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>

      {/* Visual illustration panel */}
      <View style={styles.illustrationContainer}>
        <Animated.View 
          key={`illustration-${currentIdx}`}
          entering={FadeIn.duration(500)}
          style={[styles.illustrationCard, { backgroundColor: activeSlide.bgColor }]}
        >
          {/* Animated decorative circles */}
          <View style={[styles.circle, { borderColor: activeSlide.color, opacity: 0.1, transform: [{ scale: 1.5 }] }]} />
          <View style={[styles.circle, { borderColor: activeSlide.color, opacity: 0.2, transform: [{ scale: 1.2 }] }]} />
          
          <Ionicons name={activeSlide.icon as any} size={110} color={activeSlide.color} />
        </Animated.View>
      </View>

      {/* Content panel */}
      <View style={styles.contentContainer}>
        <Animated.Text 
          key={`title-${currentIdx}`}
          entering={FadeInUp.duration(600).delay(100)}
          style={[styles.title, { color: theme.text }]}
        >
          {activeSlide.title}
        </Animated.Text>
        
        <Animated.Text 
          key={`desc-${currentIdx}`}
          entering={FadeInUp.duration(600).delay(200)}
          style={[styles.description, { color: theme.textSecondary }]}
        >
          {activeSlide.description}
        </Animated.Text>
      </View>

      {/* Footer controls */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {SLIDES.map((_, index) => {
            const isActive = index === currentIdx;
            return (
              <Animated.View
                layout={Layout.springify()}
                key={`dot-${index}`}
                style={[
                  styles.dot,
                  {
                    backgroundColor: isActive ? '#FF4B3A' : theme.backgroundElement,
                    width: isActive ? 24 : 8,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.button}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>
            {currentIdx === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#FFF" style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    height: 40,
    paddingHorizontal: 24,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  illustrationContainer: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationCard: {
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_WIDTH * 0.75,
    borderRadius: SCREEN_WIDTH * 0.38,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  circle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 999,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  contentContainer: {
    paddingHorizontal: 32,
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 30,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#FF4B3A',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4B3A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonIcon: {
    marginLeft: 8,
  },
});
