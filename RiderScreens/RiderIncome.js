import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl,TouchableOpacity} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import network from '../network';
import { themeColors } from '../theme';
import * as Icon from "react-native-feather"; // Import Feather icons
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RiderIncomeScreen = () => {
  const [incomeData, setIncomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [RiderID,setRiderID] = useState(null)
const navigation = useNavigation();

useEffect(() => {
  const fetchRiderID = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        setRiderID(JSON.parse(user).RiderID);
      }
    } catch (error) {
      console.error('Error fetching Rider ID', error);
    }
  };
  fetchRiderID();
}, []); // This useEffect only runs when the component mounts to fetch and set RiderID

// Separate useEffect to listen for changes to RiderID
useEffect(() => {
  if (RiderID) {
    console.log('called ',RiderID)
    // Only call fetchIncomeData if RiderID has been set
    fetchIncomeData();
  }
}, [RiderID]); // This useEffect triggers whenever RiderID changes


  const fetchIncomeData = async () => {
   if(RiderID){
    try {
      const response = await axios.get(network.serverurl + '/orders/RiderIncome/'+ RiderID);
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
      <Text style={styles.orderDetail}>Order ID: {order.OrderID}</Text>
      <Text style={styles.orderDetail}>Delivery Address: {order.DeliveryAddress}</Text>
      <Text style={styles.orderDetail}>Order Status: {order.OrderStatus}</Text>
      <Text style={styles.orderDetail}>Delivery Fee: Rs {order.DeliveryFee}</Text>
      {/* <Text style={styles.orderDetail}>Order Date: {moment(order.OrderDate).format('DD/MM/YYYY')}</Text> */}
    </View>
  );

  const renderSection = ({ title, orders, income }) => (
    <View style={styles.section}>
      <View style={{marginLeft:15}}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.incomeText}>Total Income: Rs {income || 0}</Text>
      </View>
      {orders && orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(order) => order.OrderID.toString()}
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
    <View style={{flex:1}}>
        <FlatList
      data={sections}
      renderItem={({ item }) => renderSection(item)}
      keyExtractor={(item) => item.title}
      contentContainerStyle={styles.flatListContainer}
      ListEmptyComponent={<Text style={styles.noDataText}>No income data available</Text>}
    refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}  />
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  flatListContainer: {
    paddingTop: 60, // Adjust this value for top margin
   // paddingHorizontal: 16,
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
    marginHorizontal:7
  },
  orderDetail: {
    fontSize: 16,
    marginBottom: 4,
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
    textAlign:'center'
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RiderIncomeScreen;
