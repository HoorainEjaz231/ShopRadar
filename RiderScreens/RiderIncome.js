import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import { ordersApi } from '../lib/api';
import moment from 'moment';
import { colors, spacing, typography } from '../theme';
import { GlassHeader, Card } from '../components/ui';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RiderIncomeScreen = () => {
  const [incomeData, setIncomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [RiderID,setRiderID] = useState(null)

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
      const data = await ordersApi.getRiderIncome(RiderID);
      setIncomeData(data);
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
    <Card style={styles.orderCard}>
      <Text style={[typography.bodySm, styles.orderDetail]}>Order ID: {order.OrderID}</Text>
      <Text style={[typography.bodySm, styles.orderDetail]}>Delivery Address: {order.DeliveryAddress}</Text>
      <Text style={[typography.bodySm, styles.orderDetail]}>Order Status: {order.OrderStatus}</Text>
      <Text style={[typography.bodySm, styles.orderDetail]}>Delivery Fee: Rs {order.DeliveryFee}</Text>
    </Card>
  );

  const renderSection = ({ title, orders, income }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeaderBlock}>
      <Text style={[typography.sectionTitle, styles.sectionTitle]}>{title}</Text>
      <Text style={[typography.cardTitle, styles.incomeText]}>Total Income: Rs {income || 0}</Text>
      </View>
      {orders && orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(order) => order.OrderID.toString()}
        />
      ) : (
        <Text style={[typography.bodySm, styles.noDataText]}>No income</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.screen}>
        <GlassHeader title="My Income" />
        <Text style={[typography.body, styles.loadingText]}>Loading...</Text>
      </View>
    );
  }

  if (!incomeData) {
    return (
      <View style={styles.screen}>
        <GlassHeader title="My Income" />
        <Text style={[typography.body, styles.noDataText]}>No income data available</Text>
      </View>
    );
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
    <View style={styles.screen}>
      <GlassHeader title="My Income" />
        <FlatList
      data={sections}
      renderItem={({ item }) => renderSection(item)}
      keyExtractor={(item) => item.title}
      contentContainerStyle={styles.flatListContainer}
      ListEmptyComponent={<Text style={[typography.body, styles.noDataText]}>No income data available</Text>}
    refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}  />
      }
    />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flatListContainer: {
    paddingTop: spacing.headerHeight + spacing.space8,
    paddingBottom: spacing.space6,
  },
  section: {
    marginBottom: spacing.space6,
  },
  sectionHeaderBlock: {
    marginLeft: spacing.space4,
  },
  sectionTitle: {
    color: colors.textPrimary,
    marginBottom: spacing.space2,
  },
  incomeText: {
    color: colors.success,
    marginBottom: spacing.space2,
  },
  orderCard: {
    marginBottom: spacing.space3,
    marginHorizontal: spacing.space2,
  },
  orderDetail: {
    color: colors.textPrimary,
    marginBottom: spacing.space1,
  },
  noDataText: {
    color: colors.textGray,
    textAlign:'center',
    marginTop: spacing.headerHeight + spacing.space8,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: spacing.headerHeight + spacing.space8,
    color: colors.textGray,
  },
});

export default RiderIncomeScreen;
