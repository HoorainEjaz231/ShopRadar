import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, View, TextInput, ScrollView, Text, StyleSheet, TouchableOpacity, RefreshControl, Modal, Button } from 'react-native';
import * as Icon from 'react-native-feather';
import { themeColors } from '../theme';
import Categories from '../CustomerComponent/categories';
import FeaturedRow from '../CustomerComponent/featuredRow';
import axios from 'axios';
import network from "../network";
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
    
        
      const response = await axios.get(`${network.serverurl}/orders/customer/${customerId.CustomerID}`);
      if(response.data){
        setPendingOrdersCount(response.data.length);
        console.log(response.data)
      }else{
        setPendingOrdersCount(0)
        
      }
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
      const response = await axios.get(network.serverurl + "/vendor/vendors");
      setVendors(response.data);
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
    <SafeAreaView style={{ backgroundColor: 'white' ,flex: 1 }}>
       <StatusBar
        barStyle="dark-content" // Change to 'light-content' if you want light text
        backgroundColor={themeColors.bgColor(1)} // Set the background color if needed
      />
      
      <View style={stylehome.container}>
        <TouchableOpacity style={stylehome.style1} onPress={() => navigation.navigate('SearchScreen')}>
          <View style={{ flexDirection: 'row', flex: 1, }}>
            <Icon.Search height="24" width="24" stroke="grey" />
            <Text style={{ marginLeft: 8, flex: 1, textAlignVertical: 'center', color: 'gray' }}>Search</Text>
            <View style={stylehome.style2}>
              <Icon.MapPin height="20" width="20" stroke="gray" />
              <Text style={{ color: '#718096' }}>
                {selectedMarket && selectedMarket.length > 8 
                  ? `${selectedMarket.substring(0, 8)}...` 
               : selectedMarket || 'All Lahore'}
               </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={{ backgroundColor: themeColors.bgColor(1), padding: 12, borderRadius: 9999, marginLeft: 5 }}>
            <Icon.Sliders height="20" width="20" strokeWidth={2.5} stroke="white" />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }} // Adjusted paddingBottom to ensure space for the fixed element
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <Categories />
        <View style={{ marginTop: 20, marginBottom: 20 }}>
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

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
       {/* Pending Orders fixed at the bottom */}
       {pendingOrdersCount > 0 && (
        
          <PendingOrders pendingOrdersCount={pendingOrdersCount} />
       
      )}
     
    </SafeAreaView>
  );
}

const stylehome = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 5,
    paddingBottom: 8,
    marginRight: 5,
    marginTop: 10
  },
  style1: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  style2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 0,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#D1D5DB',
  },
});

const styles = StyleSheet.create({
  pendingOrdersContainer: {
    position: 'absolute',

    bottom: 0, // Adjust this value as needed
    left: 0,
    right: 0,
    alignItems: 'center',
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