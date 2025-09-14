import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, ScrollView, RefreshControl } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import network from '../network';

export default function RiderVanNav() {
  const navigation = useNavigation();
  const route = useRoute();
  const { OrderID } = route.params;
  const [vendor, setVendor] = useState(null);
  const [AcceptedOrder, setAcceptedOrder] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchVendorDetails();
  }, []);

  const fetchVendorDetails = async () => {
    try {
      const response = await axios.get(network.serverurl + "/orders/" + OrderID);
      setAcceptedOrder(response.data);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    }

   
  };

  useEffect(()=>{
    const fetchOrderDetail = async () => {
      if (AcceptedOrder) {
        try {
          const res = await axios.get(network.serverurl + "/vendor/" + AcceptedOrder.VendorID);
          setVendor(res.data);
          console.log(res.data);
        } catch (error) {
          console.error('Failed to fetch vendor details:', error);
        }
      }
      
    }

    fetchOrderDetail();
  },[AcceptedOrder])
  const onRefresh = () => {
    setRefreshing(true);
    fetchVendorDetails().finally(() => setRefreshing(false));
  };

  const handleNavigate = () => {
    if (vendor) {
      const url = `http://maps.google.com/?q=${vendor.Latitude},${vendor.Longitude}`;
      Linking.openURL(url);
    }
  };

  const handleArrivedAtVendor = async () => {
    try {
      const response = await fetch(`${network.serverurl}/orders/${OrderID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ OrderStatus: 'AtVendor' ,RiderID: 1 }),
        
      },
    );
    if(response){
      console.log(response)
      navigation.navigate('OrderPickUp', { OrderID });
     
    }
   
    } catch (error) {
      console.error(error);
    }
    
  };

  

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {vendor ? (
        <>
          <Text style={styles.vendorName}>{vendor.BusinessName}</Text>
          <Text style={styles.vendorContact}>Contact: {vendor.Contact}</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: vendor.Latitude,
              longitude: vendor.Longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{ latitude: vendor.Latitude, longitude: vendor.Longitude }}
              title={vendor.BusinessName}
              description={vendor.CompanyAddress}
            />
          </MapView>
          <TouchableOpacity style={styles.button} onPress={handleNavigate}>
            <Text style={styles.buttonText}>Navigate to Vendor</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.arrivedButton]} onPress={handleArrivedAtVendor}>
            <Text style={styles.buttonText}>Arrived at Vendor</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>Loading vendor details...</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  vendorName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  vendorContact: {
    fontSize: 16,
    marginBottom: 16,
  },
  map: {
    height: 400,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  arrivedButton: {
    backgroundColor: '#28A745',
  },
});
