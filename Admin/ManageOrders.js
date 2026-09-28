import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { ordersApi, orderDetailsApi } from '../lib/api';
import { colors, radius, spacing, typography, shadows } from '../theme';
import { GlassHeader, Card, Button } from '../components/ui';
const ManageOrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [unitPrice,setUnitPrice] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const allOrders = await ordersApi.getAllOrdersAdmin();
        const filteredOrders = allOrders.filter(
          order => order.OrderStatus !== 'Delivered' && order.OrderStatus !== 'Cancelled'
        );
        setOrders(filteredOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const openModal = async (order) => {
    try {
      const details = await orderDetailsApi.getOrderDetails(order.OrderID);
      console.log('Response Data:', details);

      // Map the OrderDetailID onto each product so it can be saved back later
      const productDetailsWithIDs = details.map(detail => {
        const parsedProducts = detail.ProductDetails.products;
        return parsedProducts.map(product => ({
          ...product,
          OrderDetailID: detail.OrderDetailID, // Attach the OrderDetailID to each product
        }));
      }).flat(); // Flatten the array if it has nested arrays

      setOrderDetails(productDetailsWithIDs);
      setSelectedOrder(order);
      setModalVisible(true);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    }
  };



  const closeModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
    setOrderDetails([]);
  };

  const handleQuantityChange = (index, quantity, item) => {

    const updatedDetails = [...orderDetails];
    if(!unitPrice){
      setUnitPrice(item.Price/item.Quantity)
    }
    console.log('unit price',unitPrice)
    const newQuantity = parseInt(quantity, 10) || 0;
    const newprice = parseInt(newQuantity * unitPrice)
    // Update the quantity and calculate the new price
    updatedDetails[index].Quantity = newQuantity;
    updatedDetails[index].Price = newprice;
    console.log('Updated quantity',updatedDetails)
    setOrderDetails(updatedDetails);
};

const cancelOrder = async () => {
  let CancelOrderID = selectedOrder.OrderID
  console.log('this is cancellation Order iD',CancelOrderID)
  try {
    const data = await ordersApi.updateOrder(CancelOrderID, {
      OrderStatus: 'Cancelled',
      isDelivered: false,
    });
    if(data){
      console.log('response data of markder deliver ', data)
      setModalVisible(false)
    }
  } catch (error) {
    console.error('Failed to update order status:', error);
  }


}
  const removeItem = (index) => {
    const updatedDetails = orderDetails.filter((_, i) => i !== index);
    setOrderDetails(updatedDetails);
  };

  const saveChanges = async () => {
    try {
      const productsToUpdate = orderDetails.map(detail => ({
        ProductID: detail.ProductID,
        Quantity: detail.Quantity,
        Price: detail.Price,
      }));
      const orderDetailId = orderDetails[0]?.OrderDetailID;

      console.log('Saving changes with data:', { products: productsToUpdate });

     if(productsToUpdate.length && orderDetailId){
      const updated = await orderDetailsApi.updateOrderDetails(orderDetailId, { products: productsToUpdate });

      console.log('Update Response:', updated);
      closeModal();

      const allOrders = await ordersApi.getAllOrdersAdmin();
      const filteredOrders = allOrders.filter(
        (order) => order.OrderStatus !== 'Delivered' && order.OrderStatus !== 'Cancelled'
      );
      setOrders(filteredOrders);
     }
    } catch (error) {
      console.log('Failed to update order:', error.message);
    }
  };






  const renderOrderItem = ({ item }) => (
    <Card onPress={() => openModal(item)} style={styles.orderCard}>
      <Text style={[typography.cardTitle, styles.orderTitle]}>Order #{item.OrderID}</Text>
      <Text style={[typography.bodySm, styles.orderMeta]}>{item.CustomerName}</Text>
      <View style={styles.orderFooterRow}>
        <Text style={[typography.label, styles.orderStatus]}>{item.OrderStatus}</Text>
        <Text style={[typography.cardTitle, styles.orderPrice]}>${item.OrderPrice}</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <GlassHeader title="Manage Orders" />
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.OrderID.toString()}
        contentContainerStyle={styles.listContent}
      />

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
        backdropOpacity={0.45}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          {selectedOrder && (
            <>
              <Text style={[typography.headerTitle, styles.modalTitle]}>Order #{selectedOrder.OrderID}</Text>
              {orderDetails.length > 0 ? (
                <FlatList
                  data={orderDetails}
                  renderItem={({ item, index }) => (
                    <View style={styles.productItem}>
                      <Text style={[typography.bodySm, styles.productText]}>Product ID: {item.ProductID}</Text>
                      <Text style={[typography.bodySm, styles.productText]}>Price: ${item.Price?item.Price:0}</Text>
                      <TextInput
                        style={[typography.bodySm, styles.quantityInput]}
                        value={String(item.Quantity)}
                        keyboardType="numeric"
                        onChangeText={(value) => handleQuantityChange(index, value,item)}
                      />
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeItem(index)}
                      >
                        <Text style={styles.removeButtonText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              ) : (
                <Text style={typography.bodySm}>No product details available.</Text>
              )}
              <Button title="Delete Order" onPress={cancelOrder} style={[styles.modalButton, styles.deleteButton]} />
              <Button title="Save Changes" onPress={saveChanges} style={styles.modalButton} />
              <Button variant="secondary" title="Cancel" onPress={closeModal} style={styles.modalButton} />
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingTop: spacing.headerHeight + spacing.space8,
    paddingHorizontal: spacing.space5,
    paddingBottom: spacing.space6,
    gap: spacing.space3,
  },
  orderCard: {
    marginBottom: spacing.space3,
  },
  orderTitle: {
    color: colors.textPrimary,
  },
  orderMeta: {
    color: colors.textGray,
    marginTop: spacing.space1,
  },
  orderFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.space2,
  },
  orderStatus: {
    color: colors.warning,
  },
  orderPrice: {
    color: colors.textPrimary,
  },
  modal: {
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: spacing.space6,
    borderRadius: radius.xl,
    ...shadows.modal,
  },
  modalTitle: {
    marginBottom: spacing.space4,
    color: colors.textPrimary,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.space3,
  },
  productText: {
    flex: 1,
    color: colors.textPrimary,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.backgroundFaf,
    borderRadius: radius.sm,
    padding: spacing.space1,
    width: 50,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  removeButton: {
    backgroundColor: colors.dangerTint,
    paddingVertical: spacing.space1,
    paddingHorizontal: spacing.space3,
    borderRadius: radius.pill,
    marginLeft: spacing.space3,
  },
  removeButtonText: {
    ...typography.chip,
    color: colors.danger,
  },
  modalButton: {
    marginTop: spacing.space3,
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
});

export default ManageOrdersScreen;
