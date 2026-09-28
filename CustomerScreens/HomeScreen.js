import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, RefreshControl, Modal } from 'react-native';
import * as Icon from 'react-native-feather';
import { colors, radius, spacing, typography, shadows } from '../theme';
import { GlassHeader, Button, IconContainer } from '../components/ui';
import Categories from '../CustomerComponent/categories';
import FeaturedRow from '../CustomerComponent/featuredRow';
import { ordersApi, vendorsApi } from '../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PendingOrders from '../CustomerComponent/PendingOrderIcon';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { categories,markets } from "../constants";
export default function HomeScreen() {
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [customerId, setCustomerId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigation = useNavigation();
  const categoryNames = categories.map(category => category.name);
  const MarketNames = markets.map(MARKET => MARKET.name);

  useEffect(() => {
    fetchCustomerID();
  }, []);

  useEffect(() => {

    if (customerId) {

      fetchPendingOrders();
    }
  }, [customerId]);

  // Fetch customer ID
  const fetchCustomerID = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');

      if (userData) {
        setCustomerId(JSON.parse(userData));
        console.log('user data',JSON.parse(userData))
      }
    } catch (error) {
      console.error('Error fetching customer ID', error);
    }
  };

  // Fetch pending orders
  const fetchPendingOrders = async () => {
    try {
      const orders = await ordersApi.getActiveOrdersForCustomer(customerId.CustomerID);
      setPendingOrdersCount(orders ? orders.length : 0);
    } catch (error) {
        console.log('No orders Fetched');
        setPendingOrdersCount(0)

    }
  };

  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetchVendors();
  }, []);

  // Fetch vendors
  const fetchVendors = async () => {
    try {
      const data = await vendorsApi.getVendors();
      setVendors(data);
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (customerId) {
        await fetchPendingOrders();
      }
      await fetchVendors(); // Fetch vendors again on refresh
    } finally {
      setRefreshing(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filteredVendors = vendors;

    if (selectedMarket) {
      filteredVendors = filteredVendors.filter(vendor => vendor.Market === selectedMarket);
    }

    if (selectedCategory) {
      filteredVendors = filteredVendors.filter(vendor => vendor.ShopCategory === selectedCategory);
    }

    setVendors(filteredVendors);
    setModalVisible(false);
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedMarket('');
    setSelectedCategory('');
    fetchVendors();
    setModalVisible(false);
  };

  // Group vendors by ShopCategory
  const groupedVendors = vendors.reduce((acc, vendor) => {
    (acc[vendor.ShopCategory] = acc[vendor.ShopCategory] || []).push(vendor);
    return acc;
  }, {});

  return (
    <View style={styles.screen}>
      <GlassHeader
        title="ShopRadar"
        showBack={false}
        bottomSlot={
          <View style={styles.searchRow}>
            <TouchableOpacity style={styles.searchPill} onPress={() => navigation.navigate('SearchScreen')}>
              <Icon.Search height={20} width={20} stroke={colors.textGray} />
              <Text style={[typography.bodySm, styles.searchPlaceholder]}>Search</Text>
              <View style={styles.marketBadge}>
                <Icon.MapPin height={16} width={16} stroke={colors.textGray} />
                <Text style={[typography.label, styles.marketText]}>
                  {selectedMarket && selectedMarket.length > 8
                    ? `${selectedMarket.substring(0, 8)}...`
                    : selectedMarket || 'All Lahore'}
                </Text>
              </View>
            </TouchableOpacity>
            <IconContainer variant="header" onPress={() => setModalVisible(true)} style={styles.filterButton}>
              <Icon.Sliders height={20} width={20} strokeWidth={2.5} stroke={colors.textPrimary} />
            </IconContainer>
          </View>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <Categories />
        <View style={styles.rowsSection}>
          {Object.keys(groupedVendors).map((category, index) => (
            <FeaturedRow
              key={index}
              title={category}
              restaurants={groupedVendors[category]}
              description={`Discover the best ${category} places`}
            />
          ))}
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[typography.headerTitle, styles.modalTitle]}>Filters</Text>

            <Text style={[typography.label, styles.label]}>Market</Text>
            <RNPickerSelect
              onValueChange={(value) => setSelectedMarket(value)}
              items={MarketNames.map((market) => ({ label: market, value: market }))}
              value={selectedMarket}
              style={pickerSelectStyles}
            />

            <Text style={[typography.label, styles.label]}>Category</Text>
            <RNPickerSelect
              onValueChange={(value) => setSelectedCategory(value)}
              items={categoryNames.map((category) => ({ label: category, value: category }))}
              value={selectedCategory}
              style={pickerSelectStyles}
            />

            <View style={styles.buttonsRow}>
              <Button variant="secondary" title="Clear Filters" onPress={clearFilters} style={styles.filterActionButton} />
              <Button title="Apply Filters" onPress={applyFilters} style={styles.filterActionButton} />
            </View>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={[typography.bodySm, styles.closeButton]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
       {/* Pending Orders fixed at the bottom */}
       {pendingOrdersCount > 0 && (

          <PendingOrders pendingOrdersCount={pendingOrdersCount} />

      )}

    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: spacing.headerHeight + spacing.space8 + spacing.space6,
    paddingBottom: 100,
  },
  rowsSection: {
    marginTop: spacing.space5,
    marginBottom: spacing.space5,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchPill: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.space3,
    paddingHorizontal: spacing.space4,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  searchPlaceholder: {
    marginLeft: spacing.space2,
    flex: 1,
    color: colors.textGray,
  },
  marketBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.space2,
    borderLeftWidth: 1,
    borderLeftColor: colors.backgroundFaf,
  },
  marketText: {
    color: colors.textGray,
    marginLeft: spacing.space1,
  },
  filterButton: {
    marginLeft: spacing.space2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: spacing.space5,
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: spacing.space6,
    borderRadius: radius.xl,
    width: '100%',
    ...shadows.modal,
  },
  modalTitle: {
    marginBottom: spacing.space5,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  label: {
    color: colors.textGray,
    marginBottom: spacing.space2,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: spacing.space3,
    marginTop: spacing.space4,
  },
  filterActionButton: {
    flex: 1,
  },
  closeButton: {
    textAlign: 'center',
    color: colors.primary,
    marginTop: spacing.space5,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: spacing.space3,
    paddingHorizontal: spacing.space4,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: radius.pill,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundFaf,
    paddingRight: 30,
    marginBottom: spacing.space4,
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: spacing.space4,
    paddingVertical: spacing.space2,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: radius.pill,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundFaf,
    paddingRight: 30,
    marginBottom: spacing.space4,
  },
});
