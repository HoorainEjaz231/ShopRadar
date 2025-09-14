import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Linking, ScrollView, RefreshControl } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import network from '../network';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NavToCust() {
  const navigation = useNavigation();
  const route = useRoute();
  const { OrderID } = route.params;
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);

  

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(network.serverurl + "/orders/" + OrderID);
        console.log(response.data);
        setOrder(response.data);
      } catch (error) {
        console.error('Failed to fetch order details:', error);
      }
    };
    fetchOrderDetails();
  }, [OrderID]);
  
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (order) {
        try {
          const customerResponse = await axios.get(network.serverurl + `/Customer/${order.CustomerID}`);
          console.log(customerResponse.data);
          setCustomer(customerResponse.data);
        } catch (error) {
          console.error('Failed to fetch customer details:', error);
        }
      }
    };
  
    fetchCustomerDetails();
  }, [order]); // This useEffect runs only when the `order` state changes
  

 

  const handleNavigate = () => {
    
    if (order && order.CustLatitude && order.CustLongitude) {
      const url = `http://maps.google.com/?q=${order.CustLatitude},${order.CustLongitude}`;
      Linking.openURL(url);
    }
  };

  const handleMarkAsDelivered = async () => {
    try {
      console.log('OrderID',OrderID)
      const response = await axios.put(`${network.serverurl}/orders/${OrderID}`, {
        OrderStatus: 'Delivered',
        isDelivered: true
      });
      if(response.data){
        try{
          console.log('RiderID',order.RiderID)
        await fetch(`${network.serverurl}/Rider/Update/${order.RiderID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ AssignedOrder: null, IsAvailable: true }),
        });
        navigation.navigate('RiderHome');
        }catch(error){
          console.log('Rider error',error)
        }
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  if (!order) {
    return (
      <View style={styles.container}>
        <Text>Loading order details...</Text>
      </View>
    );
  }
  if (!customer) {
    return (
      <ScrollView
      contentContainerStyle={styles.container}
     
      >
        <View style={styles.container}>
          <Text>Loading customer details...</Text>
        </View>
      </ScrollView>
      
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
     
    >
      <Text style={styles.customerName}>Customer: {customer.FullName}</Text>
      <Text style={styles.customerContact}>Contact: {customer.Phone}</Text>
      <Text style={styles.deliveryAddress}>Delivery Address: {customer.Address}</Text>
      <MapView
            style={styles.map}
            initialRegion={{
              latitude: order.CustLatitude,
              longitude: order.CustLongitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{ latitude: order.CustLatitude, longitude: order.CustLongitude }}
              title={customer.FullName}
              description={customer.Address}
            />
          </MapView>
      <Button title="Navigate to Customer" onPress={handleNavigate} /> 
      <Button title="Mark as Delivered" onPress={handleMarkAsDelivered} style={styles.deliveredButton} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  customerName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  customerContact: {
    fontSize: 16,
    marginBottom: 8,
  },
  deliveryAddress: {
    fontSize: 16,
    marginBottom: 16,
  },
  map: {
    height: 400,
    marginBottom: 16,
    
  },
  deliveredButton: {
    marginTop: 16,
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
});
