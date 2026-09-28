import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Linking, ScrollView, RefreshControl } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ordersApi, vendorsApi } from '../lib/api';
import { colors, radius, spacing, typography } from '../theme';
import { Button } from '../components/ui';

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
      const data = await ordersApi.getOrderById(OrderID);
      setAcceptedOrder(data);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    }


  };

  useEffect(()=>{
    const fetchOrderDetail = async () => {
      if (AcceptedOrder) {
        try {
          const data = await vendorsApi.getVendorById(AcceptedOrder.VendorID);
          setVendor(data);
          console.log(data);
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
      const data = await ordersApi.updateOrder(OrderID, { OrderStatus: 'AtVendor' });
      if(data){
        console.log(data)
        navigation.navigate('OrderPickUp', { OrderID });
      }
    } catch (error) {
      console.error(error);
    }

  };



  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {vendor ? (
        <>
          <Text style={[typography.display, styles.vendorName]}>{vendor.BusinessName}</Text>
          <Text style={[typography.body, styles.vendorContact]}>Contact: {vendor.Contact}</Text>
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
          <Button variant="secondary" title="Navigate to Vendor" onPress={handleNavigate} style={styles.navigateButton} />
          <Button title="Arrived at Vendor" onPress={handleArrivedAtVendor} style={styles.arrivedButton} />
        </>
      ) : (
        <Text style={typography.body}>Loading vendor details...</Text>
      )}
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
  vendorName: {
    marginBottom: spacing.space2,
    color: colors.textPrimary,
  },
  vendorContact: {
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
  arrivedButton: {},
});
