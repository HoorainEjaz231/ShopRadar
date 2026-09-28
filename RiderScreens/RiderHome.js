import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, FlatList, Pressable, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ridersApi, ordersApi } from '../lib/api';
import * as Icon from 'react-native-feather';
import { colors, radius, spacing, typography, shadows } from '../theme';
import { GlassHeader, Card, Button, IconContainer } from '../components/ui';

export default function RiderHome() {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [AssOrder, setAssOrder] = useState(null);
  const [PreviousOrder, setPreviousOrder] = useState(null);
  const [RiderID, setRiderID] = useState(null);
  const [VendorSettingModalVisible, setVendorSettingModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New loading state

  useEffect(() => {
    fetchCustomerID();
  }, []);

  useEffect(() => {
    if (RiderID) {
      FetchOrderDetails();
    }
  }, [RiderID]);

  const fetchCustomerID = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setRiderID(JSON.parse(userData));
      }
    } catch (error) {
      console.log('Error fetching Rider ID', error);
    }
  };

  const FetchOrderDetails = async () => {
    setIsLoading(true); // Set loading to true before fetching

    try {
      // First, fetch the assigned order
      const assignedOrder = await ridersApi.getAssignedOrder(RiderID.RiderID);

      if (assignedOrder) {
        setAssOrder(assignedOrder);

        // Now fetch the order details using the AssignedOrder
        const orderData = await ordersApi.getOrderById(assignedOrder);
        setPreviousOrder(orderData);

        // Navigate based on the OrderStatus
        switch (orderData.OrderStatus) {
          case 'accepted':
            navigation.navigate('RiderVanNav', { OrderID: orderData.OrderID });
            break;
          case 'AtVendor':
            navigation.navigate('OrderPickUp', { OrderID: orderData.OrderID });
            break;
          case 'PickedUp':
            navigation.navigate('RiderCustNav', { OrderID: orderData.OrderID });
            break;
          default:
            console.log('Unknown Order Status');
            break;
        }
      } else {
        fetchOrders(); // Fetch all orders if no assigned order
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setIsLoading(false); // Stop loading once fetch is complete
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true); // Set loading to true before fetching

    try {
      const data = await ordersApi.getAvailableOrdersForRiders();

      if (data.length > 0) {
        setOrders(data.sort((a, b) => b.OrderID - a.OrderID));
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false); // Stop loading once fetch is complete
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    FetchOrderDetails().finally(() => setRefreshing(false));
  };

  const handleAccept = async (OrderID) => {
    try {
      await ordersApi.updateOrder(OrderID, { OrderStatus: 'accepted', RiderID: RiderID.RiderID });
      await ridersApi.updateRider(RiderID.RiderID, { AssignedOrder: OrderID, IsAvailable: false });

      navigation.navigate('RiderVanNav', { OrderID });
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  const handleDecline = (orderId) => {
    setOrders(orders.filter(order => order.OrderID !== orderId));
  };

  const renderOrder = ({ item }) => (
    <Card style={styles.orderContainer}>
      <Text style={[typography.bodySm, styles.orderText]}>Order ID: {item.OrderID}</Text>
      <Text style={[typography.bodySm, styles.orderText]}>Delivery Address: {item.DeliveryAddress}</Text>
      <Text style={[typography.display, styles.orderFee]}>Rs: {item.DeliveryFee}</Text>
      <View style={styles.buttonContainer}>
        <Button variant="secondary" title="Decline" onPress={() => handleDecline(item.OrderID)} style={styles.actionButton} />
        <Button title="Accept" onPress={() => handleAccept(item.OrderID)} style={styles.actionButton} />
      </View>
    </Card>
  );

  if (isLoading) {
    // Display loading indicator when data is being fetched
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[typography.body, styles.loadingText]}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GlassHeader
        title="Incoming Orders"
        showBack={false}
        rightSlot={
          <IconContainer variant="header" onPress={() => setVendorSettingModal(true)}>
            <Icon.MoreVertical width={20} height={20} stroke={colors.textPrimary} />
          </IconContainer>
        }
      />
      <Modal
        transparent={true}
        visible={VendorSettingModalVisible}
        animationType="fade"
        onRequestClose={() => setVendorSettingModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setVendorSettingModal(false)}>
          <View style={styles.modalContentVendor}>
            <TouchableOpacity onPress={() => {
              setVendorSettingModal(false);
              navigation.navigate('RiderIncome');
            }}>
              <Text style={[typography.body, styles.menuOption]}>Income</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.OrderID.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={{ marginTop: spacing.space8 }}>
              <Text style={[typography.sectionTitle, styles.noOrder]}>Pull Down To Refresh</Text>
              <Text style={[typography.sectionTitle, styles.noOrder]}>No Orders Found</Text>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingTop: spacing.headerHeight + spacing.space8,
    paddingBottom: spacing.space6,
  },
  orderContainer: {
    marginHorizontal: spacing.space3,
    marginBottom: spacing.space3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContentVendor: {
    backgroundColor: colors.white,
    padding: spacing.space5,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  menuOption: {
    padding: spacing.space3,
    color: colors.textPrimary,
  },
  orderText: {
    color: colors.textPrimary,
    marginBottom: spacing.space1,
  },
  orderFee: {
    color: colors.textPrimary,
    marginBottom: spacing.space3,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.space3,
  },
  actionButton: {
    flex: 1,
  },
  noOrder: {
    textAlign: 'center',
    color: colors.textGray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.space3,
    color: colors.textGray,
  },
});
