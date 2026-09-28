import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet,RefreshControl,Pressable, TouchableWithoutFeedback } from 'react-native';
import * as Icon from 'react-native-feather';
import { vendorsApi, ordersApi, orderDetailsApi, productsApi } from '../lib/api';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius, spacing, typography, shadows } from '../theme';
import { GlassHeader, Card, Button, ModalAlert, IconContainer } from '../components/ui';
const VendorHome = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [upcomingOrders, setUpcomingOrders] = useState(null);
  const [inProgressOrders, setInProgressOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [vendorId, setvendorId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [VendorSettingModalVisible, setVendorSettingModal] = useState(false);
  const [declineAlertVisible, setDeclineAlertVisible] = useState(false);
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
            const vendor = await vendorsApi.getVendorById(id);
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
      const orders = await ordersApi.getUpcomingOrdersForVendor(id?id:vendorId);
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
      const orderDetailsData = await orderDetailsApi.getOrderDetails(orderId);

      const enrichedOrderDetails = await Promise.all(orderDetailsData.map(async (detail) => {
        const products = detail.ProductDetails.products;
        const enrichedProducts = await Promise.all(products.map(async (product) => {
          try {
            const productData = await productsApi.getProductById(product.ProductID);
            return { ...product, ProductName: productData.ProductName };
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
      await ordersApi.updateOrder(selectedOrder.OrderID, {
        VanAccept: true,
      });
      fetchOrders();
      toggleModal();
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  const handleDeclineOrder = () => {
    setDeclineAlertVisible(true);
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
                <Text style={[typography.body, styles.menuOption]}>All Products</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{
                setVendorSettingModal(false)
                navigation.navigate('VendorIncome')
              }}>
                <Text style={[typography.body, styles.menuOption]}>My Income</Text>
              </TouchableOpacity>

            </View>
          </Pressable>
        </Modal>

      <GlassHeader
        title={VendorBusinessName ? VendorBusinessName : "Vendor Business Name"}
        showBack={false}
        rightSlot={
          <IconContainer variant="header" onPress={()=>setVendorSettingModal(true)}>
            <Icon.MoreVertical width={20} height={20} stroke={colors.textPrimary} />
          </IconContainer>
        }
      />

      <ScrollView
       contentContainerStyle={styles.scrollContent}
       refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      >

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
                <IconContainer variant="drilldown" onPress={toggleModal} style={styles.closeButton}>
                  <Icon.X width={16} height={16} stroke={colors.textPrimary} />
                </IconContainer>

                {selectedOrder && (
                  <>
                    <Text style={[typography.headerTitle, styles.modalTitle]}>Order #{selectedOrder.OrderID}</Text>

                    {selectedOrder.orderDetails && selectedOrder.orderDetails.map((detail, index) => (
                      <View key={index} style={styles.orderDetail}>
                        <Text style={[typography.sectionTitle, styles.sectionHeader]}>Product Details:</Text>
                        {detail.products.map((product, idx) => (
                          <View key={idx} style={styles.productDetail}>
                            <Text style={[typography.cardTitle, styles.productName]}>Product Name: {product.ProductName}</Text>
                            <Text style={[typography.bodySm, styles.productInfo]}>Quantity: {product.Quantity}</Text>
                            <Text style={[typography.bodySm, styles.productInfo]}>Price: ${product.Price}</Text>
                          </View>
                        ))}
                      </View>
                    ))}

                    {!selectedOrder.VanAccept && (
                      <View style={styles.buttonContainer}>
                        <Button title="Decline" variant="secondary" onPress={handleDeclineOrder} style={styles.declineButton} />
                        <Button title="Accept" onPress={handleAcceptOrder} style={styles.acceptButton} />
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
      <Text style={[typography.sectionTitle, styles.sectionTitleText]}>Upcoming Orders</Text>
      <ScrollView horizontal={true} style={styles.upcomingOrders}>
        {upcomingOrders?upcomingOrders.map((order) => (
          <Card
            key={order.OrderID}
            onPress={() => handleOrderPress(order)}
            style={[styles.orderCard, order.DeliveryType === 'PickUp' && styles.pickupOrderCard]}
          >
            <Text style={[typography.cardTitle, styles.orderID]}>Order #{order.OrderID}</Text>
          </Card>
        )):<View style={styles.emptyState}>
            <Text style={[typography.body, styles.emptyStateText]}>No Upcoming Orders</Text>
          </View>}


      </ScrollView>
        <Text style={[typography.sectionTitle, styles.sectionTitleText]}>In Progress Orders</Text>
      {/* In Progress Orders List */}
      <ScrollView style={styles.acceptedOrders}>
        {inProgressOrders?inProgressOrders.map((order) => (
          <Card
            key={order.OrderID}
            onPress={() => handleOrderPress(order)}
            style={styles.inProgressOrderCard}
          >
            <Text style={[typography.cardTitle, styles.orderID]}>Order #{order.OrderID}</Text>
            <Text style={[typography.bodySm, styles.orderStatus]}>Status: {order.OrderStatus}</Text>
          </Card>
        )):<View style={styles.emptyState}>
        <Text style={[typography.body, styles.emptyStateText]}>No In Progress Order</Text>
      </View>
      }
      </ScrollView>
      </ScrollView>

      <ModalAlert
        visible={declineAlertVisible}
        title="Decline Order"
        message="Are you sure you want to decline this order?"
        cancelLabel="Cancel"
        onCancel={() => setDeclineAlertVisible(false)}
        confirmLabel="Decline"
        onConfirm={() => {
          setDeclineAlertVisible(false);
          toggleModal();
        }}
        onRequestClose={() => setDeclineAlertVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
   flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.headerHeight + spacing.space8,
    paddingBottom: spacing.space6,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalContent: {
    width: '90%',
    padding: spacing.space5,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    ...shadows.modal,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.space3,
    right: spacing.space3,
    zIndex: 1,
  },
  modalTitle: {
    marginBottom: spacing.space5,
    color: colors.textPrimary,
  },
  orderDetail: {
    marginBottom: spacing.space4,
  },
  sectionHeader: {
    color: colors.textPrimary,
    marginTop: spacing.space3,
  },
  productDetail: {
    backgroundColor: colors.backgroundFaf,
    padding: spacing.space3,
    borderRadius: radius.md,
    marginBottom: spacing.space2,
  },
  productName: {
    color: colors.textPrimary,
  },
  productInfo: {
    color: colors.textGray,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.space3,
    marginTop: spacing.space5,
  },
  acceptButton: {
    flex: 1,
  },
  declineButton: {
    flex: 1,
  },
  sectionTitleText: {
    padding: spacing.space3,
    marginLeft: spacing.space2,
    color: colors.textPrimary,
  },
  upcomingOrders: {
    flexDirection: 'row',
    padding: spacing.space3,
  },
  acceptedOrders: {
    paddingHorizontal: spacing.space3,
  },
  orderCard: {
    marginRight: spacing.space3,
  },
  pickupOrderCard: {
    backgroundColor: colors.info + '22',
  },
  inProgressOrderCard: {
    marginBottom: spacing.space2,
  },
  orderID: {
    color: colors.textPrimary,
  },
  orderStatus: {
    color: colors.textGray,
    marginTop: spacing.space1,
  },
  emptyState: {
    justifyContent: 'center',
    height: 100,
    width: '100%',
  },
  emptyStateText: {
    paddingLeft: spacing.space7,
    color: colors.textGray,
  },
});

export default VendorHome;
