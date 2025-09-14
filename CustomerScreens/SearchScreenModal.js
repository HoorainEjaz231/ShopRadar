import React, { useState } from 'react';
import { SafeAreaView, View, TextInput, ScrollView, Text, Modal,Image, Button, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import * as Icon from 'react-native-feather';
import axios from 'axios';
import network from "../network";
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { categories,markets } from "../constants";

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
        const response = await axios.get(`${network.serverurl}/Product/SearchProducts/`, {
          params: {
            searchText,
            category: selectedCategory,
            market: selectedMarket
          }
        });
        setVendors(response.data);
        
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
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Icon.Search height="24" width="24" stroke="grey" />
          <TextInput
            placeholder="Search products"
            style={styles.searchInput}
            value={searchText}
            onChangeText={text =>fetchFilteredProducts(text)}  
            // onSubmitEditing={fetchFilteredProducts}
          />
          <TouchableOpacity style={styles.marketContainer} onPress={openFilterModal}>
            
            <Icon.MapPin height="20" width="20" stroke="gray" />
            <Text style={{ color: '#718096' }}>
               {selectedMarket && selectedMarket.length > 8 
                  ? `${selectedMarket.substring(0, 8)}...` 
               : selectedMarket || 'All Lahore'}
            </Text>
            
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={openFilterModal}
        >
          <Icon.Sliders height="20" width="20" strokeWidth={2.5} stroke="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {vendors.length > 0 ? (
          vendors.map((vendor) => (
            <TouchableWithoutFeedback key={vendor.ProductID} onPress={() => navigation.navigate('ShopScreen', { vendor })}>
              <View style={styles.vendorContainer}>
                <View style={styles.imagePlaceholder}>
                  {vendor.Image ? <Image source={{ uri: vendor.Image }} style={styles.productImage} /> : <Text style={{ textAlign: 'center' }}>No Image</Text>}
                </View>
                <View style={styles.vendorInfo}>
                  <Text style={styles.vendorName}>{vendor.ProductName}</Text>
                  <Text style={styles.vendorCategory}>{vendor.ProductCategory}</Text>
                  <Text style={styles.vendorCategory}>{vendor.Vendor.Market}</Text>
                  <Text style={styles.vendorPrice}>RS {vendor.Price}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          ))
        ) : (
          <Text style={styles.noResults}>No products found</Text>
        )}
      </ScrollView>

      <Modal visible={filterModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filters</Text>

            <Text style={styles.label}>Market</Text>
            <RNPickerSelect
              onValueChange={(value) => setSelectedMarket(value)}
              items={MarketNames.map((market) => ({ label: market, value: market }))}
              value={selectedMarket}
              style={pickerSelectStyles}
            />

            <Text style={styles.label}>Category</Text>
            <RNPickerSelect
              onValueChange={(value) => setSelectedCategory(value)}
              items={categoryNames.map((category) => ({ label: category, value: category }))}
              value={selectedCategory}
              style={pickerSelectStyles}
            />

            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.button} onPress={applyFilters}>
                <Text style={styles.buttonText}>Apply Filters</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearFilters}>
                <Text style={[styles.buttonText, { color: 'red' }]}>Clear Filters</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 5,
    paddingBottom: 8,
    marginRight: 8,
    marginTop: 10
  },
  searchContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
  },
  marketContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 0,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#D1D5DB',
    
  },
  filterButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 9999,
    marginLeft: 5
  },
  vendorContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    marginRight: 15,
  },
  vendorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  vendorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  vendorCategory: {
    color: '#6B7280',
    marginTop: 4,
  },
  vendorPrice: {
    color: '#10B981',
    marginTop: 4,
    fontWeight: 'bold',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    color: '#6B7280',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  clearButton: {
    backgroundColor: 'transparent',
    borderColor: 'red',
    borderWidth: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    textAlign: 'center',
    color: '#007BFF',
    fontSize: 16,
    marginTop: 20,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 20,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 20,
  },
});