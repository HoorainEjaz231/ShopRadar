import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ordersApi, ratingsApi } from '../lib/api';
import { colors, radius, spacing, typography, shadows } from '../theme';
import { GlassHeader, Card, Button } from '../components/ui';
import StarRating from 'react-native-star-rating-widget';

const OrderScreen = () => {
  const [orders, setOrders] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [rating, setRating] = useState(0);
  const sortedOrders = [...orders].sort((a, b) => b.OrderID - a.OrderID);
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
      const data = await ordersApi.getOrderHistoryForCustomer(customerID);
      setOrders(data);
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
      await ratingsApi.createRating({
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
      <Card style={styles.orderItem}>

        <Image
          source={{ uri: Vendor.Image }} // Replace with actual image URL
          style={styles.vendorImage}
          resizeMode="cover"
        />
        <Text style={[typography.cardTitle, styles.businessName]}>{Vendor.BusinessName}</Text>
        <Text style={[typography.bodySm, styles.orderID]}>Order ID: {OrderID}</Text>
        <Text style={[typography.bodySm, styles.orderDate]}>Order Date: {new Date(OrderDate).toLocaleDateString()}</Text>
        <Text style={[typography.bodySm, styles.orderStatus, OrderStatus === 'Cancelled' && { color: colors.danger }]}>Status: {OrderStatus}</Text>
        {OrderStatus === 'Delivered' && !orderRated ? (
          <View style={styles.ratingContainer}>
            <Text style={[typography.bodySm, styles.ratingText]}>Tap to rate:</Text>

            <StarRating
        rating={rating}
        onChange={setRating}
      />
            <Button title="Submit" onPress={()=>submitRating(OrderID,rating,VendorID)} style={styles.submitButton}/>
          </View>
        ) : orderRated ? (
          <Text style={[typography.bodySm, styles.ratedText]}>Rated: {Ratings[0].Rating} stars</Text>
        ) : null}
      </Card>
    );
  };

  return (
   <View style={styles.screen}>
   <GlassHeader title="Your Orders" />
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
   </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  orderItem: {
    marginBottom: spacing.space3,
    marginHorizontal: spacing.space3,
    padding: 0,
    overflow: 'hidden',
  },
  vendorImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    marginBottom: spacing.space3,
  },
  businessName: {
    textAlign: 'center',
    marginBottom: spacing.space1,
    color: colors.textPrimary,
  },
  orderID: {
    color: colors.textGray,
    marginBottom: spacing.space1,
    marginLeft: spacing.space4,
  },
  orderDate: {
    color: colors.textGray,
    marginBottom: spacing.space1,
    marginLeft: spacing.space4,
  },
  orderStatus: {
    color: colors.textLight,
    marginBottom: spacing.space3,
    marginLeft: spacing.space4,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: spacing.space3,
  },
  ratingText: {
    marginBottom: spacing.space1,
    color: colors.textPrimary,
  },
  submitButton: {
    marginTop: spacing.space3,
    alignSelf: 'stretch',
    marginHorizontal: spacing.space4,
  },
  ratedText: {
    color: colors.success,
    marginBottom: spacing.space1,
    marginLeft: spacing.space4,
  },
  flatListContent: {
    paddingTop: spacing.headerHeight + spacing.space8,
    paddingBottom: spacing.space7,
  },
});

export default OrderScreen;
