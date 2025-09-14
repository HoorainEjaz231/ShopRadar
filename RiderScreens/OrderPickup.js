import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import network from '../network';

export default function OrderPickup() {
  const navigation = useNavigation();
  const route = useRoute();
  const { OrderID } = route.params;
  const [orderDetails, setOrderDetails] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [OrderID]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${network.serverurl}/orderdetails/${OrderID}/details`);
      const orderDetailsData = response.data;
      
      const enrichedOrderDetails = await Promise.all(orderDetailsData.map(async (detail) => {
        const products = JSON.parse(detail.ProductDetails).products;
        const enrichedProducts = await Promise.all(products.map(async (product) => {
          try {
            const productResponse = await axios.get(`${network.serverurl}/Product/Products/${product.ProductID}`);
            return { ...product, ProductName: productResponse.data.ProductName };
          } catch (error) {
            console.error(`Failed to fetch product name for ProductID: ${product.ProductID}`, error);
            return { ...product, ProductName: `Product ID: ${product.ProductID}` }; // Fallback to ProductID if name fetch fails
          }
        }));
        return { ...detail, products: enrichedProducts };
      }));

      setOrderDetails(enrichedOrderDetails);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrderDetails().finally(() => setRefreshing(false));
  };

  const handlePickup = async () => {
    
    try {
      await axios.put(`${network.serverurl}/orders/${OrderID}`, {
        OrderStatus: 'PickedUp'
      });
      navigation.navigate('RiderCustNav', { OrderID });
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {orderDetails.length > 0 ? (
        orderDetails.map(detail => (
          <View key={detail.OrderDetailID} style={styles.orderDetailContainer}>
            <Text style={styles.orderDetailHeader}>Order ID: {detail.OrderDetailID}</Text>
            {detail.products.map((product, index) => (
              <View key={index} style={styles.productDetail}>
                <Text style={styles.productName}>{product.ProductName}</Text>
                <Text style={styles.detailText}>Quantity: {product.Quantity}</Text>
                <Text style={styles.detailText}>Price: ${product.Price.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        ))
      ) : (
        <Text style={styles.noDetailsText}>No order details available</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={handlePickup}>
        <Text style={styles.buttonText}>Mark as Picked Up</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F5F5F5', // Slightly grey background for better contrast
  },
  orderDetailContainer: {
    backgroundColor: '#FFFFFF', // White background for each order detail box
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
  },
  orderDetailHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  productDetail: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333333',
  },
  detailText: {
    fontSize: 14,
    color: '#555555',
  },
  noDetailsText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777777',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
