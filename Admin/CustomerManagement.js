import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import axios from 'axios';
import { themeColors } from '../theme'; // Assuming you have themeColors for consistent styling
import network from '../network';

const CustomersManagementScreen = ({ navigation }) => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]); // List of filtered customers
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State for search input

  // Fetch all customers from backend
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(network.serverurl + '/Customer/Customers/all');
        setCustomers(response.data);
        setFilteredCustomers(response.data); // Set initially to all customers
      } catch (error) {
        console.error('Failed to fetch customers', error);
      }
    };

    fetchCustomers();
  }, []);

  // Filter customers based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCustomers(customers); // Show all customers if search is empty
    } else {
      const filtered = customers.filter((customer) =>
        customer.FullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchQuery, customers]);

  // Open modal and set selected customer for details
  const openModal = (customer) => {
    setSelectedCustomer(customer);
    setModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedCustomer(null);
  };

  // Delete customer function
  const deleteCustomer = async (customerID) => {
    try {
      await axios.delete(network.serverurl + '/customers/delete/' + customerID);
      setCustomers(customers.filter((customer) => customer.CustomerID !== customerID));
      closeModal();
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  // Render each customer in the list
  const renderCustomerItem = ({ item }) => (
    <TouchableOpacity style={styles.customerItem} onPress={() => openModal(item)}>
      <Text style={styles.customerText}>Customer ID: {item.CustomerID}</Text>
      <Text style={styles.customerText}>Name: {item.FullName}</Text>
      <Text style={styles.customerText}>Email: {item.Email}</Text>
      <Text style={styles.customerText}>Phone: {item.Phone}</Text>
      <View style={{ marginTop: 10 }}>
        {item.VendorID ? <Text style={styles.customerText}>VendorID: {item.VendorID}</Text> : null}
        {item.RiderID ? <Text style={styles.customerText}>RiderID: {item.RiderID}</Text> : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Management</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by customer name"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomerItem}
        keyExtractor={(item) => item.CustomerID.toString()}
      />

      {/* Modal for showing customer details */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedCustomer && (
              <>
                <Text style={styles.modalTitle}>Customer Details</Text>
                <Text style={styles.modalText}>Name: {selectedCustomer.FullName}</Text>
                <Text style={styles.modalText}>Email: {selectedCustomer.Email}</Text>
                <Text style={styles.modalText}>Phone: {selectedCustomer.Phone}</Text>
                <Text style={styles.modalText}>Address: {selectedCustomer.Address}</Text>
                <Text style={styles.modalText}>City: {selectedCustomer.City}</Text>
                <Text style={styles.modalText}>Country: {selectedCustomer.Country}</Text>

                {/* Vendor Information */}
                {selectedCustomer.vendor && (
                  <View>
                    <Text style={styles.vendorTitle}>Vendor Details</Text>
                    <Text style={styles.modalText}>Vendor Name: {selectedCustomer.vendor.BusinessName}</Text>
                    <Text style={styles.modalText}>Market: {selectedCustomer.vendor.Market}</Text>
                  </View>
                )}

                {/* Rider Information */}
                {selectedCustomer.rider && (
                  <>
                    <Text style={styles.riderTitle}>Rider Details</Text>
                    <Text style={styles.modalText}>Rider Name: {selectedCustomer.rider.Name}</Text>
                    <Text style={styles.modalText}>Bike Number: {selectedCustomer.rider.BikeNumber}</Text>
                  </>
                )}

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteCustomer(selectedCustomer.CustomerID)}
                >
                  <Text style={styles.buttonText}>Delete Customer</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    closeModal();
                    navigation.navigate('EditCustomer', { customer: selectedCustomer });
                  }}
                >
                  <Text style={styles.buttonText}>Edit Customer Details</Text>
                </TouchableOpacity>

                {selectedCustomer.vendor && (
                  <View>
                    <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      closeModal();
                      navigation.navigate('EditVendor', { VendorID: selectedCustomer.VendorID });
                    }}
                  >
                    <Text style={styles.buttonText}>Edit Vendor Details</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      closeModal();
                      navigation.navigate('AllProducts', { VendorID: selectedCustomer.VendorID });
                    }}
                  >
                    <Text style={styles.buttonText}>Vendor All Products</Text>
                  </TouchableOpacity>
                  </View>
                )}

                {selectedCustomer.rider && (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      closeModal();
                      navigation.navigate('EditRider', { RiderID: selectedCustomer.RiderID });
                    }}
                  >
                    <Text style={styles.buttonText}>Edit Rider Details</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomersManagementScreen;

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
    textAlign: 'center',
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  customerItem: {
    backgroundColor: themeColors.bgColor(0.3),
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  customerText: {
    fontSize: 16,
    color: themeColors.text,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: themeColors.text,
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: themeColors.text,
  },
  vendorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: themeColors.primary,
    marginTop: 15,
  },
  riderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: themeColors.secondary,
    marginTop: 15,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  editButton: {
    backgroundColor: 'orange',
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
