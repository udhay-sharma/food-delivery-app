import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'How do I earn foodie points?',
    answer: 'Every order placed automatically converts your subtotal into loyalty points! Points can be reviewed in your Profile and spent on future discounts or complimentary desserts.',
  },
  {
    question: 'What is the QuickEats delivery speed guarantee?',
    answer: 'We secure top-tier local drivers to deliver your meals hot and fresh. If your order exceeds the predicted delivery window by more than 15 minutes, please contact live support for an instant wallet credit.',
  },
  {
    question: 'Can I cancel or customize my order?',
    answer: 'You can customize food ingredients by leaving notes in the checkout screen. Active order cancellations are only supported within 2 minutes of placement before kitchens prepare ingredients.',
  },
];

export default function HelpScreen() {
  const theme = useTheme();

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Support Staff Banner */}
        <Animated.View entering={FadeInDown.duration(500)} style={[styles.staffCard, { backgroundColor: theme.backgroundElement }]}>
          <View style={styles.avatarRow}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' }}
              style={styles.avatar}
            />
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }}
              style={[styles.avatar, { marginLeft: -16 }]}
            />
            <View style={styles.activeDot} />
          </View>

          <Text style={[styles.staffTitle, { color: theme.text }]}>Need Immediate Help?</Text>
          <Text style={[styles.staffSubtitle, { color: theme.textSecondary }]}>
            Our expert culinary concierge agents are online and available to resolve delivery tickets.
          </Text>

          <TouchableOpacity style={styles.chatBtn} activeOpacity={0.85}>
            <Ionicons name="chatbubbles" size={18} color="#FFF" style={{ marginRight: 6 }} />
            <Text style={styles.chatBtnText}>Start Live Chat</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* FAQ list */}
        <View style={styles.faqSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Frequently Asked Questions</Text>
          
          {FAQS.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <Animated.View
                key={idx}
                layout={Layout.springify()}
                entering={FadeInDown.duration(400).delay(idx * 80)}
              >
                <TouchableOpacity
                  style={[styles.faqCard, { backgroundColor: theme.backgroundElement }]}
                  onPress={() => toggleExpand(idx)}
                  activeOpacity={0.8}
                >
                  <View style={styles.faqHeader}>
                    <Text style={[styles.faqQuestion, { color: theme.text }]}>{item.question}</Text>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={theme.textSecondary}
                    />
                  </View>

                  {isExpanded && (
                    <Animated.View style={styles.faqBody} entering={FadeInDown.duration(200)}>
                      <Text style={[styles.faqAnswer, { color: theme.textSecondary }]}>{item.answer}</Text>
                    </Animated.View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Contact channels footer */}
        <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.channelsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Alternative Channels</Text>
          
          <View style={styles.channelsRow}>
            <TouchableOpacity style={[styles.channelCard, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons name="mail" size={24} color="#FF4B3A" />
              <Text style={[styles.channelLabel, { color: theme.text }]}>Email Support</Text>
              <Text style={[styles.channelVal, { color: theme.textSecondary }]}>concierge@quickeats.com</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.channelCard, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons name="call" size={24} color="#FF4B3A" />
              <Text style={[styles.channelLabel, { color: theme.text }]}>Call Hotlines</Text>
              <Text style={[styles.channelVal, { color: theme.textSecondary }]}>+1 (800) QUICK-EATS</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: 60,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 110,
  },
  staffCard: {
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  activeDot: {
    backgroundColor: '#4CD964',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFF',
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  staffTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  staffSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
    paddingHorizontal: 12,
  },
  chatBtn: {
    backgroundColor: '#FF4B3A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#FF4B3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  chatBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  faqSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  faqCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '700',
    flex: 0.95,
  },
  faqBody: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 10,
  },
  faqAnswer: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
  },
  channelsSection: {
    marginTop: 8,
  },
  channelsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  channelCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  channelLabel: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 10,
  },
  channelVal: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
});
