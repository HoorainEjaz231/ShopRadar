import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Linking, TouchableOpacity, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ordersApi } from '../lib/api';
import * as Icon from "react-native-feather";
import { colors, radius, spacing, typography, shadows } from '../theme';
import { GlassHeader, Card, IconContainer } from '../components/ui';
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
      const data = await ordersApi.getActiveOrdersForCustomer(customerID);
      setOrders(data && data.length > 0 ? data : []);
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
        <Card style={styles.orderItem} contentStyle={styles.orderItemContent}>
        <Image
          source={{ uri: Vendor.Image }} // Replace with actual image URL
          style={styles.vendorImage}
        //  resizeMode="cover"
        />
        <Text style={[typography.cardTitle, styles.businessName]}>{Vendor.BusinessName}</Text>
        <Text style={[typography.bodySm, styles.orderID]}>Order ID: {OrderID}</Text>
        <Text style={[typography.bodySm, styles.orderDate]}>Order Date: {new Date(OrderDate).toLocaleDateString()}</Text>
        <Text style={[typography.bodySm, styles.orderStatus]}>Status: {
        OrderStatus == 'accepted'? 'Rider Assigned' :
        OrderStatus == 'AtVendor'? 'Your Rider At Vendor Location' :
        OrderStatus == 'PickedUp'? 'Rider Picked Up Parcel and Arriving Soon' :
        OrderStatus
        }</Text>

        {
          OrderStatus == 'PickUp'?
          <View style={styles.pickupRow}>
            <Text style={[typography.chipSelected, styles.pickupText]}>Self Pickup Order</Text>
              <IconContainer variant="drilldown" onPress={()=>handleNavigate(item)} style={styles.pickupPinButton}>
                <Icon.MapPin width={18} height={18} stroke={colors.warning} />
              </IconContainer>
          </View>
          :null
        }


      </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <GlassHeader title="In Progress Orders" />
      <FlatList
      data={sortedOrders}
      renderItem={renderOrderItem}
      keyExtractor={item => item.OrderID.toString()}
      contentContainerStyle={styles.listContent}
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
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingTop: spacing.headerHeight + spacing.space8,
    paddingBottom: spacing.space6,
  },
  orderItem: {
    marginBottom: spacing.space4,
    marginHorizontal: spacing.space3,
    padding: 0,
    overflow: 'hidden',
  },
  orderItemContent: {
    padding: spacing.space2,
  },
  vendorImage: {
    width: "100%",
    height: 100,
    borderTopRightRadius: radius.lg,
    borderTopLeftRadius: radius.lg,
    marginBottom: spacing.space1,
  },
  businessName: {
    textAlign: 'center',
    marginBottom: spacing.space1,
    color: colors.textPrimary,
  },
  orderID: {
    color: colors.textGray,
    marginBottom: spacing.space1,
  },
  orderDate: {
    color: colors.textGray,
    marginBottom: spacing.space1,
  },
  orderStatus: {
    color: colors.textLight,
    marginBottom: spacing.space3,
  },
  pickupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.space3,
    paddingBottom: spacing.space2,
  },
  pickupText: {
    color: colors.textPrimary,
  },
  pickupPinButton: {},
});

export default InProgressOrders;
