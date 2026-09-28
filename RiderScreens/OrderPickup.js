import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { orderDetailsApi, productsApi, ordersApi } from '../lib/api';
import { colors, spacing, typography } from '../theme';
import { Card, Button } from '../components/ui';

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
      const orderDetailsData = await orderDetailsApi.getOrderDetails(OrderID);

      const enrichedOrderDetails = await Promise.all(orderDetailsData.map(async (detail) => {
        const products = detail.ProductDetails.products;
        const enrichedProducts = await Promise.all(products.map(async (product) => {
          try {
            const productData = await productsApi.getProductById(product.ProductID);
            return { ...product, ProductName: productData.ProductName };
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
      await ordersApi.updateOrder(OrderID, { OrderStatus: 'PickedUp' });
      navigation.navigate('RiderCustNav', { OrderID });
    } catch (error) {
      console.error('Failed to update order status:', error);
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
      {orderDetails.length > 0 ? (
        orderDetails.map(detail => (
          <Card key={detail.OrderDetailID} style={styles.orderDetailContainer}>
            <Text style={[typography.cardTitle, styles.orderDetailHeader]}>Order ID: {detail.OrderDetailID}</Text>
            {detail.products.map((product, index) => (
              <View key={index} style={styles.productDetail}>
                <Text style={[typography.body, styles.productName]}>{product.ProductName}</Text>
                <Text style={[typography.bodySm, styles.detailText]}>Quantity: {product.Quantity}</Text>
                <Text style={[typography.bodySm, styles.detailText]}>Price: ${product.Price.toFixed(2)}</Text>
              </View>
            ))}
          </Card>
        ))
      ) : (
        <Text style={[typography.bodySm, styles.noDetailsText]}>No order details available</Text>
      )}
      <Button title="Mark as Picked Up" onPress={handlePickup} style={styles.button} />
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
  },
  orderDetailContainer: {
    marginBottom: spacing.space4,
  },
  orderDetailHeader: {
    marginBottom: spacing.space3,
    color: colors.textPrimary,
  },
  productDetail: {
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundFaf,
    paddingBottom: spacing.space3,
    marginBottom: spacing.space3,
  },
  productName: {
    marginBottom: spacing.space1,
    color: colors.textPrimary,
  },
  detailText: {
    color: colors.textGray,
  },
  noDetailsText: {
    textAlign: 'center',
    color: colors.textGray,
    marginTop: spacing.space5,
  },
  button: {
    marginTop: spacing.space5,
  },
});
