import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet,RefreshControl,Pressable, Alert, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import network from '../network';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const VendorHome = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [upcomingOrders, setUpcomingOrders] = useState(null);
  const [inProgressOrders, setInProgressOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [vendorId, setvendorId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [VendorSettingModalVisible, setVendorSettingModal] = useState(false);
   const [VendorBusinessName,setVendorBusinessName] = useState(null)

   useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
  
        if (user) {
          const userData = JSON.parse(user);
          const id = userData.VendorID;
          setvendorId(id);
  
          try {
            const VendorName = await axios.get(`${network.serverurl}/vendor/${id}`);
            const vendor = VendorName.data;
            setVendorBusinessName(vendor.BusinessName);

            await fetchOrders(id);
          } catch (error) {
            console.log('Error fetching vendor name:', error);
          }
  
          // Fetch orders after vendor data is successfully fetched
          
        } else {
          console.log('No user data found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    // Call fetchUserData when the component mounts
    fetchUserData();
  }, []);
  
   

   const fetchOrders = async (id) => {

    try {
      const response = await axios.get(`${network.serverurl}/orders/upcoming/${id?id:vendorId}`);
      const orders = response.data;
      const upcoming = orders.filter(order => !order.VanAccept && order.OrderStatus === 'pending');
      const inProgress = orders.filter(order => order.VanAccept && order.OrderStatus !== 'PickedUP' && order.OrderStatus !== 'Delivered' && order.OrderStatus !== 'Cancelled');
      setUpcomingOrders(upcoming);
      setInProgressOrders(inProgress);
     
    } catch (error) {
      console.log('Error fetching orders:', error);
    }
   };
   

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleOrderPress = async (order) => {
    const orderDetails = await fetchProductDetails(order.OrderID);
  
    setSelectedOrder({ ...order, orderDetails });
    console.log('Vendor Home Detail',{ ...order, orderDetails })
    setModalVisible(true);
  };

  const fetchProductDetails = async (orderId) => {
    try {
      const response = await axios.get(`${network.serverurl}/orderdetails/${orderId}/details`);
      const orderDetailsData = response.data;
      
      const enrichedOrderDetails = await Promise.all(orderDetailsData.map(async (detail) => {
        const products = JSON.parse(detail.ProductDetails).products;
        const enrichedProducts = await Promise.all(products.map(async (product) => {
          try {
            const productResponse = await axios.get(`${network.serverurl}/Product/Products/${product.ProductID}`);
            return { ...product, ProductName: productResponse.data.ProductName };
          } catch (error) {
            console.error(`Failed to fetch product name for ProductID: ${product.ProductID}`, error);
            return { ...product, ProductName: `Product ID: ${product.ProductID}` };
          }
        }));
        return { ...detail, products: enrichedProducts };
      }));
  
      return enrichedOrderDetails;
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      return null;
    }
  };

  const handleAcceptOrder = async () => {
    if (!selectedOrder) return; // Ensure selectedOrder is not null

    try {
      await axios.put(`${network.serverurl}/orders/${selectedOrder.OrderID}`, {
        VanAccept: true,
      });
      fetchOrders();
      toggleModal();
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  const handleDeclineOrder = () => {
    Alert.alert(
      'Decline Order',
      'Are you sure you want to decline this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          onPress: () => {
            toggleModal();
          },
          style: 'destructive'
        }
      ]
    );
  };
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchOrders() // Fetch vendors again on refresh
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <View style={styles.container}>
      {/* Vendor Setting */}
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
                  navigation.navigate('AllProducts', { VendorID: vendorId });
                }}>
                <Text style={styles.menuOption}>All Products</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{
                setVendorSettingModal(false)
                navigation.navigate('VendorIncome')
              }}>
                <Text style={styles.menuOption}>My Income</Text>
              </TouchableOpacity>
              
            </View>
          </Pressable>
        </Modal>

      <ScrollView 
  
       refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      >
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.vendorName}>{VendorBusinessName?VendorBusinessName:"Vendor Business Name"}</Text>
        <TouchableOpacity onPress={()=>setVendorSettingModal(true)}>
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Modal for Accept/Decline Order */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {/* Close Icon */}
                <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>

                {selectedOrder && (
                  <>
                    <Text style={styles.modalTitle}>Order #{selectedOrder.OrderID}</Text>

                    {selectedOrder.orderDetails && selectedOrder.orderDetails.map((detail, index) => (
                      <View key={index} style={styles.orderDetail}>
                        <Text style={styles.sectionHeader}>Product Details:</Text>
                        {detail.products.map((product, idx) => (
                          <View key={idx} style={styles.productDetail}>
                            <Text style={styles.productName}>Product Name: {product.ProductName}</Text>
                            <Text style={styles.productInfo}>Quantity: {product.Quantity}</Text>
                            <Text style={styles.productInfo}>Price: ${product.Price}</Text>
                          </View>
                        ))}
                      </View>
                    ))}

                    {!selectedOrder.VanAccept && (
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptOrder}>
                          <Text style={styles.buttonText}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.declineButton} onPress={handleDeclineOrder}>
                          <Text style={styles.buttonText}>Decline</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      
      
      
      {/* Upcoming Orders Slider */}
      <ScrollView horizontal={true} style={styles.upcomingOrders}>
        {upcomingOrders?upcomingOrders.map((order) => (
          <TouchableOpacity
            key={order.OrderID}
            style={[styles.orderCard, { marginBottom: 3,padding:20, paddingTop:25, backgroundColor: order.DeliveryType == 'PickUp'? 'lightblue':'#ffffff',}]}
            onPress={() => handleOrderPress(order)}
          >
            <Text style={[styles.orderID]}>Order #{order.OrderID}</Text>
            {/* <Text style={styles.customerInfo}>Customer: {order.CustomerID}</Text>
            <Text style={styles.orderStatus}>Status: {order.OrderStatus}</Text> */}
          </TouchableOpacity>
        )):<View style={{justifyContent:'center',height:100 , width:'100%'}}>
            <Text style={{paddingLeft:30,fontSize:18,fontWeight:'400'}}>No Upcoming Orders</Text>
          </View>}


      </ScrollView>
        <Text style={{padding:10,fontSize:20,fontWeight:'700',marginLeft:10,marginBottom:5}}>In Progress Orders</Text>
      {/* In Progress Orders List */}
      <ScrollView style={styles.acceptedOrders}>
        {inProgressOrders?inProgressOrders.map((order) => (
          <TouchableOpacity
            key={order.OrderID}
            style={[styles.orderCard, { width: '100%', marginBottom: 1, marginLeft: 4 }]}
            onPress={() => handleOrderPress(order)}
          >
            <Text style={styles.orderID}>Order #{order.OrderID}</Text>
            <Text style={styles.orderStatus}>Status: {order.OrderStatus}</Text>
          </TouchableOpacity>
        )):<View style={{justifyContent:'center',height:100 , width:'100%'}}>
        <Text style={{paddingLeft:30,fontSize:18,fontWeight:'400'}}>No In Progress Order</Text>
      </View>
      }
      </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
   flex: 1,
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  orderDetail: {
    marginBottom: 15,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  productDetail: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productInfo: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  acceptButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  declineButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  upcomingOrders: {

    flexDirection: 'row',
    padding: 10,
  },
  acceptedOrders: {
 //   flex: 0.8,
    paddingHorizontal: 10,
  },
  orderCard: {
   backgroundColor:'white',
     padding: 15,
    borderRadius: 10,
    elevation: 3,
    marginRight: 10,
  },
  orderID: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  customerInfo: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  orderStatus: {
    fontSize: 16,
    color: '#888',
  },
});

export default VendorHome;
