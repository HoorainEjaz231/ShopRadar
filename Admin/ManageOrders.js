import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import axios from 'axios';
import { themeColors } from '../theme';
import network from '../network';
const ManageOrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [selectedOrderDetailID, setselectedOrderDetailID] = useState([]);
  const [unitPrice,setUnitPrice] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(network.serverurl+'/orders/admin/allOrders');
        const filteredOrders = response.data.filter(
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
      const response = await axios.get(`${network.serverurl}/orderdetails/${order.OrderID}/details`);
      console.log('Response Data:', response.data);
      
      // Parse the product details and map the OrderDetailID
      const productDetailsWithIDs = response.data.map(detail => {
        const parsedProducts = JSON.parse(detail.ProductDetails).products;
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
    const response = await axios.put(`${network.serverurl}/orders/${CancelOrderID}`, {
      OrderStatus: 'Cancelled',
      isDelivered: false,
    });
    if(response.data){
      console.log('response data of markder deliver ', response.data)
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
      const productsToUpdate = orderDetails.map(detail => (setselectedOrderDetailID(detail.OrderDetailID),{
        ProductID: detail.ProductID,
        Quantity: detail.Quantity,
        Price: detail.Price,
      }));
  
      console.log('Saving changes with data:', JSON.stringify({ products: productsToUpdate }));
  
     if(productsToUpdate){
      const updateResponse = await axios.put(`${network.serverurl}/orderdetails/update/${selectedOrderDetailID}`, {
        ProductDetails: JSON.stringify({ products: productsToUpdate }),
      });
  
      console.log('Update Response:', updateResponse.data);
      closeModal();
  
      const response = await axios.get(network.serverurl+'/orders/admin/allOrders');
      const filteredOrders = response.data.filter(
        (order) => order.OrderStatus !== 'Delivered' && order.OrderStatus !== 'Cancelled'
      );
      setOrders(filteredOrders);
     }
    } catch (error) {
      if (error.response) {
        console.log('Failed to update order:', error.response.data);
      } else if (error.request) {
        console.log('No response received:', error.request);
      } else {
        console.log('Error setting up the request:', error.message);
      }
    }
  };
  
  
  



  const renderOrderItem = ({ item }) => (
    <TouchableOpacity style={styles.orderItem} onPress={() => openModal(item)}>
      <Text style={styles.orderText}>Order ID: {item.OrderID}</Text>
      <Text style={styles.orderText}>Customer: {item.CustomerName}</Text>
      <Text style={styles.orderText}>Status: {item.OrderStatus}</Text>
      <Text style={styles.orderText}>Price: ${item.OrderPrice}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Orders</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.OrderID.toString()}
      />
      
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
        backdropOpacity={0.5}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          {selectedOrder && (
            <>
              <Text style={styles.modalTitle}>Order ID: {selectedOrder.OrderID}</Text>
              {orderDetails.length > 0 ? (
                <FlatList
                  data={orderDetails}
                  renderItem={({ item, index }) => (
                    <View style={styles.productItem}>
                      <Text style={styles.productText}>Product ID: {item.ProductID}</Text>
                      <Text style={styles.productText}>Price: ${item.Price?item.Price:0}</Text>
                      <TextInput
                        style={styles.quantityInput}
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
                <Text>No product details available.</Text>
              )}
              <TouchableOpacity style={styles.deleteButton} onPress={cancelOrder}>
                <Text style={styles.buttonText}>Delete Order</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
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
    backgroundColor: themeColors.bgColor(0.1),
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: themeColors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  orderItem: {
    backgroundColor: themeColors.bgColor(0.3),
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  orderText: {
    fontSize: 16,
    color: themeColors.text,
  },
  modal: {
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: themeColors.text,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productText: {
    fontSize: 16,
    flex: 1,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 5,
    width: 50,
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ManageOrdersScreen;
