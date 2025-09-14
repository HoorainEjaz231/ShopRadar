import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import network from '../network';
import * as Icon from "react-native-feather"; 
import { themeColors } from '../theme';
import StarRating from 'react-native-star-rating-widget';
import { Button } from 'react-native-elements';

import { useNavigation } from '@react-navigation/native';

const OrderScreen = () => {
  const [orders, setOrders] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [rating, setRating] = useState(0);
  const sortedOrders = [...orders].sort((a, b) => b.OrderID - a.OrderID);
const navigation = useNavigation();
  useEffect(() => {
    const fetchCustomerID = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          setCustomerId(JSON.parse(user).CustomerID);
        }
      } catch (error) {
        console.error('Error fetching customer ID', error);
      }
    };
    fetchCustomerID();
  }, []);

  useEffect(() => {
    if (customerId) {
      fetchOrders(customerId);
    }
  }, [customerId]);

  const fetchOrders = async (customerID) => {
    try {
      const response = await axios.get(`${network.serverurl}/orders/customer-orders/${customerID}`);
      setOrders(response.data);
    } catch (error) {
      console.log('Error fetching orders', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchOrders(customerId);
    } finally {
      setRefreshing(false);
    }
  };

  const submitRating = async (orderID, rating,VendorID) => {
    console.log(VendorID)
    try {
      await axios.post(`${network.serverurl}/ratings/`, {
        CustomerID: customerId,
        VendorID: VendorID,
        OrderID: orderID,
        Rating: rating
      });
      fetchOrders(customerId);
    } catch (error) {
      console.error('Error submitting rating', error);
    }
  };

  const renderOrderItem = ({ item }) => {
    const { OrderID, Vendor, OrderDate, isDelivered, Ratings, OrderStatus,VendorID } = item;
    const orderRated = Ratings.length > 0;

    return (
      <View style={styles.orderItem}>
        
        <Image 
          source={{ uri: Vendor.Image }} // Replace with actual image URL
          style={styles.vendorImage} 
          resizeMode="cover" 
        />
        <Text style={styles.businessName}>{Vendor.BusinessName}</Text>
        <Text style={styles.orderID}>Order ID: {OrderID}</Text>
        <Text style={styles.orderDate}>Order Date: {new Date(OrderDate).toLocaleDateString()}</Text>
        <Text style={[styles.orderStatus,{color: OrderStatus == 'Cancelled'?'red':null}]}>Status: {OrderStatus}</Text>
        {OrderStatus === 'Delivered' && !orderRated ? (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>Tap to rate:</Text>
           
            <StarRating
        rating={rating}
        onChange={setRating}
      />
            <Button title={'Submit'} onPress={()=>submitRating(OrderID,rating,VendorID)}/>
          </View>
        ) : orderRated ? (
          <Text style={styles.ratedText}>Rated: {Ratings[0].Rating} stars</Text>
        ) : null}
      </View>
    );
  };

  return (
   <View style={{flex:1}}>
   
   <FlatList
  data={sortedOrders}
  renderItem={renderOrderItem}
  keyExtractor={item => item.OrderID.toString()}
  contentContainerStyle={[styles.flatListContent]}
  showsVerticalScrollIndicator={false}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  }
/>

      <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.container}
          >
            <Icon.ArrowLeft strokeWidth={3} stroke={themeColors.bgColor(1)} />
          </TouchableOpacity>
   </View>
  );
};

const styles = StyleSheet.create({
  orderItem: {
   
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginHorizontal:7
  },
  vendorImage: {
    width: 'auto',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
   // alignSelf: 'center',
  },
  businessName: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  orderID: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    marginLeft:15
  },
  orderDate: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    marginLeft:15
  },
  orderStatus: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
    marginLeft:15
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom:10
  },
  ratingText: {
    fontSize: 14,
    marginBottom: 5,
  },
  ratedText: {
    fontSize: 14,
    color: '#28a745',
    marginBottom:5,
    marginLeft:15
  },
  container: {
    position: 'absolute',
    top: 20,
    left: 16,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 9999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContainer: {
    padding: 16,
     // Padding around the button for visibility
  },
  flatListContent: {
    marginTop: 10, // Adjust the margin as needed
    paddingBottom:30
  },
});

export default OrderScreen;
