import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert,
  Linking,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Image,
  BackHandler,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { createClient } from '@supabase/supabase-js';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

// ==========================================
// SUPABASE CLIENT SETUP
// Replace these with your actual Supabase project credentials (available on free tier)
// ==========================================
const SUPABASE_URL = 'https://wpdtgcotwyytwhzxeizi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_cUNNwOuniRr8dKoINeKiuQ_ac5HHxRM';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// MRCB Restaurant Menu
const CATALOG_PRODUCTS = [
  // BIRYANI
  { id: 'mrcb-001', name: 'Chicken Dum Biryani (S)', category: 'Biryani', price: 150, gst: 5, description: 'Single 125g', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=300&auto=format&fit=crop', tag: 'Bestseller', type: 'nonveg' },
  { id: 'mrcb-002', name: 'Chicken Dum Biryani (F)', category: 'Biryani', price: 280, gst: 5, description: 'Full 250g', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-003', name: 'Chicken Family Pack', category: 'Biryani', price: 600, gst: 5, description: 'Family serving', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=300&auto=format&fit=crop', tag: 'Family', type: 'nonveg' },
  { id: 'mrcb-004', name: 'Chicken Dum Biryani (Jumbo)', category: 'Biryani', price: 850, gst: 5, description: 'Parcel only', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=300&auto=format&fit=crop', tag: 'Parcel Only', type: 'nonveg' },
  { id: 'mrcb-005', name: 'Chicken Fry Biryani (S)', category: 'Biryani', price: 160, gst: 5, description: 'Single', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-006', name: 'Chicken Fry Biryani (F)', category: 'Biryani', price: 300, gst: 5, description: 'Full', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-007', name: 'Chicken Fry Biryani (Family)', category: 'Biryani', price: 640, gst: 5, description: 'Family', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=300&auto=format&fit=crop', tag: 'Family', type: 'nonveg' },
  { id: 'mrcb-008', name: 'Mutton Fry Biryani (S)', category: 'Biryani', price: 250, gst: 5, description: 'Single', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=300&auto=format&fit=crop', tag: 'Chef Choice', type: 'nonveg' },
  { id: 'mrcb-009', name: 'Mutton Fry Biryani (F)', category: 'Biryani', price: 480, gst: 5, description: 'Full', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-010', name: 'Mutton Fry Biryani (Family)', category: 'Biryani', price: 900, gst: 5, description: 'Family', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=300&auto=format&fit=crop', tag: 'Family', type: 'nonveg' },
  { id: 'mrcb-011', name: 'Mutton Fry Biryani (Jumbo)', category: 'Biryani', price: 1100, gst: 5, description: 'Parcel only', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=300&auto=format&fit=crop', tag: 'Parcel Only', type: 'nonveg' },
  { id: 'mrcb-012', name: 'MRCB SPL Biryani (S)', category: 'Biryani', price: 200, gst: 5, description: 'Special single', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=300&auto=format&fit=crop', tag: 'Special', type: 'nonveg' },
  { id: 'mrcb-013', name: 'MRCB SPL Biryani (F)', category: 'Biryani', price: 380, gst: 5, description: 'Special full', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-014', name: 'MRCB SPL Biryani (Family)', category: 'Biryani', price: 750, gst: 5, description: 'Special family', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=300&auto=format&fit=crop', tag: 'Family', type: 'nonveg' },
  { id: 'mrcb-015', name: 'Kamju Biryani (S)', category: 'Biryani', price: 250, gst: 5, description: 'Single', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-016', name: 'Rabbit Biryani (S)', category: 'Biryani', price: 250, gst: 5, description: 'Single', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-017', name: 'Prawns Biryani (S)', category: 'Biryani', price: 250, gst: 5, description: 'Single', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-018', name: 'Natukodi Fry Biryani (S)', category: 'Biryani', price: 250, gst: 5, description: 'Single', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-019', name: 'Egg Biryani (S)', category: 'Biryani', price: 120, gst: 5, description: 'Single', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=300&auto=format&fit=crop', tag: '', type: 'egg' },
  { id: 'mrcb-020', name: 'Biryani Rice', category: 'Biryani', price: 100, gst: 5, description: 'Plain biryani rice', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=300&auto=format&fit=crop', tag: '', type: 'veg' },
  // CURRY
  { id: 'mrcb-021', name: 'Natu Kodi Fry (S)', category: 'Curry', price: 110, gst: 5, description: '125g', image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-022', name: 'Natu Kodi Fry (F)', category: 'Curry', price: 220, gst: 5, description: '250g', image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-023', name: 'Natukodi Curry (S)', category: 'Curry', price: 90, gst: 5, description: '125g', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-024', name: 'Natukodi Curry (F)', category: 'Curry', price: 180, gst: 5, description: '250g', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-025', name: 'Chicken Fry (S)', category: 'Curry', price: 80, gst: 5, description: '125g', image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=300&auto=format&fit=crop', tag: 'Bestseller', type: 'nonveg' },
  { id: 'mrcb-026', name: 'Chicken Fry (F)', category: 'Curry', price: 160, gst: 5, description: '250g', image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-027', name: 'Chicken Curry (S)', category: 'Curry', price: 60, gst: 5, description: '125g', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-028', name: 'Chicken Curry (F)', category: 'Curry', price: 120, gst: 5, description: '250g', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-029', name: 'Chicken 65 (S)', category: 'Curry', price: 100, gst: 5, description: '125g', image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=300&auto=format&fit=crop', tag: 'Popular', type: 'nonveg' },
  { id: 'mrcb-030', name: 'Chicken 65 (F)', category: 'Curry', price: 200, gst: 5, description: '250g', image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-031', name: 'Chicken Liver (S)', category: 'Curry', price: 50, gst: 5, description: '125g', image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-032', name: 'Chicken Liver (F)', category: 'Curry', price: 100, gst: 5, description: '250g', image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-033', name: 'Chicken Leg (1 Pc)', category: 'Curry', price: 70, gst: 5, description: 'Per piece', image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-034', name: 'Kandanakaya (S)', category: 'Curry', price: 70, gst: 5, description: 'Single', image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-035', name: 'Kandanakaya (F)', category: 'Curry', price: 140, gst: 5, description: 'Full', image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  // MUTTON & SEAFOOD
  { id: 'mrcb-036', name: 'Mutton Fry (S)', category: 'Mutton', price: 150, gst: 5, description: '125g', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-037', name: 'Mutton Fry (F)', category: 'Mutton', price: 300, gst: 5, description: '250g', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-038', name: 'Mutton Curry (S)', category: 'Mutton', price: 100, gst: 5, description: '125g', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-039', name: 'Mutton Curry (F)', category: 'Mutton', price: 200, gst: 5, description: '250g', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-040', name: 'Mutton Boti (S)', category: 'Mutton', price: 100, gst: 5, description: '125g', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-041', name: 'Mutton Boti (F)', category: 'Mutton', price: 200, gst: 5, description: '250g', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-042', name: 'Mutton Liver (S)', category: 'Mutton', price: 100, gst: 5, description: '125g', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-043', name: 'Mutton Liver (F)', category: 'Mutton', price: 200, gst: 5, description: '250g', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-044', name: 'Appolo Fish (S)', category: 'Seafood', price: 150, gst: 5, description: '125g', image: 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-045', name: 'Appolo Fish (F)', category: 'Seafood', price: 300, gst: 5, description: '250g', image: 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-046', name: 'Prawns Fry (S)', category: 'Seafood', price: 150, gst: 5, description: '125g', image: 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-047', name: 'Prawns Fry (F)', category: 'Seafood', price: 300, gst: 5, description: '250g', image: 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-048', name: 'Fish Fry', category: 'Seafood', price: 70, gst: 5, description: 'Per piece', image: 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-049', name: 'Kamju Fry (S)', category: 'Mutton', price: 90, gst: 5, description: '125g', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  { id: 'mrcb-050', name: 'Kamju Fry (F)', category: 'Mutton', price: 100, gst: 5, description: '250g', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=300&auto=format&fit=crop', tag: '', type: 'nonveg' },
  // ROTI
  { id: 'mrcb-051', name: 'Pulka', category: 'Roti', price: 15, gst: 5, description: 'Single piece', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=300&auto=format&fit=crop', tag: '', type: 'veg' },
  { id: 'mrcb-052', name: 'Pulka with Veg Curry', category: 'Roti', price: 50, gst: 5, description: 'Pulka + veg curry', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=300&auto=format&fit=crop', tag: '', type: 'veg' },
  { id: 'mrcb-053', name: 'Pulka Extra', category: 'Roti', price: 25, gst: 5, description: 'Extra pulka', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=300&auto=format&fit=crop', tag: '', type: 'veg' },
  { id: 'mrcb-054', name: 'Rumali Roti', category: 'Roti', price: 25, gst: 5, description: 'Single piece', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=300&auto=format&fit=crop', tag: '', type: 'veg' },
  { id: 'mrcb-055', name: 'Rumali Roti with Veg Curry', category: 'Roti', price: 70, gst: 5, description: 'Rumali + veg curry', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=300&auto=format&fit=crop', tag: '', type: 'veg' },
  { id: 'mrcb-056', name: 'Rumali Roti Extra', category: 'Roti', price: 30, gst: 5, description: 'Extra rumali', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=300&auto=format&fit=crop', tag: '', type: 'veg' },
  { id: 'mrcb-057', name: 'Jawari Roti', category: 'Roti', price: 25, gst: 5, description: 'Single piece', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=300&auto=format&fit=crop', tag: '', type: 'veg' },
  { id: 'mrcb-058', name: 'Jawari Roti with Curry', category: 'Roti', price: 70, gst: 5, description: 'Jawari + curry', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=300&auto=format&fit=crop', tag: '', type: 'veg' },
  { id: 'mrcb-059', name: 'Sarva Roti', category: 'Roti', price: 30, gst: 5, description: 'Single piece', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=300&auto=format&fit=crop', tag: '', type: 'veg' },
  { id: 'mrcb-060', name: 'Sarvappa (Single Bole)', category: 'Roti', price: 50, gst: 5, description: 'With curry', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=300&auto=format&fit=crop', tag: '', type: 'veg' },
  // VEG
  { id: 'mrcb-061', name: 'Veg Meals (1 Person)', category: 'Veg', price: 100, gst: 5, description: 'Full veg meal', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=300&auto=format&fit=crop', tag: 'Value Meal', type: 'veg' },
  { id: 'mrcb-062', name: 'White Rice', category: 'Veg', price: 100, gst: 5, description: 'Full plate', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=300&auto=format&fit=crop', tag: '', type: 'veg' },
  { id: 'mrcb-063', name: 'Only Rice', category: 'Veg', price: 40, gst: 5, description: 'Plain rice', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=300&auto=format&fit=crop', tag: '', type: 'veg' },
  { id: 'mrcb-064', name: 'Boiled Egg', category: 'Veg', price: 10, gst: 5, description: 'Per piece', image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=300&auto=format&fit=crop', tag: '', type: 'egg' },
];
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function App() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('billing'); // 'billing', 'transactions', 'stats', 'profile'

  // Authentication State
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.log('Error during Supabase signout:', err);
    }
    setSession(null);
  };

  if (!session) {
    return <LoginView onBypass={setSession} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <SafeAreaView style={styles.appContainer} edges={['top', 'left', 'right']}>
        <View style={styles.contentArea}>
          {activeTab === 'billing' && <BillingTab />}
          {activeTab === 'transactions' && <TransactionsTab session={session} />}
          {activeTab === 'stats' && <StatsTab session={session} />}
          {activeTab === 'profile' && <ProfileTab session={session} onLogout={handleLogout} />}
        </View>

        {/* Tab Navigation Bar */}
        <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#ffffff' }}>
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'billing' && styles.tabItemActive]}
              onPress={() => setActiveTab('billing')}
            >
              <Ionicons name="cart" size={24} color={activeTab === 'billing' ? '#2563EB' : '#64748B'} />
              <Text style={[styles.tabLabel, activeTab === 'billing' && styles.tabLabelActive]}>Billing</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'transactions' && styles.tabItemActive]}
              onPress={() => setActiveTab('transactions')}
            >
              <Ionicons name="receipt" size={24} color={activeTab === 'transactions' ? '#2563EB' : '#64748B'} />
              <Text style={[styles.tabLabel, activeTab === 'transactions' && styles.tabLabelActive]}>Log</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'stats' && styles.tabItemActive]}
              onPress={() => setActiveTab('stats')}
            >
              <Ionicons name="analytics" size={24} color={activeTab === 'stats' ? '#2563EB' : '#64748B'} />
              <Text style={[styles.tabLabel, activeTab === 'stats' && styles.tabLabelActive]}>Stats</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'profile' && styles.tabItemActive]}
              onPress={() => setActiveTab('profile')}
            >
              <Ionicons name="person" size={24} color={activeTab === 'profile' ? '#2563EB' : '#64748B'} />
              <Text style={[styles.tabLabel, activeTab === 'profile' && styles.tabLabelActive]}>Profile</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ==========================================
// 1. PASSWORDLESS LOGIN VIEW
// ==========================================
function LoginView({ onBypass }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleAuth = async () => {
    Keyboard.dismiss();
    if (!email.trim() || !password) {
      setErrorMessage('Please fill in both fields.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
        });
        if (error) throw error;
        
        // Auto-login after sign up if session wasn't automatically established:
        if (!data?.session) {
          const { error: signInErr } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password,
          });
          if (signInErr) throw signInErr;
        } else {
          Alert.alert('Success', 'Operator account created successfully!');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });
        if (error) throw error;
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#f0f4ff" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.loginContainer} edges={['top','bottom','left','right']}>
        <View style={styles.loginCard}>
          <Ionicons name="calculator-outline" size={72} color="#2563EB" style={styles.loginLogo} />
          <Text style={styles.loginTitle}>PAPERLESS POS</Text>
          <Text style={styles.loginSubtitle}>Zero-overhead, free digital billing terminal</Text>
          <Text style={styles.loginAuthor}>Created by Suraj Takkallapelly</Text>

          <View style={styles.inputGroup}>
            {/* Email Input */}
            <TextInput
              style={styles.textInput}
              placeholder="Email Address"
              placeholderTextColor="#555"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Password Input */}
            <View style={styles.passwordInputWrapper}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#555"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity 
                style={styles.passwordToggleIcon}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Ionicons 
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                  size={22} 
                  color="#64748B" 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.actionBtn} onPress={handleAuth} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#121212" />
              ) : (
                <Text style={styles.actionBtnText}>
                  {isSignUp ? 'Create Operator Account' : 'Login'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Toggle Sign Up vs Sign In */}
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={styles.textLink}>
              <Text style={styles.textLinkText}>
                {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          {/* Bypass Option for instant testing without registration */}
          <TouchableOpacity 
            style={styles.bypassBtn} 
            onPress={() => {
              Keyboard.dismiss();
              onBypass({ user: { id: 'demo-user-id', email: email || 'demo@shop.com' } });
            }}
          >
            <Text style={styles.bypassBtnText}>🔧 Bypass Login (Offline / Demo Mode)</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      </TouchableWithoutFeedback>
    </SafeAreaProvider>
  );
}

// ==========================================
// 2. POS CART & CHECKOUT TAB
// ==========================================
function BillingTab() {
  const [cart, setCart] = useState([]);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [customType, setCustomType] = useState('veg'); // 'veg' | 'egg' | 'nonveg'

  const [checkoutStep, setCheckoutStep] = useState(0); // 0: Idle, 1: PayMode, 2: UPI Scan, 3: Receipt Opt
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('CASH');
  const [customerPhone, setCustomerPhone] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [submittingBill, setSubmittingBill] = useState(false);
  const [orderType, setOrderType] = useState('Dine-In'); // 'Dine-In' or 'Takeaway'

  // New UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeTypeFilter, setActiveTypeFilter] = useState('all'); // 'all' | 'veg' | 'egg' | 'nonveg'
  const [showBillReview, setShowBillReview] = useState(false);
  const [catalog, setCatalog] = useState(CATALOG_PRODUCTS);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsTab, setSettingsTab] = useState('qr'); // 'qr' | 'menu'

  // State for adding/editing catalog products
  const [editingCatalogProduct, setEditingCatalogProduct] = useState(null);
  const [isAddingCatalogProduct, setIsAddingCatalogProduct] = useState(false);

  const [catProdName, setCatProdName] = useState('');
  const [catProdCategory, setCatProdCategory] = useState('');
  const [catProdPrice, setCatProdPrice] = useState('');
  const [catProdImage, setCatProdImage] = useState('');
  const [catProdTag, setCatProdTag] = useState('');
  const [catProdType, setCatProdType] = useState('veg'); // 'veg' | 'egg' | 'nonveg'

  const [showQrSettings, setShowQrSettings] = useState(false); // fallback compatibility
  const [customQrUri, setCustomQrUri] = useState(null);

  // Android back button handler
  useEffect(() => {
    const onBackPress = () => {
      if (showCustomModal) { setShowCustomModal(false); return true; }
      if (showSettingsModal) { setShowSettingsModal(false); return true; }
      if (showBillReview) { setShowBillReview(false); return true; }
      if (checkoutStep > 0) {
        if (checkoutStep === 3 && selectedPaymentMode !== 'UPI') {
          setCheckoutStep(1);
        } else {
          setCheckoutStep(checkoutStep - 1);
        }
        return true;
      }
      return false; // let system handle (exit app)
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [checkoutStep, showCustomModal, showSettingsModal, showBillReview, selectedPaymentMode]);

  // Load custom QR and Catalog Menu configuration on mount
  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const savedCatalog = await AsyncStorage.getItem('pos_catalog');
        if (savedCatalog) {
          setCatalog(JSON.parse(savedCatalog));
        }
      } catch (err) {
        console.log('Error loading catalog:', err);
      }
    };
    loadCatalog();
  }, []);

  const saveCatalogLocally = async (updatedCatalog) => {
    setCatalog(updatedCatalog);
    try {
      await AsyncStorage.setItem('pos_catalog', JSON.stringify(updatedCatalog));
    } catch (err) {
      console.log('Error saving catalog:', err);
    }
  };

  const handleAddCatalogProduct = () => {
    const price = parseFloat(catProdPrice);
    if (!catProdName || !catProdCategory || isNaN(price) || price <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid name, category, and price.');
      return;
    }
    const newProduct = {
      id: 'catalog-' + Date.now(),
      name: catProdName,
      category: catProdCategory,
      price: price,
      gst: 18.0,
      description: 'Custom added menu item.',
      image: (catProdImage && typeof catProdImage === 'string') ? catProdImage.trim() : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop',
      tag: catProdTag.trim() || null,
      type: catProdType,
    };
    const updated = [...catalog, newProduct];
    saveCatalogLocally(updated);
    
    // reset inputs
    setCatProdName('');
    setCatProdCategory('');
    setCatProdPrice('');
    setCatProdImage('');
    setCatProdTag('');
    setCatProdType('veg');
    setIsAddingCatalogProduct(false);
    Alert.alert('Success', 'Item added to catalog.');
  };

  const handleEditCatalogProduct = () => {
    const price = parseFloat(catProdPrice);
    if (!catProdName || !catProdCategory || isNaN(price) || price <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid name, category, and price.');
      return;
    }
    const updated = catalog.map((p) => {
      if (p.id === editingCatalogProduct.id) {
        return {
          ...p,
          name: catProdName,
          category: catProdCategory,
          price: price,
          image: (catProdImage && typeof catProdImage === 'string') ? catProdImage.trim() : p.image,
          tag: catProdTag.trim() || null,
          type: catProdType,
        };
      }
      return p;
    });
    saveCatalogLocally(updated);

    // reset inputs
    setCatProdName('');
    setCatProdCategory('');
    setCatProdPrice('');
    setCatProdImage('');
    setCatProdTag('');
    setCatProdType('veg');
    setEditingCatalogProduct(null);
    Alert.alert('Success', 'Item updated.');
  };

  const handleDeleteCatalogProduct = (productId, productName) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${productName}" from your menu?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updated = catalog.filter((p) => p.id !== productId);
            saveCatalogLocally(updated);
          },
        },
      ]
    );
  };

  const startEditCatalogProduct = (product) => {
    setEditingCatalogProduct(product);
    setCatProdName(product.name);
    setCatProdCategory(product.category);
    setCatProdPrice(product.price.toString());
    setCatProdImage(product.image);
    setCatProdTag(product.tag || '');
    setCatProdType(product.type || 'veg');
  };

  // Dynamic Categories calculation from catalog + cart
  const getCategoriesList = () => {
    const catSet = new Set(catalog.map((p) => p.category));
    cart.forEach((item) => {
      if (item.category) catSet.add(item.category);
    });
    return ['All', ...Array.from(catSet)];
  };
  const categoriesList = getCategoriesList();

  // Load custom QR code configuration
  useEffect(() => {
    const loadCustomQr = async () => {
      try {
        const savedUri = await AsyncStorage.getItem('custom_qr_uri');
        if (savedUri) {
          setCustomQrUri(savedUri);
        }
      } catch (err) {
        console.log('Error loading saved QR URI:', err);
      }
    };
    loadCustomQr();
  }, []);

  const handlePickQrCode = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need photo library permissions to upload your QR code.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;
      setCustomQrUri(selectedUri);
      try {
        await AsyncStorage.setItem('custom_qr_uri', selectedUri);
        Alert.alert('Success', 'Custom QR code saved successfully.');
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleRemoveQrCode = async () => {
    setCustomQrUri(null);
    try {
      await AsyncStorage.removeItem('custom_qr_uri');
      Alert.alert('Success', 'Reset to default static QR code.');
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectProductImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need photo library permissions to select product images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setCatProdImage(result.assets[0].uri);
    }
  };

  const handleCaptureProductImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera permissions to capture product images.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setCatProdImage(result.assets[0].uri);
    }
  };

  const handlePickProductImage = () => {
    Alert.alert(
      'Product Image',
      'Choose how you want to add the product image:',
      [
        { text: 'Take Photo (Camera)', onPress: handleCaptureProductImage },
        { text: 'Choose from Gallery', onPress: handleSelectProductImage },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  // Computations
  const getGrandTotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const getTaxAmount = () => {
    return cart.reduce((sum, item) => {
      const lineTotal = item.price * item.quantity;
      const withoutTax = lineTotal / (1 + (item.gst / 100));
      return sum + (lineTotal - withoutTax);
    }, 0);
  };

  const getSubtotal = () => getGrandTotal() - getTaxAmount();

  const addToCart = (product) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.name === product.name);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx].quantity += 1;
        return updated;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (index, qty) => {
    setCart((prev) => {
      if (qty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      const updated = [...prev];
      updated[index].quantity = qty;
      return updated;
    });
  };

  const getProductCartQty = (productName) => {
    const item = cart.find((i) => i.name === productName);
    return item ? item.quantity : 0;
  };

  const handleAddCustomItem = () => {
    const price = parseFloat(customPrice);
    const categoryVal = customCategory.trim() || 'Custom';
    if (customName && !isNaN(price) && price > 0) {
      const newAdHoc = {
        id: 'ad-hoc-' + Date.now(),
        name: customName,
        price: price,
        gst: 18.0, // Fixed 18% GST for all custom items
        category: categoryVal,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop',
        type: customType,
      };
      
      const updatedCatalog = [newAdHoc, ...catalog];
      saveCatalogLocally(updatedCatalog);

      addToCart(newAdHoc);

      setCustomName('');
      setCustomCategory('');
      setCustomPrice('');
      setCustomType('veg');
      setShowCustomModal(false);
    } else {
      Alert.alert('Invalid Entry', 'Please enter a valid name and price.');
    }
  };

  // WhatsApp launcher using direct wa.me link structures
  const triggerWhatsAppReceipt = async (phone, invoiceNum) => {
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

    const amount = getGrandTotal().toFixed(2);
    const mode = selectedPaymentMode;
    const shop = "MRCB Restaurant";
    const receiptLink = `https://surajtakkallapelly-design.github.io/zero-cost-pos/invoice.html?num=${encodeURIComponent(invoiceNum)}`;

    const text = `👉 *INVOICE FROM ${shop}*\n\n` +
      `Your total bill is *₹${amount}* paid via *${mode}*. ` +
      `View your full itemized digital bill and leave us a review here: ${receiptLink}`;

    const encodedText = encodeURIComponent(text);
    const webUri = `https://wa.me/${cleanPhone}?text=${encodedText}`;

    try {
      await Linking.openURL(webUri);
    } catch (_) {
      Alert.alert('Error', 'Failed to open WhatsApp. Please ensure it is installed on this device.');
    }
  };

  // Checkout submission
  const processCheckout = async (wantsReceipt) => {
    if (wantsReceipt && !customerPhone) {
      Alert.alert('Phone Required', 'Please enter a mobile number to share the receipt.');
      return;
    }

    setSubmittingBill(true);
    const invoiceNum = `INV-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)} (${orderType})`;

    // Prepare line items
    const itemsData = cart.map((item) => {
      const lineTotal = item.price * item.quantity;
      const gst = lineTotal - (lineTotal / (1 + (item.gst / 100)));
      return {
        product_id: null, // products table FK not used; all info stored in product_name
        product_name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        gst_amount: parseFloat(gst.toFixed(2)),
        total_amount: parseFloat(lineTotal.toFixed(2)),
      };
    });

    try {
      // Execute atomic postgres stored procedure
      const { data: orderId, error } = await supabase.rpc('create_order_with_items', {
        p_order_number: invoiceNum,
        p_subtotal: parseFloat(getSubtotal().toFixed(2)),
        p_tax_amount: parseFloat(getTaxAmount().toFixed(2)),
        p_grand_total: parseFloat(getGrandTotal().toFixed(2)),
        p_payment_mode: selectedPaymentMode,
        p_customer_phone: wantsReceipt ? customerPhone : null,
        p_items: itemsData,
      });

      if (error) throw error;

      if (wantsReceipt) {
        await triggerWhatsAppReceipt(customerPhone, invoiceNum);
      }

      setCart([]);
      setCheckoutStep(0);
      setCustomerPhone('');
      setShowPhoneInput(false);
      setOrderType('Dine-In');
      Alert.alert('Success', `Invoice ${invoiceNum} generated!`);
    } catch (err) {
      Alert.alert('Checkout Failed', err.message);
    } finally {
      setSubmittingBill(false);
    }
  };

  // Filter Catalog Products
  const filteredProducts = catalog.filter((product) => {
    const matchesCategory = activeFilter === 'All' || product.category === activeFilter;
    const matchesType = activeTypeFilter === 'all' || product.type === activeTypeFilter;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesType && matchesSearch;
  });

  return (
    <View style={styles.tabContent}>
      {/* Header bar */}
      <View style={styles.tabHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="calculator" size={24} color="#2563EB" style={{ marginRight: 8 }} />
          <Text style={styles.tabTitle}>TERMINAL POS</Text>
        </View>
        <TouchableOpacity style={styles.qrSettingsBtn} onPress={() => setShowSettingsModal(true)}>
          <Ionicons name="settings" size={16} color="#2563EB" style={{ marginRight: 4 }} />
          <Text style={styles.qrSettingsText}>POS Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input bar */}
      <View style={styles.searchBarWrapper}>
        <Ionicons name="search" size={18} color="#64748B" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#64748B" />
          </TouchableOpacity>
        )}
      </View>

      {/* Type Filter & Add Custom Row */}
      <View style={styles.filtersRow}>
        <View style={styles.typeFilters}>
          {['all', 'veg', 'egg', 'nonveg'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeFilterChip,
                activeTypeFilter === type && styles.typeFilterChipActive,
              ]}
              onPress={() => setActiveTypeFilter(type)}
            >
              <View
                style={[
                  styles.typeDot,
                  type === 'veg' && { backgroundColor: '#10B981' },
                  type === 'egg' && { backgroundColor: '#F59E0B' },
                  type === 'nonveg' && { backgroundColor: '#EF4444' },
                  type === 'all' && { backgroundColor: '#94A3B8' },
                ]}
              />
              <Text
                style={[
                  styles.typeFilterLabel,
                  activeTypeFilter === type && styles.typeFilterLabelActive,
                ]}
              >
                {type.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.addCustomBtn} onPress={() => setShowCustomModal(true)}>
          <Ionicons name="add-circle" size={16} color="#2563EB" />
          <Text style={styles.addCustomText}>Custom</Text>
        </TouchableOpacity>
      </View>

      {/* Catalog Split View */}
      <View style={styles.catalogSplitContainer}>
        {/* Left Category Sidebar */}
        <View style={styles.sidebar}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {categoriesList.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.sidebarCategoryBtn,
                  activeFilter === cat && styles.sidebarCategoryBtnActive,
                ]}
                onPress={() => setActiveFilter(cat)}
              >
                <Text
                  style={[
                    styles.sidebarCategoryLabel,
                    activeFilter === cat && styles.sidebarCategoryLabelActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Right 2-Column Product Grid */}
        <View style={styles.gridContainer}>
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.gridRowWrapper}
            contentContainerStyle={styles.gridList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={48} color="#475569" />
                <Text style={styles.emptyText}>No matching products</Text>
              </View>
            }
            renderItem={({ item }) => {
              const qty = getProductCartQty(item.name);
              const isInCart = qty > 0;
              return (
                <TouchableOpacity
                  style={[
                    styles.productCard,
                    isInCart && styles.productCardActive,
                  ]}
                  onPress={() => addToCart(item)}
                >
                  <View style={styles.cardImageWrapper}>
                    <Image source={{ uri: item.image }} style={styles.cardImage} />
                    <View style={styles.vegIndicatorWrapper}>
                      <View
                        style={[
                          styles.vegIndicatorDot,
                          item.type === 'veg' && { backgroundColor: '#10B981' },
                          item.type === 'egg' && { backgroundColor: '#F59E0B' },
                          item.type === 'nonveg' && { backgroundColor: '#EF4444' },
                        ]}
                      />
                    </View>
                    {isInCart && (
                      <View style={styles.qtyBadge}>
                        <Text style={styles.qtyBadgeText}>{qty}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.cardInfo}>
                    {item.tag && (
                      <View style={styles.cardTagWrapper}>
                        <Text style={styles.cardTagText}>{item.tag.toUpperCase()}</Text>
                      </View>
                    )}
                    <Text style={styles.cardName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.cardPrice}>₹{item.price.toFixed(0)}</Text>
                      <View style={styles.addBtnIcon}>
                        <Ionicons name="add" size={10} color="#2563EB" />
                        <Text style={styles.addBtnText}>ADD</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>

      {/* Floating Bottom Cart Bar */}
      {cart.length > 0 && (
        <TouchableOpacity style={styles.floatingCartBar} onPress={() => setShowBillReview(true)}>
          <View style={styles.floatingCartLeft}>
            <View style={styles.floatingCartIconWrapper}>
              <Ionicons name="cart" size={18} color="#121212" />
            </View>
            <Text style={styles.floatingCartText}>
              {cart.reduce((sum, item) => sum + item.quantity, 0)} Item(s) | ₹{getGrandTotal().toFixed(2)}
            </Text>
          </View>
          <View style={styles.floatingCartRight}>
            <Text style={styles.floatingCartActionText}>View Bill</Text>
            <Ionicons name="arrow-forward" size={14} color="#2563EB" />
          </View>
        </TouchableOpacity>
      )}

      {/* 1. Custom Ad-hoc Item Modal */}
      <Modal visible={showCustomModal} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalBg}>
            <KeyboardAvoidingView
              behavior="padding"
              style={{ width: '100%', alignItems: 'center' }}
            >
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Add Custom Item</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Item Name (e.g. Garlic Naan)"
                  placeholderTextColor="#555"
                  value={customName}
                  onChangeText={setCustomName}
                />
                
                <Text style={styles.modalFieldLabel}>Category</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Category (e.g. Biryani, Curry, Fry)"
                  placeholderTextColor="#555"
                  value={customCategory}
                  onChangeText={setCustomCategory}
                />

                {/* Quick Suggestion Chips */}
                <View style={styles.suggestionChipsWrapper}>
                  {['Biryani', 'Curry', 'Fry', 'Drinks', 'Dessert'].map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={styles.suggestionChip}
                      onPress={() => setCustomCategory(cat)}
                    >
                      <Text style={styles.suggestionChipText}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Food Type Selector */}
                <Text style={styles.modalFieldLabel}>Food Type</Text>
                <View style={[styles.typeFilters, { marginBottom: 16 }]}>
                  {['veg', 'egg', 'nonveg'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeFilterChip,
                        customType === type && styles.typeFilterChipActive,
                      ]}
                      onPress={() => setCustomType(type)}
                    >
                      <View
                        style={[
                          styles.typeDot,
                          type === 'veg' && { backgroundColor: '#10B981' },
                          type === 'egg' && { backgroundColor: '#F59E0B' },
                          type === 'nonveg' && { backgroundColor: '#EF4444' },
                        ]}
                      />
                      <Text style={[styles.typeFilterLabel, customType === type && styles.typeFilterLabelActive]}>
                        {type.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.modalFieldLabel}>Price (INR) - 18% GST auto-applied</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Price (INR)"
                  placeholderTextColor="#555"
                  keyboardType="numeric"
                  value={customPrice}
                  onChangeText={setCustomPrice}
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancel}
                    onPress={() => {
                      setCustomName('');
                      setCustomCategory('');
                      setCustomPrice('');
                      setCustomType('veg');
                      setShowCustomModal(false);
                    }}
                  >
                    <Text style={{ color: '#475569', fontWeight: 'bold' }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalSave} onPress={handleAddCustomItem}>
                    <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Add Item</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* 2. Review Bill Bottom Sheet / Modal */}
      <Modal visible={showBillReview} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <SafeAreaView style={styles.reviewSheetContainer}>
            {/* Header */}
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewHeaderTitle}>CURRENT BILL</Text>
              <TouchableOpacity onPress={() => setShowBillReview(false)}>
                <Ionicons name="close-circle-outline" size={28} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Subtotal Banner */}
            <View style={styles.reviewBillBanner}>
              <Text style={styles.reviewBannerSubLabel}>Sub Total</Text>
              <Text style={styles.reviewBannerSubText}>₹{getGrandTotal().toFixed(2)}</Text>
              <Text style={styles.reviewBannerGst}>Includes GST: ₹{getTaxAmount().toFixed(2)}</Text>

              {/* Dine-In vs Takeaway Selector */}
              <View style={styles.orderTypeContainer}>
                <TouchableOpacity
                  style={[styles.orderTypeBtn, orderType === 'Dine-In' && styles.orderTypeBtnActive]}
                  onPress={() => setOrderType('Dine-In')}
                >
                  <Ionicons
                    name="restaurant"
                    size={15}
                    color={orderType === 'Dine-In' ? '#FFFFFF' : '#2563EB'}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.orderTypeBtnText, orderType === 'Dine-In' && styles.orderTypeBtnTextActive]}>
                    Dine-In
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.orderTypeBtn, orderType === 'Takeaway' && styles.orderTypeBtnActive]}
                  onPress={() => setOrderType('Takeaway')}
                >
                  <Ionicons
                    name="bag"
                    size={15}
                    color={orderType === 'Takeaway' ? '#FFFFFF' : '#2563EB'}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.orderTypeBtnText, orderType === 'Takeaway' && styles.orderTypeBtnTextActive]}>
                    Takeaway
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.reviewPayBtn}
                onPress={() => {
                  setShowBillReview(false);
                  setCheckoutStep(1); // Proceed to payment mode selector
                }}
              >
                <Text style={styles.reviewPayBtnText}>PROCEED TO PAY</Text>
              </TouchableOpacity>
            </View>

            {/* Items list */}
            <FlatList
              data={cart}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.reviewList}
              renderItem={({ item, index }) => (
                <View style={styles.reviewRow}>
                  <Image source={{ uri: item.image }} style={styles.reviewRowThumb} />
                  
                  <View style={styles.reviewRowInfo}>
                    <Text style={styles.reviewItemName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.reviewItemPrice}>₹{item.price} x {item.quantity}</Text>
                  </View>

                  <View style={styles.reviewQtyControls}>
                    <TouchableOpacity
                      style={styles.reviewQtyBtn}
                      onPress={() => updateQuantity(index, item.quantity - 1)}
                    >
                      <Ionicons name="remove" size={14} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.reviewQtyText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.reviewQtyBtn}
                      onPress={() => updateQuantity(index, item.quantity + 1)}
                    >
                      <Ionicons name="add" size={14} color="#fff" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.reviewRowTotal}>₹{(item.price * item.quantity).toFixed(0)}</Text>
                </View>
              )}
            />
          </SafeAreaView>
        </View>
      </Modal>

      {/* Settings Modal (QR Code & Manage Menu) */}
      {/* Settings Modal (QR Code & Manage Menu) */}
      <Modal visible={showSettingsModal} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalBg}>
            <KeyboardAvoidingView
              behavior="padding"
              style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}
            >
              <SafeAreaView style={styles.settingsModalContainer}>
                {/* Header */}
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewHeaderTitle}>
                    {isAddingCatalogProduct ? 'ADD PRODUCT' : editingCatalogProduct !== null ? 'EDIT PRODUCT' : 'POS SETTINGS'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (isAddingCatalogProduct) {
                        setIsAddingCatalogProduct(false);
                      } else if (editingCatalogProduct !== null) {
                        setEditingCatalogProduct(null);
                      } else {
                        setShowSettingsModal(false);
                      }
                    }}
                  >
                    <Ionicons name="close-circle-outline" size={28} color="#64748B" />
                  </TouchableOpacity>
                </View>

                {isAddingCatalogProduct ? (
                  /* INLINE ADD PRODUCT FORM */
                  <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
                    <Text style={styles.modalFieldLabel}>Product Name</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Product Name (e.g. Garlic Naan)"
                      placeholderTextColor="#555"
                      value={catProdName}
                      onChangeText={setCatProdName}
                    />

                    <Text style={styles.modalFieldLabel}>Category</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Category (e.g. Biryani, Fry, Curry)"
                      placeholderTextColor="#555"
                      value={catProdCategory}
                      onChangeText={setCatProdCategory}
                    />

                    <Text style={styles.modalFieldLabel}>Price (INR)</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Price"
                      placeholderTextColor="#555"
                      keyboardType="numeric"
                      value={catProdPrice}
                      onChangeText={setCatProdPrice}
                    />

                    <Text style={styles.modalFieldLabel}>Product Image (Optional)</Text>
                    <View style={styles.productImagePickerContainer}>
                      {catProdImage ? (
                        <View style={styles.productImagePreviewWrapper}>
                          <Image source={{ uri: catProdImage }} style={styles.productImagePreview} />
                          <TouchableOpacity 
                            style={styles.productImageRemoveBtn} 
                            onPress={() => setCatProdImage('')}
                          >
                            <Ionicons name="close-circle" size={24} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity style={styles.productImagePickBtn} onPress={handlePickProductImage}>
                          <Ionicons name="image-outline" size={24} color="#2563EB" style={{ marginRight: 8 }} />
                          <Text style={styles.productImagePickBtnText}>Select Picture</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <Text style={styles.modalFieldLabel}>Highlight Tag (Optional)</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="e.g. Bestseller, Chef Choice"
                      placeholderTextColor="#555"
                      value={catProdTag}
                      onChangeText={setCatProdTag}
                    />

                    <Text style={styles.modalFieldLabel}>Food Type</Text>
                    <View style={styles.typeFilters}>
                      {['veg', 'egg', 'nonveg'].map((type) => (
                        <TouchableOpacity
                          key={type}
                          style={[
                            styles.typeFilterChip,
                            catProdType === type && styles.typeFilterChipActive,
                          ]}
                          onPress={() => setCatProdType(type)}
                        >
                          <View
                            style={[
                              styles.typeDot,
                              type === 'veg' && { backgroundColor: '#10B981' },
                              type === 'egg' && { backgroundColor: '#F59E0B' },
                              type === 'nonveg' && { backgroundColor: '#EF4444' },
                            ]}
                          />
                          <Text style={[styles.typeFilterLabel, catProdType === type && styles.typeFilterLabelActive]}>
                            {type.toUpperCase()}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <TouchableOpacity style={styles.saveMenuProductBtn} onPress={handleAddCatalogProduct}>
                      <Text style={styles.saveMenuProductBtnText}>Add to Menu</Text>
                    </TouchableOpacity>
                  </ScrollView>
                ) : editingCatalogProduct !== null ? (
                  /* INLINE EDIT PRODUCT FORM */
                  <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
                    <Text style={styles.modalFieldLabel}>Product Name</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Product Name"
                      placeholderTextColor="#555"
                      value={catProdName}
                      onChangeText={setCatProdName}
                    />

                    <Text style={styles.modalFieldLabel}>Category</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Category"
                      placeholderTextColor="#555"
                      value={catProdCategory}
                      onChangeText={setCatProdCategory}
                    />

                    <Text style={styles.modalFieldLabel}>Price (INR)</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Price"
                      placeholderTextColor="#555"
                      keyboardType="numeric"
                      value={catProdPrice}
                      onChangeText={setCatProdPrice}
                    />

                    <Text style={styles.modalFieldLabel}>Product Image</Text>
                    <View style={styles.productImagePickerContainer}>
                      {catProdImage ? (
                        <View style={styles.productImagePreviewWrapper}>
                          <Image source={{ uri: catProdImage }} style={styles.productImagePreview} />
                          <TouchableOpacity 
                            style={styles.productImageRemoveBtn} 
                            onPress={() => setCatProdImage('')}
                          >
                            <Ionicons name="close-circle" size={24} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity style={styles.productImagePickBtn} onPress={handlePickProductImage}>
                          <Ionicons name="image-outline" size={24} color="#2563EB" style={{ marginRight: 8 }} />
                          <Text style={styles.productImagePickBtnText}>Select Picture</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <Text style={styles.modalFieldLabel}>Highlight Tag</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Highlight Tag"
                      placeholderTextColor="#555"
                      value={catProdTag}
                      onChangeText={setCatProdTag}
                    />

                    <Text style={styles.modalFieldLabel}>Food Type</Text>
                    <View style={styles.typeFilters}>
                      {['veg', 'egg', 'nonveg'].map((type) => (
                        <TouchableOpacity
                          key={type}
                          style={[
                            styles.typeFilterChip,
                            catProdType === type && styles.typeFilterChipActive,
                          ]}
                          onPress={() => setCatProdType(type)}
                        >
                          <View
                            style={[
                              styles.typeDot,
                              type === 'veg' && { backgroundColor: '#10B981' },
                              type === 'egg' && { backgroundColor: '#F59E0B' },
                              type === 'nonveg' && { backgroundColor: '#EF4444' },
                            ]}
                          />
                          <Text style={[styles.typeFilterLabel, catProdType === type && styles.typeFilterLabelActive]}>
                            {type.toUpperCase()}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <TouchableOpacity style={styles.saveMenuProductBtn} onPress={handleEditCatalogProduct}>
                      <Text style={styles.saveMenuProductBtnText}>Save Changes</Text>
                    </TouchableOpacity>
                  </ScrollView>
                ) : (
                  /* REGULAR SETTINGS VIEWS (TABS) */
                  <>
                    {/* Tab selector */}
                    <View style={styles.settingsTabRow}>
                      <TouchableOpacity
                        style={[styles.settingsTabBtn, settingsTab === 'qr' && styles.settingsTabBtnActive]}
                        onPress={() => setSettingsTab('qr')}
                      >
                        <Text style={[styles.settingsTabLabel, settingsTab === 'qr' && styles.settingsTabLabelActive]}>UPI QR Code</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.settingsTabBtn, settingsTab === 'menu' && styles.settingsTabBtnActive]}
                        onPress={() => setSettingsTab('menu')}
                      >
                        <Text style={[styles.settingsTabLabel, settingsTab === 'menu' && styles.settingsTabLabelActive]}>Manage Menu</Text>
                      </TouchableOpacity>
                    </View>

                    {settingsTab === 'qr' ? (
                      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                        <View style={[styles.qrSettingsContent, { padding: 16 }]}>
                          <Text style={styles.qrSettingsPrompt}>
                            Upload your personal UPI QR code image from gallery. This will show on the checkout screen when a customer selects UPI.
                          </Text>

                          {customQrUri ? (
                            <View style={styles.uploadedQrWrapper}>
                              <Image source={{ uri: customQrUri }} style={styles.uploadedQrPreview} />
                              <Text style={styles.uploadedQrStatus}>Custom QR Active</Text>
                              
                              <TouchableOpacity style={styles.removeQrBtn} onPress={handleRemoveQrCode}>
                                <Ionicons name="trash-outline" size={16} color="#FF6B6B" />
                                <Text style={styles.removeQrBtnText}>Remove Custom QR</Text>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <View style={styles.defaultQrWrapper}>
                              <Ionicons name="qr-code-outline" size={80} color="#555" />
                              <Text style={styles.defaultQrStatus}>Default Placeholder QR Active</Text>
                              
                              <TouchableOpacity style={styles.uploadQrBtn} onPress={handlePickQrCode}>
                                <Ionicons name="image-outline" size={18} color="#121212" />
                                <Text style={styles.uploadQrBtnText}>Select QR from Gallery</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      </ScrollView>
                    ) : (
                      <FlatList
                        data={catalog}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
                        ListHeaderComponent={
                          <View style={styles.menuManageHeader}>
                            <Text style={styles.menuSectionTitle}>Menu Items ({catalog.length})</Text>
                            <TouchableOpacity
                              style={styles.menuAddBtn}
                              onPress={() => {
                                setCatProdName('');
                                setCatProdCategory('');
                                setCatProdPrice('');
                                setCatProdImage('');
                                setCatProdTag('');
                                setCatProdType('veg');
                                setIsAddingCatalogProduct(true);
                              }}
                            >
                              <Ionicons name="add" size={16} color="#121212" />
                              <Text style={styles.menuAddBtnText}>Add Item</Text>
                            </TouchableOpacity>
                          </View>
                        }
                        renderItem={({ item: prod }) => (
                          <View style={styles.menuItemRow}>
                            <Image source={{ uri: prod.image }} style={styles.menuItemThumb} />
                            <View style={{ flex: 1, marginRight: 8 }}>
                              <Text style={styles.menuItemName}>{prod.name}</Text>
                              <Text style={styles.menuItemCategory}>{prod.category} | ₹{prod.price}</Text>
                            </View>
                            <View style={styles.menuItemActions}>
                              <TouchableOpacity style={styles.menuEditAction} onPress={() => startEditCatalogProduct(prod)}>
                                <Ionicons name="create-outline" size={20} color="#2563EB" />
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.menuDeleteAction} onPress={() => handleDeleteCatalogProduct(prod.id, prod.name)}>
                                <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                              </TouchableOpacity>
                            </View>
                          </View>
                        )}
                      />
                    )}
                  </>
                )}
              </SafeAreaView>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* 4. Checkout Wizard Step-by-Step Sheets */}
      <Modal visible={checkoutStep > 0} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <KeyboardAvoidingView
            behavior="padding"
            style={{ width: '100%', position: 'absolute', bottom: 0 }}
          >
            <View style={[
              styles.bottomSheetContainer,
              checkoutStep === 2 && { height: SCREEN_HEIGHT * 0.75 },
              { position: 'relative' }
            ]}>
              <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Checkout - Step {checkoutStep} of 3</Text>
              <TouchableOpacity
                onPress={() => {
                  if (checkoutStep === 3 && selectedPaymentMode !== 'UPI') {
                    setCheckoutStep(1);
                  } else {
                    setCheckoutStep(checkoutStep - 1);
                  }
                }}
              >
                <Ionicons name="arrow-back" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* STEP 1: PAYMENT MODE SELECT */}
            {checkoutStep === 1 && (
              <View style={styles.sheetContent}>
                <Text style={styles.promptTitle}>Select Payment Mode</Text>
                <View style={styles.payModeRow}>
                  {['CASH', 'CARD', 'UPI'].map((mode) => (
                    <TouchableOpacity
                      key={mode}
                      style={[styles.payModeCard, selectedPaymentMode === mode && styles.payModeCardActive]}
                      onPress={() => setSelectedPaymentMode(mode)}
                    >
                      <Ionicons
                        name={mode === 'CASH' ? 'cash' : mode === 'CARD' ? 'card' : 'qr-code'}
                        size={32}
                        color={selectedPaymentMode === mode ? '#2563EB' : '#64748B'}
                      />
                      <Text style={[styles.payModeText, selectedPaymentMode === mode && styles.payModeTextActive]}>
                        {mode}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.sheetNextBtn}
                  onPress={() => {
                    if (selectedPaymentMode === 'UPI') {
                      setCheckoutStep(2);
                    } else {
                      setCheckoutStep(3); // skip UPI QR photo for Cash/Card
                    }
                  }}
                >
                  <Text style={styles.sheetNextBtnText}>Continue</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* STEP 2: INTERACTIVE UPI PHOTO SCREEN */}
            {checkoutStep === 2 && (
              <View style={[styles.sheetContent, { flex: 1, justifyContent: 'space-between', paddingBottom: 16 }]}>
                <View>
                  <Text style={styles.promptTitle}>Scan UPI QR to Pay</Text>
                  <Text style={styles.upiAmount}>Total Due: ₹{getGrandTotal().toFixed(2)}</Text>
                  
                  {/* Custom payment QR photo layout */}
                  <View style={styles.qrContainerLarge}>
                    {customQrUri ? (
                      <Image source={{ uri: customQrUri }} style={styles.qrImageXLarge} resizeMode="contain" />
                    ) : (
                      <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Ionicons name="qr-code-outline" size={180} color="#2563EB" />
                        <Text style={styles.qrLabel}>STATIC UPI QR IMAGE</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Verification Section */}
                <View style={styles.upiVerifySection}>
                  <Text style={styles.upiVerifyPrompt}>Did the customer complete the payment?</Text>
                  <View style={styles.upiVerifyBtnRow}>
                    <TouchableOpacity 
                      style={styles.upiVerifyBtnNotPaid} 
                      onPress={() => setCheckoutStep(1)}
                    >
                      <Ionicons name="close-circle-outline" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.upiVerifyBtnText}>NOT PAID</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.upiVerifyBtnPaid} 
                      onPress={() => setCheckoutStep(3)}
                    >
                      <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.upiVerifyBtnText}>PAID</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {/* STEP 3: RECEIPT DELIVERY OPT-IN */}
            {checkoutStep === 3 && (
              <View style={styles.sheetContent}>
                <Text style={styles.promptTitle}>Receipt Delivery</Text>

                {!showPhoneInput ? (
                  <>
                    <Text style={styles.promptSub}>Does the customer want the bill?</Text>
                    <View style={styles.deliveryRow}>
                      <TouchableOpacity
                        style={styles.deliveryBtnNo}
                        disabled={submittingBill}
                        onPress={() => processCheckout(false)}
                      >
                        {submittingBill ? <ActivityIndicator color="#fff" /> : <Text style={styles.deliveryBtnTextNo}>NO (Skip)</Text>}
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.deliveryBtnYes}
                        disabled={submittingBill}
                        onPress={() => setShowPhoneInput(true)}
                      >
                        <Text style={styles.deliveryBtnTextYes}>YES (WhatsApp)</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <View style={{ marginTop: 10 }}>
                    <Text style={[styles.promptSub, { marginBottom: 12 }]}>Enter Customer Phone (10-Digit):</Text>
                    <View style={styles.phoneInputWrapper}>
                      <Text style={styles.phonePrefix}>+91</Text>
                      <TextInput
                        style={styles.phoneInput}
                        placeholder="98765 43210"
                        placeholderTextColor="#555"
                        value={customerPhone}
                        onChangeText={(val) => setCustomerPhone(val.replace(/[^0-9]/g, ''))}
                        keyboardType="number-pad"
                        maxLength={10}
                        autoFocus
                      />
                    </View>

                    <View style={styles.deliveryRow}>
                      <TouchableOpacity
                        style={styles.deliveryBtnNo}
                        disabled={submittingBill}
                        onPress={() => setShowPhoneInput(false)}
                      >
                        <Text style={styles.deliveryBtnTextNo}>Back</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.deliveryBtnYes}
                        disabled={submittingBill}
                        onPress={() => processCheckout(true)}
                      >
                        {submittingBill ? (
                          <ActivityIndicator color="#121212" />
                        ) : (
                          <Text style={styles.deliveryBtnTextYes}>Send Invoice</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

// ==========================================
// 3. WRONG TRANSACTION CORRECTION LOG TAB
// ==========================================
function TransactionsTab({ session }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);

  // Editor Overlay Fields
  const [editPaymentMode, setEditPaymentMode] = useState('CASH');
  const [editCustomerPhone, setEditCustomerPhone] = useState('');
  const [editItems, setEditItems] = useState([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data);
    } catch (err) {
      Alert.alert('Load Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cascade Deletion
  const handleDeleteOrder = async (orderId, orderNum) => {
    Alert.alert(
      'Confirm Delete',
      `Delete invoice ${orderNum}? This executes a clean database cascade to remove all associated items.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.from('orders').delete().eq('id', orderId);
              if (error) throw error;
              loadTransactions();
              Alert.alert('Deleted', 'Invoice removed successfully.');
            } catch (err) {
              Alert.alert('Deletion Failed', err.message);
            }
          },
        },
      ]
    );
  };

  // Opens Invoice Editor Panel
  const openEditor = (order) => {
    setEditingOrder(order);
    setEditPaymentMode(order.payment_mode);
    setEditCustomerPhone(order.customer_phone || '');
    setEditItems(
      order.order_items.map((item) => ({
        ...item,
        unit_price: parseFloat(item.unit_price),
        quantity: parseInt(item.quantity),
        total_amount: parseFloat(item.total_amount),
        gst_rate: 18.0, // base rate assumption
      }))
    );
  };

  const updateEditQuantity = (index, qty) => {
    if (qty <= 0) return; // do not remove items during edit for simple layout safety
    setEditItems((prev) => {
      const updated = [...prev];
      const item = updated[index];
      const newTotal = item.unit_price * qty;
      const gstRate = item.gst_rate;
      const newGst = newTotal - (newTotal / (1 + (gstRate / 100)));

      updated[index] = {
        ...item,
        quantity: qty,
        gst_amount: parseFloat(newGst.toFixed(2)),
        total_amount: parseFloat(newTotal.toFixed(2)),
      };
      return updated;
    });
  };

  // Edit Aggregates
  const getEditGrandTotal = () => editItems.reduce((sum, item) => sum + item.total_amount, 0);
  const getEditTax = () => editItems.reduce((sum, item) => sum + parseFloat(item.gst_amount), 0);
  const getEditSubtotal = () => getEditGrandTotal() - getEditTax();

  // Save changes
  const saveInvoiceEdits = async () => {
    try {
      // 1. Update Order Header
      const { error: headerErr } = await supabase
        .from('orders')
        .update({
          subtotal: parseFloat(getEditSubtotal().toFixed(2)),
          tax_amount: parseFloat(getEditTax().toFixed(2)),
          grand_total: parseFloat(getEditGrandTotal().toFixed(2)),
          payment_mode: editPaymentMode,
          customer_phone: editCustomerPhone || null,
        })
        .eq('id', editingOrder.id);

      if (headerErr) throw headerErr;

      // 2. Cascade delete existing items
      const { error: deleteErr } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', editingOrder.id);

      if (deleteErr) throw deleteErr;

      // 3. Re-insert items list
      const itemsToInsert = editItems.map((item) => ({
        order_id: editingOrder.id,
        product_id: item.product_id,
        product_name: item.product_name,
        unit_price: item.unit_price,
        quantity: item.quantity,
        gst_amount: item.gst_amount,
        total_amount: item.total_amount,
      }));

      const { error: insertErr } = await supabase.from('order_items').insert(itemsToInsert);
      if (insertErr) throw insertErr;

      setEditingOrder(null);
      loadTransactions();
      Alert.alert('Updated', 'Invoice modified successfully.');
    } catch (err) {
      Alert.alert('Save Failed', err.message);
    }
  };

  const isDemoMode = session?.user?.id === 'demo-user-id';

  return (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>PAST TRANSACTIONS</Text>
        <TouchableOpacity onPress={loadTransactions}>
          <Ionicons name="refresh" size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {isDemoMode && (
        <View style={styles.demoBanner}>
          <Ionicons name="information-circle-outline" size={20} color="#854D0E" style={{ marginRight: 8 }} />
          <Text style={styles.demoBannerText}>
            Running in Offline Demo Mode. Syncing to database is disabled. Sign up or log in to view past cloud transactions.
          </Text>
        </View>
      )}

      {loading ? (
        <ActivityIndicator color="#2563EB" style={{ flex: 1 }} />
      ) : orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={48} color="#94A3B8" style={{ marginBottom: 12 }} />
          <Text style={styles.emptyStateText}>No past transactions found.</Text>
          {isDemoMode && (
            <Text style={styles.emptyStateSubText}>
              Create a registered account to start syncing transactions.
            </Text>
          )}
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.transactionsList}
          renderItem={({ item }) => (
            <View style={styles.logCard}>
              <View style={styles.logHeader}>
                <Text style={styles.logInvoiceNum}>{item.order_number}</Text>
                <View style={styles.badge(item.payment_mode)}>
                  <Text style={styles.badgeText(item.payment_mode)}>{item.payment_mode}</Text>
                </View>
              </View>
              <Text style={styles.logDate}>{new Date(item.created_at).toLocaleString()}</Text>

              {/* Items listing */}
              <View style={styles.logItemsSection}>
                {item.order_items?.map((line, idx) => (
                  <View key={idx} style={styles.logItemRow}>
                    <Text style={{ color: '#334155', fontSize: 13 }}>
                      {line.product_name} x{line.quantity}
                    </Text>
                    <Text style={{ color: '#475569', fontSize: 13 }}>₹{line.total_amount}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.logFooter}>
                <View>
                  {item.customer_phone ? <Text style={styles.phoneLabel}>📱 +{item.customer_phone}</Text> : null}
                  <Text style={styles.logTotal}>Total: ₹{parseFloat(item.grand_total).toFixed(2)}</Text>
                </View>
                <View style={styles.logActions}>
                  <TouchableOpacity style={styles.editBtn} onPress={() => openEditor(item)}>
                    <Ionicons name="create" size={20} color="#2563EB" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteOrder(item.id, item.order_number)}>
                    <Ionicons name="trash" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}

      {/* Past Bill Edit Panel Modal */}
      <Modal visible={editingOrder !== null} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalBg}>
            <KeyboardAvoidingView
              behavior="padding"
              style={{ width: '100%', position: 'absolute', bottom: 0 }}
            >
              <View style={styles.editPanelContainer}>
                <View style={styles.sheetHeader}>
                  <Text style={styles.sheetTitle}>Edit Invoice: {editingOrder?.order_number}</Text>
                  <TouchableOpacity onPress={() => setEditingOrder(null)}>
                    <Ionicons name="close" size={24} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={{ flex: 1, paddingVertical: 16 }}>
                  {/* Payment selector */}
                  <View style={styles.editGroup}>
                    <Text style={styles.editLabel}>Payment Mode:</Text>
                    <View style={styles.payModeRowMini}>
                      {['CASH', 'CARD', 'UPI'].map((mode) => (
                        <TouchableOpacity
                          key={mode}
                          style={[styles.payModeCardMini, editPaymentMode === mode && styles.payModeCardMiniActive]}
                          onPress={() => setEditPaymentMode(mode)}
                        >
                          <Text style={[styles.payModeTextMini, editPaymentMode === mode && styles.payModeTextMiniActive]}>
                            {mode}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Customer Mobile */}
                  <View style={styles.editGroup}>
                    <Text style={styles.editLabel}>WhatsApp Phone:</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={editCustomerPhone}
                      onChangeText={setEditCustomerPhone}
                      keyboardType="phone-pad"
                      placeholder="No phone registered"
                      placeholderTextColor="#444"
                    />
                  </View>

                  {/* Editable line items */}
                  <Text style={[styles.editLabel, { marginTop: 12 }]}>Line Items:</Text>
                  {editItems.map((item, index) => (
                    <View key={index} style={styles.editItemRow}>
                      <Text style={styles.editItemName} numberOfLines={1}>{item.product_name}</Text>
                      <View style={styles.editQtyControls}>
                        <TouchableOpacity onPress={() => updateEditQuantity(index, item.quantity - 1)}>
                          <Ionicons name="remove-circle-outline" size={20} color="#888" />
                        </TouchableOpacity>
                        <Text style={styles.editQty}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => updateEditQuantity(index, item.quantity + 1)}>
                          <Ionicons name="add-circle-outline" size={20} color="#888" />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.editRowTotal}>₹{item.total_amount.toFixed(2)}</Text>
                    </View>
                  ))}
                </ScrollView>

                <View style={styles.editPanelFooter}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Projected Total:</Text>
                    <Text style={styles.totalValue}>₹{getEditGrandTotal().toFixed(2)}</Text>
                  </View>
                  <TouchableOpacity style={styles.saveEditsBtn} onPress={saveInvoiceEdits}>
                    <Text style={styles.saveEditsBtnText}>Save Invoice Changes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

// ==========================================
// 4. REAL-TIME STATISTICS DASHBOARD TAB
// ==========================================
function StatsTab({ session }) {
  const [stats, setStats] = useState({
    dailyRevenue: 0.0,
    dailyCount: 0,
    yesterdayRevenue: 0.0,
    weeklyRevenue: 0.0,
    weeklyCount: 0,
    monthlyRevenue: 0.0,
    monthlyCount: 0,
    yearlyRevenue: 0.0,
    yearlyCount: 0,
    cashSales: 0.0,
    cardSales: 0.0,
    upiSales: 0.0,
    totalSales: 0.0,
    invoiceCount: 0,
    totalGST: 0.0,
    dineInCount: 0,
    takeawayCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [sharingSummary, setSharingSummary] = useState(false);

  // Custom Calendar State
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonthYear, setCurrentMonthYear] = useState(new Date());

  const selectedDateRef = useRef(selectedDate);

  useEffect(() => {
    selectedDateRef.current = selectedDate;
    loadStats();
  }, [selectedDate]);

  useEffect(() => {
    // Live Real-time listener for database mutations
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          loadStats(); // Recompute stats when inserts, updates, or deletes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadStats = async () => {
    try {
      const { data, error } = await supabase.from('orders').select('grand_total, subtotal, tax_amount, payment_mode, created_at, order_number');
      if (error) throw error;

      const allOrders = data || [];
      const anchor = selectedDateRef.current || new Date();

      // Time boundaries relative to selected date
      const startOfSelectedDay = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate()).getTime();
      const endOfSelectedDay = startOfSelectedDay + 24 * 60 * 60 * 1000;
      const startOfYesterday = startOfSelectedDay - 24 * 60 * 60 * 1000;
      const sevenDaysAgo = endOfSelectedDay - 7 * 24 * 60 * 60 * 1000;
      const thirtyDaysAgo = endOfSelectedDay - 30 * 24 * 60 * 60 * 1000;
      const oneYearAgo = endOfSelectedDay - 365 * 24 * 60 * 60 * 1000;

      let dailyRevenue = 0.0;
      let dailyCount = 0;
      let yesterdayRevenue = 0.0;
      let weeklyRevenue = 0.0;
      let weeklyCount = 0;
      let monthlyRevenue = 0.0;
      let monthlyCount = 0;
      let yearlyRevenue = 0.0;
      let yearlyCount = 0;

      let cashSales = 0.0;
      let cardSales = 0.0;
      let upiSales = 0.0;
      let totalGST = 0.0;
      let dineInCount = 0;
      let takeawayCount = 0;

      allOrders.forEach((order) => {
        const total = parseFloat(order.grand_total) || 0;
        const orderTime = new Date(order.created_at).getTime();

        const isSelectedDay = orderTime >= startOfSelectedDay && orderTime < endOfSelectedDay;
        if (isSelectedDay) {
          dailyRevenue += total;
          dailyCount += 1;
          if (order.payment_mode === 'CASH') cashSales += total;
          if (order.payment_mode === 'CARD') cardSales += total;
          if (order.payment_mode === 'UPI') upiSales += total;
          totalGST += parseFloat(order.tax_amount) || 0;
          const isTakeaway = order.order_number && order.order_number.includes('Takeaway');
          if (isTakeaway) takeawayCount += 1;
          else dineInCount += 1;
        }

        const isYesterday = orderTime >= startOfYesterday && orderTime < startOfSelectedDay;
        if (isYesterday) {
          yesterdayRevenue += total;
        }

        if (orderTime >= sevenDaysAgo && orderTime < endOfSelectedDay) {
          weeklyRevenue += total;
          weeklyCount += 1;
        }

        if (orderTime >= thirtyDaysAgo && orderTime < endOfSelectedDay) {
          monthlyRevenue += total;
          monthlyCount += 1;
        }

        if (orderTime >= oneYearAgo && orderTime < endOfSelectedDay) {
          yearlyRevenue += total;
          yearlyCount += 1;
        }
      });

      setStats({
        dailyRevenue,
        dailyCount,
        yesterdayRevenue,
        weeklyRevenue,
        weeklyCount,
        monthlyRevenue,
        monthlyCount,
        yearlyRevenue,
        yearlyCount,
        cashSales,
        cardSales,
        upiSales,
        totalSales: dailyRevenue,
        invoiceCount: dailyCount,
        totalGST,
        dineInCount,
        takeawayCount,
      });
    } catch (err) {
      console.log('Stats Load Error: ', err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (value) => {
    if (stats.totalSales === 0) return 0;
    return value / stats.totalSales;
  };

  const shareDaySummary = async () => {
    setSharingSummary(true);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const dateStr = `${selectedDate.getDate()} ${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
    const text =
      `📊 *DAILY SALES SUMMARY — ${dateStr}*\n\n` +
      `🧾 Total Bills: *${stats.dailyCount}*\n` +
      `💰 Total Revenue: *₹${stats.dailyRevenue.toFixed(2)}*\n\n` +
      `💵 Cash: ₹${stats.cashSales.toFixed(2)}\n` +
      `📱 UPI: ₹${stats.upiSales.toFixed(2)}\n` +
      `💳 Card: ₹${stats.cardSales.toFixed(2)}\n\n` +
      `📊 Total GST: ₹${stats.totalGST.toFixed(2)}\n` +
      `🍽️ Dine-In: ${stats.dineInCount} | 🥡 Takeaway: ${stats.takeawayCount}\n\n` +
      `_Generated by Zero Cost POS_`;
    try {
      await Linking.openURL(`https://wa.me/?text=${encodeURIComponent(text)}`);
    } catch (_) {
      Alert.alert('Error', 'Could not open WhatsApp.');
    }
    setSharingSummary(false);
  };

  const isDemoMode = session?.user?.id === 'demo-user-id';

  const formatDateString = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const isTodaySelected = () => {
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  const getMonthName = (date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[date.getMonth()];
  };

  const renderCalendarDays = () => {
    const year = currentMonthYear.getFullYear();
    const month = currentMonthYear.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();

    const cells = [];
    
    // Blank padding cells
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(<View key={`blank-${i}`} style={styles.calendarDayCellEmpty} />);
    }

    const today = new Date();

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const isSelected = 
        day === selectedDate.getDate() &&
        month === selectedDate.getMonth() &&
        year === selectedDate.getFullYear();
      
      const isToday = 
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      cells.push(
        <TouchableOpacity
          key={`day-${day}`}
          style={[
            styles.calendarDayCell,
            isSelected && styles.calendarDayCellSelected,
            isToday && !isSelected && styles.calendarDayCellToday,
          ]}
          onPress={() => {
            setSelectedDate(cellDate);
            setShowCalendar(false);
          }}
        >
          <Text
            style={[
              styles.calendarDayText,
              isSelected && styles.calendarDayTextSelected,
              isToday && !isSelected && styles.calendarDayTextToday,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return cells;
  };

  return (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>REAL-TIME METRICS</Text>
        <Ionicons name="radio-outline" size={20} color="#2563EB" />
      </View>

      {isDemoMode && (
        <View style={styles.demoBanner}>
          <Ionicons name="information-circle-outline" size={20} color="#854D0E" style={{ marginRight: 8 }} />
          <Text style={styles.demoBannerText}>
            Running in Offline Demo Mode. Syncing to database is disabled. Sign up or log in to see live statistics.
          </Text>
        </View>
      )}

      {/* Date Selector Bar */}
      <TouchableOpacity 
        style={styles.dateSelectorBar} 
        onPress={() => {
          setShowCalendar(!showCalendar);
          setCurrentMonthYear(new Date(selectedDate));
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="calendar-outline" size={20} color="#2563EB" style={{ marginRight: 10 }} />
          <View>
            <Text style={styles.dateSelectorLabel}>Selected Date</Text>
            <Text style={styles.dateSelectorValue}>
              {formatDateString(selectedDate)} {isTodaySelected() && '(Today)'}
            </Text>
          </View>
        </View>
        <Ionicons 
          name={showCalendar ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#64748B" 
        />
      </TouchableOpacity>

      {/* Inline Calendar Picker */}
      {showCalendar && (
        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeaderRow}>
            <TouchableOpacity 
              style={styles.calendarNavBtn} 
              onPress={() => {
                const prev = new Date(currentMonthYear.getFullYear(), currentMonthYear.getMonth() - 1, 1);
                setCurrentMonthYear(prev);
              }}
            >
              <Ionicons name="chevron-back" size={16} color="#2563EB" />
            </TouchableOpacity>
            
            <Text style={styles.calendarMonthYearTitle}>
              {getMonthName(currentMonthYear)} {currentMonthYear.getFullYear()}
            </Text>
            
            <TouchableOpacity 
              style={styles.calendarNavBtn} 
              onPress={() => {
                const next = new Date(currentMonthYear.getFullYear(), currentMonthYear.getMonth() + 1, 1);
                setCurrentMonthYear(next);
              }}
            >
              <Ionicons name="chevron-forward" size={16} color="#2563EB" />
            </TouchableOpacity>
          </View>

          <View style={styles.calendarDaysOfWeekRow}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, idx) => (
              <Text key={idx} style={styles.calendarDayOfWeekLabel}>{day}</Text>
            ))}
          </View>

          <View style={styles.calendarDaysGrid}>
            {renderCalendarDays()}
          </View>
        </View>
      )}

      {loading ? (
        <ActivityIndicator color="#2563EB" style={{ flex: 1 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.statsContainer}>
          {/* Period Statistics Grid */}
          <Text style={styles.sectionTitleText}>PERIOD REVENUE</Text>
          
          <View style={styles.statsPeriodGrid}>
            {/* Daily */}
            <View style={styles.statsPeriodCard}>
              <View style={styles.periodCardHeader}>
                <Ionicons name="today-outline" size={18} color="#2563EB" />
                <Text style={styles.periodCardLabel}>{isTodaySelected() ? 'Daily' : 'Selected Day'}</Text>
              </View>
              <Text style={styles.periodCardValue}>₹{stats.dailyRevenue.toFixed(2)}</Text>
              <Text style={styles.periodCardSub}>{stats.dailyCount} bills</Text>
            </View>

            {/* Weekly */}
            <View style={styles.statsPeriodCard}>
              <View style={styles.periodCardHeader}>
                <Ionicons name="calendar-outline" size={18} color="#2563EB" />
                <Text style={styles.periodCardLabel}>Weekly (7d)</Text>
              </View>
              <Text style={styles.periodCardValue}>₹{stats.weeklyRevenue.toFixed(2)}</Text>
              <Text style={styles.periodCardSub}>{stats.weeklyCount} bills</Text>
            </View>
          </View>

          <View style={styles.statsPeriodGrid}>
            {/* Monthly */}
            <View style={styles.statsPeriodCard}>
              <View style={styles.periodCardHeader}>
                <Ionicons name="trending-up-outline" size={18} color="#2563EB" />
                <Text style={styles.periodCardLabel}>Monthly (30d)</Text>
              </View>
              <Text style={styles.periodCardValue}>₹{stats.monthlyRevenue.toFixed(2)}</Text>
              <Text style={styles.periodCardSub}>{stats.monthlyCount} bills</Text>
            </View>

            {/* Yearly */}
            <View style={styles.statsPeriodCard}>
              <View style={styles.periodCardHeader}>
                <Ionicons name="analytics-outline" size={18} color="#2563EB" />
                <Text style={styles.periodCardLabel}>Yearly (365d)</Text>
              </View>
              <Text style={styles.periodCardValue}>₹{stats.yearlyRevenue.toFixed(2)}</Text>
              <Text style={styles.periodCardSub}>{stats.yearlyCount} bills</Text>
            </View>
          </View>

          {/* Revenue Widget */}
          <View style={styles.revenueCard}>
            <Text style={styles.revLabel}>
              {isTodaySelected() ? 'TOTAL DAILY REVENUE' : 'REVENUE ON SELECTED DATE'}
            </Text>
            <Text style={styles.revValue}>₹{stats.totalSales.toFixed(2)}</Text>
            <View style={styles.revSubrow}>
              <Text style={styles.revSubtext}>
                {isTodaySelected() ? 'Invoices Today: ' : 'Invoices: '}{stats.invoiceCount}
              </Text>
              <View style={isTodaySelected() ? styles.liveIndicator : styles.historicalIndicator}>
                <View style={isTodaySelected() ? styles.liveDot : styles.historicalDot} />
                <Text style={isTodaySelected() ? styles.liveText : styles.historicalText}>
                  {isTodaySelected() ? 'Live' : 'Historical'}
                </Text>
              </View>
            </View>
            
            <View style={styles.revenueCardSeparator} />
            
            <View style={styles.yesterdayRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="time-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.yesterdayLabel}>
                  {isTodaySelected() ? "Yesterday's Sales" : "Preceding Day's Sales"}
                </Text>
              </View>
              <Text style={styles.yesterdayValue}>₹{stats.yesterdayRevenue.toFixed(2)}</Text>
            </View>
          </View>

          {/* Breakdown Segment */}
          <Text style={styles.breakdownTitle}>PAYMENT CHANNEL SPLIT</Text>

          {/* Cash Card */}
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownHeader}>
              <View style={styles.modeIndicator}>
                <Ionicons name="cash" size={20} color="#FFD700" />
                <Text style={styles.breakdownLabel}>CASH SALES</Text>
              </View>
              <Text style={styles.breakdownValue}>₹{stats.cashSales.toFixed(2)}</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: `${getPercentage(stats.cashSales) * 100}%`, backgroundColor: '#FFD700' }]} />
            </View>
            <Text style={styles.percentText}>{(getPercentage(stats.cashSales) * 100).toFixed(0)}% of sales</Text>
          </View>

          {/* UPI Card */}
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownHeader}>
              <View style={styles.modeIndicator}>
                <Ionicons name="qr-code" size={20} color="#8B5CF6" />
                <Text style={styles.breakdownLabel}>UPI SALES</Text>
              </View>
              <Text style={styles.breakdownValue}>₹{stats.upiSales.toFixed(2)}</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: `${getPercentage(stats.upiSales) * 100}%`, backgroundColor: '#8B5CF6' }]} />
            </View>
            <Text style={styles.percentText}>{(getPercentage(stats.upiSales) * 100).toFixed(0)}% of sales</Text>
          </View>

          {/* Card Card */}
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownHeader}>
              <View style={styles.modeIndicator}>
                <Ionicons name="card" size={20} color="#3B82F6" />
                <Text style={styles.breakdownLabel}>CARD SALES</Text>
              </View>
              <Text style={styles.breakdownValue}>₹{stats.cardSales.toFixed(2)}</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: `${getPercentage(stats.cardSales) * 100}%`, backgroundColor: '#3B82F6' }]} />
            </View>
            <Text style={styles.percentText}>{(getPercentage(stats.cardSales) * 100).toFixed(0)}% of sales</Text>
          </View>

          {/* End of Day Summary Button */}
          <TouchableOpacity
            style={styles.summaryBtn}
            onPress={() => setShowSummaryModal(true)}
          >
            <Ionicons name="document-text-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={styles.summaryBtnText}>📋 View Day Summary Receipt</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Day Summary Modal */}
      <Modal visible={showSummaryModal} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={[styles.modalContainer, { maxHeight: '85%' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={styles.modalTitle}>📋 Day Summary</Text>
              <TouchableOpacity onPress={() => setShowSummaryModal(false)}>
                <Ionicons name="close-circle" size={28} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Date Header */}
              <View style={{ backgroundColor: '#2563EB', borderRadius: 12, padding: 16, marginBottom: 16, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 13, opacity: 0.8 }}>SALES REPORT</Text>
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 4 }}>{formatDateString(selectedDate)}</Text>
                {isTodaySelected() && <View style={{ backgroundColor: '#10b981', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, marginTop: 6 }}><Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>TODAY</Text></View>}
              </View>

              {/* Main Stats */}
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                <View style={{ flex: 1, backgroundColor: '#f0fdf4', borderRadius: 12, padding: 14, alignItems: 'center' }}>
                  <Text style={{ fontSize: 11, color: '#16a34a', fontWeight: '700' }}>TOTAL REVENUE</Text>
                  <Text style={{ fontSize: 22, fontWeight: '900', color: '#15803d', marginTop: 4 }}>₹{stats.dailyRevenue.toFixed(2)}</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: '#eff6ff', borderRadius: 12, padding: 14, alignItems: 'center' }}>
                  <Text style={{ fontSize: 11, color: '#2563EB', fontWeight: '700' }}>TOTAL BILLS</Text>
                  <Text style={{ fontSize: 22, fontWeight: '900', color: '#1d4ed8', marginTop: 4 }}>{stats.dailyCount}</Text>
                </View>
              </View>

              {/* Payment Breakdown */}
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 8, marginTop: 6 }}>PAYMENT BREAKDOWN</Text>
              <View style={{ backgroundColor: '#f8fafc', borderRadius: 12, padding: 14, marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="cash" size={16} color="#f59e0b" style={{ marginRight: 6 }} />
                    <Text style={{ color: '#334155', fontWeight: '600' }}>Cash</Text>
                  </View>
                  <Text style={{ fontWeight: '800', color: '#0f172a' }}>₹{stats.cashSales.toFixed(2)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="qr-code" size={16} color="#8b5cf6" style={{ marginRight: 6 }} />
                    <Text style={{ color: '#334155', fontWeight: '600' }}>UPI</Text>
                  </View>
                  <Text style={{ fontWeight: '800', color: '#0f172a' }}>₹{stats.upiSales.toFixed(2)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="card" size={16} color="#3b82f6" style={{ marginRight: 6 }} />
                    <Text style={{ color: '#334155', fontWeight: '600' }}>Card</Text>
                  </View>
                  <Text style={{ fontWeight: '800', color: '#0f172a' }}>₹{stats.cardSales.toFixed(2)}</Text>
                </View>
              </View>

              {/* GST & Order Type */}
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 8 }}>OTHER DETAILS</Text>
              <View style={{ backgroundColor: '#f8fafc', borderRadius: 12, padding: 14, marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' }}>
                  <Text style={{ color: '#334155', fontWeight: '600' }}>Total GST Collected</Text>
                  <Text style={{ fontWeight: '800', color: '#0f172a' }}>₹{stats.totalGST.toFixed(2)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' }}>
                  <Text style={{ color: '#334155', fontWeight: '600' }}>🍽️ Dine-In Orders</Text>
                  <Text style={{ fontWeight: '800', color: '#0f172a' }}>{stats.dineInCount}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
                  <Text style={{ color: '#334155', fontWeight: '600' }}>🥡 Takeaway Orders</Text>
                  <Text style={{ fontWeight: '800', color: '#0f172a' }}>{stats.takeawayCount}</Text>
                </View>
              </View>

              {/* Share Button */}
              <TouchableOpacity
                style={[styles.summaryBtn, { marginBottom: 8 }]}
                onPress={shareDaySummary}
                disabled={sharingSummary}
              >
                <Ionicons name="logo-whatsapp" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={styles.summaryBtnText}>{sharingSummary ? 'Opening WhatsApp...' : 'Share via WhatsApp'}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ==========================================
// 5. PROFILE & OPERATOR SETTINGS TAB
// ==========================================
function ProfileTab({ session, onLogout }) {
  const [restaurantName, setRestaurantName] = useState('My Restaurant');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  useEffect(() => {
    const loadRestaurantName = async () => {
      try {
        const savedName = await AsyncStorage.getItem('restaurant_name');
        if (savedName) {
          setRestaurantName(savedName);
        }
      } catch (err) {
        console.log('Error loading restaurant name:', err);
      }
    };
    loadRestaurantName();
  }, []);

  const handleSaveName = async () => {
    const cleanedName = tempName.trim();
    if (!cleanedName) {
      Alert.alert('Validation Error', 'Restaurant name cannot be empty.');
      return;
    }
    try {
      await AsyncStorage.setItem('restaurant_name', cleanedName);
      setRestaurantName(cleanedName);
      setIsEditingName(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to save restaurant name.');
      console.log('Error saving restaurant name:', err);
    }
  };

  const handleStartEditing = () => {
    setTempName(restaurantName);
    setIsEditingName(true);
  };

  const handleCancelEditing = () => {
    setIsEditingName(false);
  };

  const handlePressLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out of the operator session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: onLogout }
      ]
    );
  };

  const getInitials = (name) => {
    if (!name) return 'R';
    return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.profileContainer}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        {/* Profile Card Header */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatarWrapper}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>{getInitials(restaurantName)}</Text>
            </View>
          </View>

          {isEditingName ? (
            <View style={styles.profileEditRow}>
              <TextInput
                style={styles.profileEditInput}
                value={tempName}
                onChangeText={setTempName}
                placeholder="Enter Restaurant Name"
                placeholderTextColor="#64748B"
                maxLength={40}
              />
              <View style={styles.profileEditActionButtons}>
                <TouchableOpacity style={styles.profileSaveIconBtn} onPress={handleSaveName}>
                  <Ionicons name="checkmark-circle" size={32} color="#2563EB" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileCancelIconBtn} onPress={handleCancelEditing}>
                  <Ionicons name="close-circle" size={32} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.profileNameRow}>
              <Text style={styles.profileNameText}>{restaurantName}</Text>
              <TouchableOpacity style={styles.profileEditBtn} onPress={handleStartEditing}>
                <Ionicons name="pencil" size={18} color="#2563EB" />
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.profileSubText}>Retail POS Operator</Text>
        </View>

        {/* Account Details Card */}
        <View style={styles.profileCard}>
          <Text style={styles.profileSectionTitle}>Operator Information</Text>
          <View style={styles.profileSeparator} />

          {/* Restaurant Field */}
          <View style={styles.profileInfoRow}>
            <View style={styles.profileInfoLabelRow}>
              <Ionicons name="storefront-outline" size={20} color="#64748B" style={{ marginRight: 10 }} />
              <Text style={styles.profileInfoLabel}>Restaurant</Text>
            </View>
            <Text style={styles.profileInfoValue}>{restaurantName}</Text>
          </View>

          <View style={styles.profileInfoSeparator} />

          {/* Email Field */}
          <View style={styles.profileInfoRow}>
            <View style={styles.profileInfoLabelRow}>
              <Ionicons name="mail-outline" size={20} color="#64748B" style={{ marginRight: 10 }} />
              <Text style={styles.profileInfoLabel}>Email ID</Text>
            </View>
            <Text style={styles.profileInfoValue} numberOfLines={1} ellipsizeMode="tail">
              {session?.user?.email || 'demo@shop.com'}
            </Text>
          </View>

          <View style={styles.profileInfoSeparator} />

          {/* Connection status */}
          <View style={styles.profileInfoRow}>
            <View style={styles.profileInfoLabelRow}>
              <Ionicons name="cloud-done-outline" size={20} color="#64748B" style={{ marginRight: 10 }} />
              <Text style={styles.profileInfoLabel}>Status</Text>
            </View>
            <Text style={[styles.profileInfoValue, { color: '#16A34A', fontWeight: 'bold' }]}>
              {session?.user?.id === 'demo-user-id' ? 'Offline (Demo Mode)' : 'Connected to Cloud'}
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.profileLogoutBtn} onPress={handlePressLogout}>
          <Ionicons name="log-out" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.profileLogoutText}>Logout Account</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// ==========================================
// STYLESHEET
// ==========================================
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentArea: {
    flex: 1,
  },
  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    borderTopWidth: 2,
    borderTopColor: '#2563EB',
  },
  tabLabel: {
    fontSize: 10,
    color: '#475569',
    marginTop: 4,
  },
  tabLabelActive: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
  // Authentication Styling
  loginContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  loginLogo: {
    marginBottom: 16,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    letterSpacing: 2,
  },
  loginSubtitle: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  loginAuthor: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    width: '100%',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    height: 52,
    paddingHorizontal: 16,
    color: '#1E293B',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    height: 52,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    color: '#1E293B',
    fontSize: 16,
    padding: 0,
  },
  passwordToggleIcon: {
    padding: 4,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  phonePrefix: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    color: '#1E293B',
    fontSize: 16,
    height: '100%',
  },
  bypassBtn: {
    marginTop: 24,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    borderStyle: 'dashed',
  },
  bypassBtnText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: 'bold',
  },
  summaryBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 4,
  },
  summaryBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  actionBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  actionBtnText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textLink: {
    marginTop: 16,
    alignSelf: 'center',
  },
  textLinkText: {
    color: '#2563EB',
    fontSize: 14,
  },
  errorText: {
    color: '#EF4444',
    marginTop: 16,
    fontSize: 14,
    textAlign: 'center',
  },
  // Common Tab Header
  tabContent: {
    flex: 1,
  },
  tabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    justifyContent: 'space-between',
  },
  tabTitle: {
    color: '#2563EB',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  // Quick pick Catalog
  catalogContainer: {
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  catalogScroll: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  catalogChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catalogChipAdd: {
    flexDirection: 'row',
    borderColor: '#2563EB',
    borderStyle: 'dashed',
  },
  catalogChipName: {
    color: '#1E293B',
    fontSize: 12,
    fontWeight: 'bold',
  },
  catalogChipPrice: {
    color: '#2563EB',
    fontSize: 10,
    marginTop: 2,
  },
  // POS Cart
  cartList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    color: '#475569',
    fontSize: 14,
    marginTop: 16,
  },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cartDetails: {
    flex: 1,
  },
  cartItemName: {
    color: '#1E293B',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cartItemMeta: {
    color: '#475569',
    fontSize: 11,
    marginTop: 4,
  },
  cartControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  cartQty: {
    color: '#2563EB',
    fontWeight: 'bold',
    fontSize: 14,
    marginHorizontal: 8,
  },
  cartRowTotal: {
    color: '#1E293B',
    fontWeight: 'bold',
    fontSize: 14,
    width: 70,
    textAlign: 'right',
  },
  // Footer
  checkoutFooter: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    color: '#475569',
    fontSize: 13,
  },
  summaryValue: {
    color: '#475569',
    fontSize: 13,
  },
  totalLabel: {
    color: '#1E293B',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    color: '#2563EB',
    fontSize: 20,
    fontWeight: 'bold',
  },
  checkoutBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  disabledBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  checkoutBtnText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal Overlays
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalTitle: {
    color: '#1E293B',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    color: '#1E293B',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalSelectGst: {
    marginBottom: 20,
  },
  gstRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  gstOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  gstOptionActive: {
    borderColor: '#2563EB',
    backgroundColor: 'rgba(37,99,235,0.05)',
  },
  gstText: {
    color: '#475569',
    fontSize: 12,
  },
  gstTextActive: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalCancel: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  modalSave: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  // Bottom Sheet
  bottomSheetContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sheetHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    color: '#475569',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sheetContent: {
    paddingVertical: 10,
  },
  promptTitle: {
    color: '#1E293B',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  promptSub: {
    color: '#475569',
    fontSize: 14,
    marginBottom: 24,
  },
  payModeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  payModeCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  payModeCardActive: {
    borderColor: '#2563EB',
    backgroundColor: 'rgba(37,99,235,0.05)',
  },
  payModeText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  payModeTextActive: {
    color: '#2563EB',
  },
  sheetNextBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetNextBtnText: {
    color: '#121212',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // UPI QR Flow
  upiAmount: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  qrContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  qrLabel: {
    color: '#475569',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 8,
  },
  paidBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paidBtnText: {
    color: '#121212',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 2,
  },
  // Receipt Buttons
  deliveryRow: {
    flexDirection: 'row',
  },
  deliveryBtnNo: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  deliveryBtnTextNo: {
    color: '#1E293B',
    fontWeight: 'bold',
  },
  deliveryBtnYes: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  deliveryBtnTextYes: {
    color: '#121212',
    fontWeight: 'bold',
  },
  // Dialog Card
  dialogBg: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '80%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dialogTitle: {
    color: '#1E293B',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dialogInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  dialogCancel: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  dialogConfirm: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  // Transactions Tab
  transactionsList: {
    padding: 16,
  },
  logCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logInvoiceNum: {
    color: '#1E293B',
    fontWeight: 'bold',
    fontSize: 15,
  },
  badge: (mode) => ({
    backgroundColor: mode === 'UPI' ? 'rgba(139, 92, 246, 0.2)' : mode === 'CASH' ? 'rgba(250, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: mode === 'UPI' ? '#8B5CF6' : mode === 'CASH' ? '#FFD700' : '#3B82F6',
  }),
  badgeText: (mode) => ({
    color: mode === 'UPI' ? '#A78BFA' : mode === 'CASH' ? '#FFD700' : '#60A5FA',
    fontSize: 10,
    fontWeight: 'bold',
  }),
  logDate: {
    color: '#475569',
    fontSize: 11,
    marginTop: 4,
  },
  logItemsSection: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 8,
    marginVertical: 12,
  },
  logItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  logFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phoneLabel: {
    color: '#2563EB',
    fontSize: 11,
    marginBottom: 4,
  },
  logTotal: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logActions: {
    flexDirection: 'row',
  },
  editBtn: {
    padding: 8,
    marginRight: 8,
  },
  deleteBtn: {
    padding: 8,
  },
  // Edit Invoice panel
  editPanelContainer: {
    width: '100%',
    height: '80%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  editGroup: {
    marginBottom: 16,
  },
  editLabel: {
    color: '#475569',
    fontSize: 13,
    marginBottom: 8,
  },
  payModeRowMini: {
    flexDirection: 'row',
  },
  payModeCardMini: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  payModeCardMiniActive: {
    borderColor: '#2563EB',
    backgroundColor: 'rgba(37,99,235,0.05)',
  },
  payModeTextMini: {
    color: '#475569',
    fontWeight: 'bold',
    fontSize: 12,
  },
  payModeTextMiniActive: {
    color: '#2563EB',
  },
  editItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  editItemName: {
    color: '#1E293B',
    fontSize: 14,
    flex: 1,
  },
  editQtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  editQty: {
    color: '#2563EB',
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  editRowTotal: {
    color: '#1E293B',
    fontWeight: 'bold',
    width: 60,
    textAlign: 'right',
  },
  editPanelFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
  },
  saveEditsBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  saveEditsBtnText: {
    color: '#121212',
    fontWeight: 'bold',
  },
  // Statistics Tab
  statsContainer: {
    padding: 20,
  },
  revenueCard: {
    backgroundColor: '#1E3C72',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#1E3C72',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  revLabel: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  revValue: {
    color: '#1E293B',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 12,
  },
  revSubrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  revSubtext: {
    color: '#1E3C72',
    fontSize: 13,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
    marginRight: 4,
  },
  liveText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: 'bold',
  },
  breakdownTitle: {
    color: '#475569',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 16,
  },
  breakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownLabel: {
    color: '#475569',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 8,
  },
  breakdownValue: {
    color: '#1E293B',
    fontWeight: 'bold',
    fontSize: 14,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    width: '100%',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  percentText: {
    color: '#475569',
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  // Search bar
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#1E293B',
    fontSize: 14,
    height: '100%',
  },
  // Type Filters Row
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  typeFilters: {
    flexDirection: 'row',
  },
  typeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typeFilterChipActive: {
    borderColor: '#2563EB',
    backgroundColor: 'rgba(37,99,235,0.05)',
  },
  typeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  typeFilterLabel: {
    color: '#475569',
    fontSize: 9,
    fontWeight: 'bold',
  },
  typeFilterLabelActive: {
    color: '#2563EB',
  },
  addCustomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderColor: '#2563EB',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addCustomText: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  // Split View Catalog
  catalogSplitContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: '24%',
    backgroundColor: '#F8FAFC',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  sidebarCategoryBtn: {
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sidebarCategoryBtnActive: {
    backgroundColor: '#E0F2FE',
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
  },
  sidebarCategoryLabel: {
    color: '#475569',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sidebarCategoryLabelActive: {
    color: '#2563EB',
  },
  gridContainer: {
    width: '76%',
    backgroundColor: '#F8FAFC',
  },
  gridRowWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  gridList: {
    paddingTop: 8,
    paddingBottom: 80, // space for floating cart bar
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    width: '48%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  productCardActive: {
    borderColor: '#10B981',
    borderWidth: 1.5,
  },
  cardImageWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1.3,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  vegIndicatorWrapper: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(15,23,42,0.4)',
    padding: 3,
    borderRadius: 4,
  },
  vegIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  qtyBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#10B981',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBadgeText: {
    color: '#1E293B',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardInfo: {
    padding: 6,
  },
  cardTagWrapper: {
    backgroundColor: 'rgba(37,99,235,0.1)',
    borderRadius: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginBottom: 4,
  },
  cardTagText: {
    color: '#2563EB',
    fontSize: 7,
    fontWeight: 'bold',
  },
  cardName: {
    color: '#1E293B',
    fontSize: 11,
    fontWeight: 'bold',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  cardPrice: {
    color: '#475569',
    fontSize: 11,
    fontWeight: 'bold',
  },
  addBtnIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37,99,235,0.1)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 0.5,
    borderColor: '#2563EB',
  },
  addBtnText: {
    color: '#2563EB',
    fontSize: 8,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  // Floating Cart
  floatingCartBar: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    height: 54,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingCartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatingCartIconWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 6,
    marginRight: 10,
  },
  floatingCartText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  floatingCartRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatingCartActionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 4,
  },
  // Review Sheet Modal
  reviewSheetContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    width: '100%',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  reviewHeaderTitle: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  reviewBillBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reviewBannerSubLabel: {
    color: '#475569',
    fontSize: 12,
    fontWeight: 'bold',
  },
  reviewBannerSubText: {
    color: '#1E293B',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  reviewBannerGst: {
    color: '#475569',
    fontSize: 12,
    marginBottom: 16,
  },
  reviewPayBtn: {
    backgroundColor: '#10B981',
    width: '100%',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewPayBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 1,
  },
  reviewList: {
    paddingHorizontal: 16,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reviewRowThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 10,
  },
  reviewRowInfo: {
    flex: 1,
  },
  reviewItemName: {
    color: '#1E293B',
    fontWeight: 'bold',
    fontSize: 13,
  },
  reviewItemPrice: {
    color: '#475569',
    fontSize: 11,
    marginTop: 2,
  },
  reviewQtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 2,
    marginRight: 12,
  },
  reviewQtyBtn: {
    padding: 4,
  },
  reviewQtyText: {
    color: '#2563EB',
    fontWeight: 'bold',
    fontSize: 12,
    marginHorizontal: 8,
  },
  reviewRowTotal: {
    color: '#1E293B',
    fontWeight: 'bold',
    fontSize: 13,
    width: 50,
    textAlign: 'right',
  },
  // QR Settings
  qrSettingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qrSettingsText: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: 'bold',
  },
  qrSettingsContainer: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qrSettingsContent: {
    alignItems: 'center',
    marginTop: 10,
  },
  qrSettingsPrompt: {
    color: '#475569',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  uploadedQrWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  uploadedQrPreview: {
    width: 140,
    height: 140,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  uploadedQrStatus: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  removeQrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 8,
  },
  removeQrBtnText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  defaultQrWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  defaultQrStatus: {
    color: '#475569',
    fontSize: 12,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  uploadQrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  uploadQrBtnText: {
    color: '#121212',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  qrImageLarge: {
    width: 180,
    height: 180,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  // Custom Modal Field styles
  modalFieldLabel: {
    color: '#475569',
    fontSize: 12,
    marginBottom: 6,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  suggestionChipsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    width: '100%',
  },
  suggestionChip: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  suggestionChipText: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: 'bold',
  },
  // Settings modal & dynamic catalog CRUD styles
  settingsModalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    width: '100%',
  },
  settingsTabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  settingsTabBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  settingsTabBtnActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563EB',
  },
  settingsTabLabel: {
    color: '#475569',
    fontSize: 13,
    fontWeight: 'bold',
  },
  settingsTabLabelActive: {
    color: '#2563EB',
  },
  menuManageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  menuSectionTitle: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  menuAddBtnText: {
    color: '#121212',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  menuItemThumb: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 10,
  },
  menuItemName: {
    color: '#1E293B',
    fontSize: 13,
    fontWeight: 'bold',
  },
  menuItemCategory: {
    color: '#475569',
    fontSize: 11,
    marginTop: 2,
  },
  menuItemActions: {
    flexDirection: 'row',
  },
  menuEditAction: {
    padding: 6,
    marginRight: 4,
  },
  menuDeleteAction: {
    padding: 6,
  },
  saveMenuProductBtn: {
    backgroundColor: '#2563EB',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    width: '100%',
  },
  saveMenuProductBtnText: {
    color: '#121212',
    fontWeight: 'bold',
    fontSize: 14,
  },
  orderTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    marginBottom: 8,
  },
  orderTypeBtn: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#2563EB',
    borderRadius: 12,
    height: 40,
    backgroundColor: 'transparent',
  },
  orderTypeBtnActive: {
    backgroundColor: '#2563EB',
  },
  orderTypeBtnText: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 13,
  },
  orderTypeBtnTextActive: {
    color: '#FFFFFF',
  },
  // Profile Tab styling
  profileContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  profileAvatarWrapper: {
    marginBottom: 16,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#2563EB',
  },
  profileAvatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  profileNameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginRight: 8,
  },
  profileEditBtn: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  profileSubText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  profileSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  profileSeparator: {
    height: 1,
    backgroundColor: '#E2E8F0',
    width: '100%',
    marginBottom: 16,
  },
  profileInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 12,
  },
  profileInfoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfoLabel: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  profileInfoValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
    maxWidth: '60%',
  },
  profileInfoSeparator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    width: '100%',
  },
  profileEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 8,
    marginVertical: 4,
  },
  profileEditInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#2563EB',
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '600',
  },
  profileEditActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  profileSaveIconBtn: {
    marginRight: 4,
  },
  profileCancelIconBtn: {},
  profileLogoutBtn: {
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  profileLogoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Offline Demo Banner & Empty State
  demoBanner: {
    backgroundColor: '#FEF9C3',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FEF08A',
  },
  demoBannerText: {
    color: '#854D0E',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 64,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 8,
  },
  emptyStateSubText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
  // Period Statistics Grid styling
  sectionTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
    marginTop: 8,
    marginBottom: 12,
    letterSpacing: 1,
  },
  statsPeriodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  statsPeriodCard: {
    flex: 0.485,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  periodCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  periodCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 6,
  },
  periodCardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  periodCardSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  revenueCardSeparator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
    marginVertical: 12,
  },
  yesterdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  yesterdayLabel: {
    color: '#E0F2FE',
    fontSize: 13,
    fontWeight: '500',
  },
  yesterdayValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Calendar & Selector styles
  dateSelectorBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  dateSelectorLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateSelectorValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 2,
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    width: 280,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  calendarMonthYearTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  calendarNavBtn: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  calendarDaysOfWeekRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: 252,
    alignSelf: 'center',
    marginBottom: 6,
  },
  calendarDayOfWeekLabel: {
    width: 32,
    marginHorizontal: 2,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  calendarDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 252,
    alignSelf: 'center',
  },
  calendarDayCell: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    marginHorizontal: 2,
    marginVertical: 2,
  },
  calendarDayCellEmpty: {
    width: 32,
    height: 32,
    marginHorizontal: 2,
    marginVertical: 2,
  },
  calendarDayCellSelected: {
    backgroundColor: '#2563EB',
  },
  calendarDayCellToday: {
    borderWidth: 1.5,
    borderColor: '#2563EB',
  },
  calendarDayText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  calendarDayTextToday: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
  historicalIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(100, 116, 139, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  historicalDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94A3B8',
    marginRight: 4,
  },
  historicalText: {
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Enlarged QR and interactive verification
  qrContainerLarge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 12,
    width: 250,
    height: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  qrImageXLarge: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  upiVerifySection: {
    marginTop: 16,
    alignItems: 'center',
    width: '100%',
  },
  upiVerifyPrompt: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  upiVerifyBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  upiVerifyBtnPaid: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#10B981',
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  upiVerifyBtnNotPaid: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  upiVerifyBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Product Image Picker
  productImagePickerContainer: {
    marginVertical: 8,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    width: '100%',
  },
  productImagePickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    width: '100%',
    height: '100%',
  },
  productImagePickBtnText: {
    color: '#2563EB',
    fontWeight: 'bold',
    fontSize: 15,
  },
  productImagePreviewWrapper: {
    position: 'relative',
    width: 90,
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
  },
  productImagePreview: {
    width: '100%',
    height: '100%',
  },
  productImageRemoveBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 1,
  },
  // Calendar Modal styles
  calendarModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendarModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  calendarModalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  calendarFooterBtnClose: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  calendarFooterBtnCloseText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 14,
  },
  calendarFooterBtnToday: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  calendarFooterBtnTodayText: {
    color: '#2563EB',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
