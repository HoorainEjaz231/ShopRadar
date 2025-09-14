import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, FlatList, Button, Pressable, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import network from '../network';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

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
      const assignedOrderResponse = await axios.get(`${network.serverurl}/Rider/assigned-order/${RiderID.RiderID}`);
      
      if (assignedOrderResponse.data.AssignedOrder) {
        setAssOrder(assignedOrderResponse.data);

        // Now fetch the order details using the AssignedOrder
        const orderResponse = await axios.get(`${network.serverurl}/orders/${assignedOrderResponse.data.AssignedOrder}`);
        const orderData = orderResponse.data;
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
      const response = await fetch(`${network.serverurl}/orders/all`);
      const data = await response.json();

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
      await fetch(`${network.serverurl}/orders/${OrderID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ OrderStatus: 'accepted', RiderID: RiderID.RiderID }),
      });

      await fetch(`${network.serverurl}/Rider/Update/${RiderID.RiderID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ AssignedOrder: OrderID, IsAvailable: false }),
      });

      navigation.navigate('RiderVanNav', { OrderID });
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  const handleDecline = (orderId) => {
    setOrders(orders.filter(order => order.OrderID !== orderId));
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderContainer}>
      <Text style={styles.orderText}>Order ID: {item.OrderID}</Text>
      <Text style={styles.orderText}>Delivery Address: {item.DeliveryAddress}</Text>
      <Text style={[styles.orderText, { fontWeight: '700', fontSize: 20 }]}>Rs: {item.DeliveryFee}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Accept" onPress={() => handleAccept(item.OrderID)} />
        <Button title="Decline" onPress={() => handleDecline(item.OrderID)} />
      </View>
    </View>
  );

  if (isLoading) {
    // Display loading indicator when data is being fetched
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.vendorName}>Incoming Orders</Text>
        <TouchableOpacity onPress={() => setVendorSettingModal(true)}>
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </TouchableOpacity>
      </View>
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
              <Text style={styles.menuOption}>Income</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.OrderID.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={{ marginTop: 200 }}>
              <Text style={styles.NoOrder}>Pull Down To Refresh</Text>
              <Text style={styles.NoOrder}>No Orders Found</Text>
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
    backgroundColor: '#f7f7ff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 15,
  },
  vendorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  orderContainer: {
    padding: 20,
    margin: 5,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContentVendor: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  menuOption: {
    fontSize: 18,
    padding: 10,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  NoOrder: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
