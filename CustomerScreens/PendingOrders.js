import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet,  Linking,TouchableOpacity, RefreshControl} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import network from '../network';
import * as Icon from "react-native-feather";
import { themeColors } from '../theme';

import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const InProgressOrders = () => {
  const [orders, setOrders] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

   const navigation = useNavigation()
   const sortedOrders = [...orders].sort((a, b) => b.OrderID - a.OrderID);

  useEffect(() => {
    fetchCustomerID();
  }, []);

  useEffect(() => {
    if (customerId) {
      fetchOrders(customerId);
    }
  }, [customerId]);

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

  const fetchOrders = async (customerID) => {
    try {
      const response = await axios.get(`${network.serverurl}/orders/customer/${customerId}`);
      if(response.data.length  > 0){
        setOrders(response.data);
      }else{
        setOrders([])
      }
      
    } catch (error) {
      console.log('No Orders Found', error);
      setOrders([])
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

  const handleNavigate = (props) => {
    
    if (props && props.Vendor.Latitude && props.Vendor.Longitude) {
      const url = `http://maps.google.com/?q=${props.Vendor.Latitude},${props.Vendor.Longitude}`;
      Linking.openURL(url);
    }
  };

  const renderOrderItem = ({ item }) => {
    const { OrderID, Vendor, OrderDate, isDelivered, Ratings, OrderStatus,VendorID } = item;


    return (
      <TouchableOpacity onPress={() => navigation.navigate('Delivery', { ...item })}>
        <View style={styles.orderItem}>
        <Image 
          source={{ uri: Vendor.Image }} // Replace with actual image URL
          style={styles.vendorImage} 
        //  resizeMode="cover" 
        />
        <Text style={styles.businessName}>{Vendor.BusinessName}</Text>
        <Text style={styles.orderID}>Order ID: {OrderID}</Text>
        <Text style={styles.orderDate}>Order Date: {new Date(OrderDate).toLocaleDateString()}</Text>
        <Text style={styles.orderStatus}>Status: {
        OrderStatus == 'accepted'? 'Rider Assigned' : 
        OrderStatus == 'AtVendor'? 'Your Rider At Vendor Location' :
        OrderStatus == 'PickedUp'? 'Rider Picked Up Parcel and Arriving Soon' :
        OrderStatus
        }</Text>

        {
          OrderStatus == 'PickUp'?
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={{textAlignVertical:'center',marginLeft:20,fontSize:15,fontWeight:'700'}}>Self Pickup Order</Text>
              <TouchableOpacity 
                 onPress={()=>handleNavigate(item)} 
                style={{ 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  marginRight:15,
                  padding: 10, // Adjust padding as needed
                  backgroundColor: 'transparent' // Make the button background transparent or adjust as needed
                }}
              >
                <Icon.MapPin width={30} height={30} stroke ='orange' />
                {/* The 'MapPin' icon from Feather. You can adjust size and color */}
              </TouchableOpacity>
          </View>
          :null
        }
        
       
      </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <View style={{position: 'absolute', marginLeft:20,   width: '100%',zIndex: 50,}}>
      <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backbutton}
          >
            <Icon.ArrowLeft strokeWidth={3} stroke={themeColors.bgColor(1)} />
          </TouchableOpacity>
      </View>
      <FlatList
      data={sortedOrders}
      renderItem={renderOrderItem}
      keyExtractor={item => item.OrderID.toString()}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    />
    </View>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    padding: 5,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginHorizontal:5
  },
  vendorImage: {
    width: "100%",
    height: 100,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginBottom: 2,
    alignSelf: 'center',
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
  },
  orderDate: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  orderStatus: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    marginBottom: 5,
  },
  ratedText: {
    fontSize: 14,
    color: '#28a745',
  },
  backbutton: {
    position: 'absolute',
    top: 30,
    left: 10,
    padding: 8,
    backgroundColor: '#F9FAFB',
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
});

export default InProgressOrders;
