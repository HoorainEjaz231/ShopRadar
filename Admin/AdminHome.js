import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ordersApi } from '../lib/api';
import { colors, spacing, typography } from '../theme';
import { GlassHeader, Card, Button } from '../components/ui';

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
        const orders = await ordersApi.getAllOrdersAdmin();

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
    <View style={styles.container}>
      <GlassHeader title="Admin Dashboard" showBack={false} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={[typography.sectionTitle, styles.sectionTitle]}>Metrics</Text>
          <View style={styles.metricsRow}>
            <Card style={styles.metricCard} contentStyle={styles.metricContent}>
              <Text style={[typography.caption, styles.metricLabel]}>Total Orders</Text>
              <Text style={[typography.cardTitle, styles.metricValue]}>{metrics.totalOrders}</Text>
            </Card>
            <Card style={styles.metricCard} contentStyle={styles.metricContent}>
              <Text style={[typography.caption, styles.metricLabel]}>Pending Orders</Text>
              <Text style={[typography.cardTitle, styles.metricValue]}>{metrics.pendingOrders}</Text>
            </Card>
            <Card style={styles.metricCard} contentStyle={styles.metricContent}>
              <Text style={[typography.caption, styles.metricLabel]}>Total Revenue</Text>
              <Text style={[typography.cardTitle, styles.metricValue]}>Rs {metrics.totalRevenue}</Text>
            </Card>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[typography.sectionTitle, styles.sectionTitle]}>Quick Links</Text>
          <Button title="Manage Orders" onPress={() => navigation.navigate('ManageOrders')} style={styles.linkButton} />
          <Button
            variant="secondary"
            title="Manage Customers"
            onPress={() => navigation.navigate('CustomerManagement')}
            style={styles.linkButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: spacing.headerHeight + spacing.space8,
    paddingHorizontal: spacing.space5,
    paddingBottom: spacing.space6,
  },
  section: {
    marginBottom: spacing.space7,
  },
  sectionTitle: {
    color: colors.textPrimary,
    marginBottom: spacing.space3,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.space3,
  },
  metricCard: {
    flex: 1,
  },
  metricContent: {
    alignItems: 'center',
  },
  metricLabel: {
    color: colors.textGray,
  },
  metricValue: {
    color: colors.textPrimary,
    marginTop: spacing.space2,
  },
  linkButton: {
    marginTop: spacing.space3,
  },
});

export default AdminHomeScreen;
