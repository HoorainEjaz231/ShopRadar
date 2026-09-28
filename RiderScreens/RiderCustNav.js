import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Linking, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ordersApi, customersApi, ridersApi } from '../lib/api';
import { colors, radius, spacing, typography } from '../theme';
import { Button } from '../components/ui';

export default function NavToCust() {
  const navigation = useNavigation();
  const route = useRoute();
  const { OrderID } = route.params;
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);



  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await ordersApi.getOrderById(OrderID);
        console.log(data);
        setOrder(data);
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
          const data = await customersApi.getCustomerById(order.CustomerID);
          console.log(data);
          setCustomer(data);
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
      const data = await ordersApi.updateOrder(OrderID, {
        OrderStatus: 'Delivered',
        isDelivered: true
      });
      if(data){
        try{
          console.log('RiderID',order.RiderID)
          await ridersApi.updateRider(order.RiderID, { AssignedOrder: null, IsAvailable: true });
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
        <Text style={typography.body}>Loading order details...</Text>
      </View>
    );
  }
  if (!customer) {
    return (
      <ScrollView
      contentContainerStyle={styles.container}

      >
        <View style={styles.container}>
          <Text style={typography.body}>Loading customer details...</Text>
        </View>
      </ScrollView>

    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}

    >
      <Text style={[typography.display, styles.customerName]}>Customer: {customer.FullName}</Text>
      <Text style={[typography.body, styles.customerContact]}>Contact: {customer.Phone}</Text>
      <Text style={[typography.body, styles.deliveryAddress]}>Delivery Address: {customer.Address}</Text>
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
      <Button variant="secondary" title="Navigate to Customer" onPress={handleNavigate} style={styles.navigateButton} />
      <Button title="Mark as Delivered" onPress={handleMarkAsDelivered} style={styles.deliveredButton} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    padding: spacing.space5,
    paddingTop: spacing.space8,
    backgroundColor: colors.background,
  },
  customerName: {
    marginBottom: spacing.space2,
    color: colors.textPrimary,
  },
  customerContact: {
    marginBottom: spacing.space2,
    color: colors.textPrimary,
  },
  deliveryAddress: {
    marginBottom: spacing.space4,
    color: colors.textPrimary,
  },
  map: {
    height: 400,
    marginBottom: spacing.space4,
    borderRadius: radius.lg,
  },
  navigateButton: {
    marginBottom: spacing.space3,
  },
  deliveredButton: {
    marginTop: spacing.space1,
  },
});
