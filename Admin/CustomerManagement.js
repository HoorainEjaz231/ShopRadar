import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Modal } from 'react-native';
import { customersApi } from '../lib/api';
import { colors, radius, spacing, typography, shadows } from '../theme';
import { GlassHeader, Card, Button } from '../components/ui';

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
        const data = await customersApi.getAllCustomersWithRoles();
        setCustomers(data);
        setFilteredCustomers(data); // Set initially to all customers
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
      await customersApi.deleteCustomer(customerID);
      setCustomers(customers.filter((customer) => customer.CustomerID !== customerID));
      closeModal();
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  // Render each customer in the list
  const renderCustomerItem = ({ item }) => (
    <Card onPress={() => openModal(item)} style={styles.customerCard}>
      <Text style={[typography.cardTitle, styles.customerName]}>{item.FullName}</Text>
      <Text style={[typography.bodySm, styles.customerMeta]}>{item.Email}</Text>
      <Text style={[typography.bodySm, styles.customerMeta]}>{item.Phone}</Text>
      {(item.VendorID || item.RiderID) && (
        <View style={styles.badgeRow}>
          {item.VendorID ? <Text style={[typography.caption, styles.badge]}>Vendor #{item.VendorID}</Text> : null}
          {item.RiderID ? <Text style={[typography.caption, styles.badge]}>Rider #{item.RiderID}</Text> : null}
        </View>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      <GlassHeader
        title="Customer Management"
        bottomSlot={
          <TextInput
            style={[typography.bodySm, styles.searchInput]}
            placeholder="Search by customer name"
            placeholderTextColor={colors.textGray}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        }
      />

      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomerItem}
        keyExtractor={(item) => item.CustomerID.toString()}
        contentContainerStyle={styles.listContent}
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
                <Text style={[typography.headerTitle, styles.modalTitle]}>Customer Details</Text>
                <Text style={[typography.bodySm, styles.modalText]}>Name: {selectedCustomer.FullName}</Text>
                <Text style={[typography.bodySm, styles.modalText]}>Email: {selectedCustomer.Email}</Text>
                <Text style={[typography.bodySm, styles.modalText]}>Phone: {selectedCustomer.Phone}</Text>
                <Text style={[typography.bodySm, styles.modalText]}>Address: {selectedCustomer.Address}</Text>
                <Text style={[typography.bodySm, styles.modalText]}>City: {selectedCustomer.City}</Text>
                <Text style={[typography.bodySm, styles.modalText]}>Country: {selectedCustomer.Country}</Text>

                {/* Vendor Information */}
                {selectedCustomer.vendor && (
                  <View>
                    <Text style={[typography.sectionTitle, styles.vendorTitle]}>Vendor Details</Text>
                    <Text style={[typography.bodySm, styles.modalText]}>Vendor Name: {selectedCustomer.vendor.BusinessName}</Text>
                    <Text style={[typography.bodySm, styles.modalText]}>Market: {selectedCustomer.vendor.Market}</Text>
                  </View>
                )}

                {/* Rider Information */}
                {selectedCustomer.rider && (
                  <>
                    <Text style={[typography.sectionTitle, styles.riderTitle]}>Rider Details</Text>
                    <Text style={[typography.bodySm, styles.modalText]}>Rider Name: {selectedCustomer.rider.Name}</Text>
                    <Text style={[typography.bodySm, styles.modalText]}>Bike Number: {selectedCustomer.rider.BikeNumber}</Text>
                  </>
                )}

                <Button
                  title="Delete Customer"
                  onPress={() => deleteCustomer(selectedCustomer.CustomerID)}
                  style={[styles.modalButton, styles.deleteButton]}
                />

                <Button
                  variant="secondary"
                  title="Edit Customer Details"
                  onPress={() => {
                    closeModal();
                    navigation.navigate('EditCustomer', { customer: selectedCustomer });
                  }}
                  style={styles.modalButton}
                />

                {selectedCustomer.vendor && (
                  <View>
                    <Button
                      variant="secondary"
                      title="Edit Vendor Details"
                      onPress={() => {
                        closeModal();
                        navigation.navigate('EditVendor', { VendorID: selectedCustomer.VendorID });
                      }}
                      style={styles.modalButton}
                    />

                    <Button
                      variant="secondary"
                      title="Vendor All Products"
                      onPress={() => {
                        closeModal();
                        navigation.navigate('AllProducts', { VendorID: selectedCustomer.VendorID });
                      }}
                      style={styles.modalButton}
                    />
                  </View>
                )}

                {selectedCustomer.rider && (
                  <Button
                    variant="secondary"
                    title="Edit Rider Details"
                    onPress={() => {
                      closeModal();
                      navigation.navigate('EditRider', { RiderID: selectedCustomer.RiderID });
                    }}
                    style={styles.modalButton}
                  />
                )}

                <Button title="Close" onPress={closeModal} style={styles.modalButton} />
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
    backgroundColor: colors.background,
  },
  searchInput: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.space4,
    paddingVertical: spacing.space2,
    borderRadius: radius.pill,
    borderColor: colors.white,
    borderWidth: 1,
    color: colors.textPrimary,
  },
  listContent: {
    paddingTop: spacing.headerHeight + spacing.space7 + spacing.space8,
    paddingHorizontal: spacing.space5,
    paddingBottom: spacing.space6,
  },
  customerCard: {
    marginBottom: spacing.space3,
  },
  customerName: {
    color: colors.textPrimary,
  },
  customerMeta: {
    color: colors.textGray,
    marginTop: spacing.space1,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.space2,
    marginTop: spacing.space3,
  },
  badge: {
    backgroundColor: colors.backgroundFaf,
    color: colors.primary,
    paddingHorizontal: spacing.space3,
    paddingVertical: spacing.space1,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: spacing.space5,
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: spacing.space6,
    borderRadius: radius.xl,
    ...shadows.modal,
  },
  modalTitle: {
    color: colors.textPrimary,
    marginBottom: spacing.space4,
  },
  modalText: {
    marginBottom: spacing.space2,
    color: colors.textPrimary,
  },
  vendorTitle: {
    color: colors.primary,
    marginTop: spacing.space4,
    marginBottom: spacing.space2,
  },
  riderTitle: {
    color: colors.info,
    marginTop: spacing.space4,
    marginBottom: spacing.space2,
  },
  modalButton: {
    marginTop: spacing.space3,
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
});
