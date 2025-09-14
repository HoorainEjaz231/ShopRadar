import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import network from '../network';

const AdminHomeScreen = () => {
  const navigation = useNavigation();
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [ordersRes, customersRes, vendorsRes, ratingsRes] = await Promise.all([
          fetch(network.serverurl + '/orders/admin/allOrders'),
          fetch(network.serverurl + '/Customer/Customers'),
          fetch(network.serverurl + '/vendor/vendors'),
          fetch(network.serverurl + '/ratings/allRating'),
        ]);

        const orders = await ordersRes.json();
        const customers = await customersRes.json();
        const vendors = await vendorsRes.json();
        const ratings = await ratingsRes.json();

        const validOrders = orders.filter(order => order.OrderStatus !== 'Cancelled');
        const totalOrders = validOrders.length;

        const pendingOrders = orders.filter(order => order.OrderStatus !== 'Delivered' && order.OrderStatus !== 'Cancelled').length;

        const completedOrders = orders.filter(order => order.OrderStatus === 'Delivered');
        const totalRevenue = completedOrders.reduce((acc, order) => acc + parseFloat(order.OrderPrice), 0);

        setMetrics({
          totalOrders,
          pendingOrders,
          totalRevenue,
        });
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Metrics</Text>
        <View style={styles.metricsContainer}>
          <View style={styles.metricBox}>
            <Text style={styles.metricTitle}>Total Orders</Text>
            <Text style={styles.metricValue}>{metrics.totalOrders}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricTitle}>Pending Orders</Text>
            <Text style={styles.metricValue}>{metrics.pendingOrders}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricTitle}>Total Revenue</Text>
            <Text style={styles.metricValue}>Rs {metrics.totalRevenue}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Links</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ManageOrders')}>
          <Text style={styles.buttonText}>Manage Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CustomerManagement')}>
          <Text style={styles.buttonText}>Manage Customers</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricBox: {
    flex: 1,
    padding: 16,
    margin: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    alignItems: 'center',
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  metricValue: {
    fontSize: 18,
    marginTop: 8,
    color: '#222',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminHomeScreen;