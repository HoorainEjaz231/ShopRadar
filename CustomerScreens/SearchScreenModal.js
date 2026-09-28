import React, { useState } from 'react';
import { View, TextInput, ScrollView, Text, Modal,Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import * as Icon from 'react-native-feather';
import { productsApi } from '../lib/api';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { categories,markets } from "../constants";
import { colors, radius, spacing, typography, shadows } from '../theme';
import { GlassHeader, Button, IconContainer } from '../components/ui';

export default function SearchFilterScreen() {
  const [vendors, setVendors] = useState([]);
  const [searchText, setSearchText] = useState(null);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const categoryNames = categories.map(category => category.name);
  const MarketNames = markets.map(MARKET => MARKET.name);
  const navigation = useNavigation();

  const fetchFilteredProducts = async (text) => {
    setSearchText(text)
    if(searchText){
      try {
        const data = await productsApi.searchProducts({
          searchText,
          category: selectedCategory,
          market: selectedMarket,
        });
        setVendors(data);
      } catch (error) {
        console.log('Error fetching filtered products', error);
      }
    }
  };
  const clearFilters = () => {
    setSelectedMarket('');
    setSelectedCategory('');
    setFilterModalVisible(false);
  };

  const openFilterModal = () => {
    setFilterModalVisible(true);
  };

  const applyFilters = () => {
    setFilterModalVisible(false);
    fetchFilteredProducts();
  };

  return (
    <View style={styles.screen}>
      <GlassHeader
        title="Search"
        bottomSlot={
          <View style={styles.searchRow}>
            <View style={styles.searchPill}>
              <Icon.Search height={20} width={20} stroke={colors.textGray} />
              <TextInput
                placeholder="Search products"
                placeholderTextColor={colors.textGray}
                style={[typography.bodySm, styles.searchInput]}
                value={searchText}
                onChangeText={text =>fetchFilteredProducts(text)}
              />
              <TouchableOpacity style={styles.marketBadge} onPress={openFilterModal}>
                <Icon.MapPin height={16} width={16} stroke={colors.textGray} />
                <Text style={[typography.label, styles.marketText]}>
                   {selectedMarket && selectedMarket.length > 8
                      ? `${selectedMarket.substring(0, 8)}...`
                   : selectedMarket || 'All Lahore'}
                </Text>
              </TouchableOpacity>
            </View>
            <IconContainer variant="header" onPress={openFilterModal} style={styles.filterButton}>
              <Icon.Sliders height={20} width={20} strokeWidth={2.5} stroke={colors.textPrimary} />
            </IconContainer>
          </View>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {vendors.length > 0 ? (
          vendors.map((vendor) => (
            <TouchableWithoutFeedback key={vendor.ProductID} onPress={() => navigation.navigate('ShopScreen', { vendor })}>
              <View style={styles.vendorContainer}>
                <View style={styles.imagePlaceholder}>
                  {vendor.Image ? <Image source={{ uri: vendor.Image }} style={styles.productImage} /> : <Text style={typography.caption}>No Image</Text>}
                </View>
                <View style={styles.vendorInfo}>
                  <Text style={[typography.cardTitle, styles.vendorName]}>{vendor.ProductName}</Text>
                  <Text style={[typography.bodySm, styles.vendorCategory]}>{vendor.ProductCategory}</Text>
                  <Text style={[typography.bodySm, styles.vendorCategory]}>{vendor.Vendor.Market}</Text>
                  <Text style={[typography.cardTitle, styles.vendorPrice]}>RS {vendor.Price}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          ))
        ) : (
          <Text style={[typography.bodySm, styles.noResults]}>No products found</Text>
        )}
      </ScrollView>

      <Modal visible={filterModalVisible} animationType="slide" transparent={true}>
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

            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <Text style={[typography.bodySm, styles.closeButton]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  listContent: {
    paddingTop: spacing.headerHeight + spacing.space8 + spacing.space6,
    paddingBottom: spacing.space6,
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
  searchInput: {
    marginLeft: spacing.space2,
    flex: 1,
    color: colors.textPrimary,
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
  vendorContainer: {
    flexDirection: 'row',
    padding: spacing.space4,
    backgroundColor: colors.backgroundFaf,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: radius.lg,
    marginBottom: spacing.space3,
    marginHorizontal: spacing.space3,
    ...shadows.card,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    marginRight: spacing.space4,
  },
  vendorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  vendorName: {
    color: colors.textPrimary,
  },
  vendorCategory: {
    color: colors.textGray,
    marginTop: spacing.space1,
  },
  vendorPrice: {
    color: colors.success,
    marginTop: spacing.space1,
  },
  noResults: {
    textAlign: 'center',
    marginTop: spacing.space5,
    color: colors.textGray,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
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
