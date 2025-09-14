import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import network from '../network';
import { themeColors } from '../theme';
import * as Icon from "react-native-feather"; // Import Feather icons
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VendorIncomeScreen = () => {
  const [incomeData, setIncomeData] = useState(null);
  const [VendorID, setVendorID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();


  useEffect(() => {
    const fetchVendorID = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          setVendorID(JSON.parse(user).VendorID);
          fetchIncomeData(JSON.parse(user).VendorID);
        }
      } catch (error) {
        console.error('Error fetching Vendor ID', error);
      }
    };
   fetchVendorID();
  }, []);

  const fetchIncomeData = async (props) => {

  if (props){
      try {
        
        const response = await axios.get(network.serverurl + '/orders/VendorIncome/'+ props); // Adjust endpoint as needed
        setIncomeData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchIncomeData().finally(() => setRefreshing(false));
  };

  const renderOrderItem = ({ item: order }) => (
    <View style={styles.orderCard}>
      {/* Conditionally render the Cancelled label */}
      {order.OrderStatus === 'Cancelled' && (
        <View style={styles.cancelledLabel}>
          <Text style={styles.cancelledText}>Cancelled</Text>
        </View>
      )}
      <Text style={styles.orderDetail}>Order ID: {order.OrderID}</Text> 
      <Text style={styles.orderDetail}>Delivery Address: {order.DeliveryAddress}</Text>
      <Text style={styles.orderDetail}>Order Status: {order.OrderStatus}</Text>
      <Text style={styles.orderDetail}>Order Price: Rs {order.OrderPrice}</Text>
    </View>
  );
  

  const renderSection = ({ title, orders, income }) => (
    <View style={styles.section}>
      <View style={{ marginLeft: 15 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.incomeText}>Total Income: Rs {income || 0}</Text>
      </View>
      {orders && orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(order) => order.OrderID.toString()}
          contentContainerStyle={{ marginTop: 10 }} // Add top margin here
        />
      ) : (
        <Text style={styles.noDataText}>No income</Text>
      )}
    </View>
  );

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (!incomeData) {
    return <Text style={styles.noDataText}>No income data available</Text>;
  }

  const sections = [
    { title: 'Today', orders: incomeData.today, income: incomeData.incomes?.[moment().format('DD/MM/YYYY')] },
    { title: 'Tomorrow', orders: incomeData.tomorrow, income: incomeData.incomes?.[moment().add(1, 'days').format('DD/MM/YYYY')] },
    ...Object.keys(incomeData.others || {}).map(date => ({
      title: date,
      orders: incomeData.others[date],
      income: incomeData.incomes?.[date]
    }))
  ];

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={sections}
        renderItem={({ item }) => renderSection(item)}
        keyExtractor={(item) => item.title}
        contentContainerStyle={styles.flatListContainer}
        ListEmptyComponent={<Text style={styles.noDataText}>No income data available</Text>}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backbutton}
      >
        <Icon.ArrowLeft strokeWidth={3} stroke={themeColors.bgColor(1)} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    flatListContainer: {
      paddingTop: 60, // Adjust this value for top margin
      backgroundColor: '#f7f7f7',
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    incomeText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#4CAF50',
      marginBottom: 8,
    },
    orderCard: {
      backgroundColor: '#fff',
      padding: 16,
      borderRadius: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      marginBottom: 12,
      marginHorizontal: 7,
      position: 'relative', // Needed to position the cancelled label absolutely
    },
    orderDetail: {
      fontSize: 16,
      marginBottom: 4,
    },
    cancelledLabel: {
     
      top: 0,
      left: 0,
      backgroundColor: 'red',
      padding: 8,
      borderRadius:6,
      marginBottom:10,
      width: '100%',
      alignItems: 'center',
    },
    cancelledText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    backbutton: {
      position: 'absolute',
      top: 10,
      left: 20,
      padding: 8,
      backgroundColor: '#F9FAFB',
      borderRadius: 9999,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    noDataText: {
      fontSize: 18,
      color: '#888',
      textAlign: 'center'
    },
    loadingText: {
      fontSize: 18,
      textAlign: 'center',
      marginTop: 20,
    },
  });
  

export default VendorIncomeScreen;
