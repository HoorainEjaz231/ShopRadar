// App.js

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import AdminHomeScreen from '../Admin/AdminHome';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ManageOrdersScreen from '../Admin/ManageOrders';
import CustomersManagementScreen from '../Admin/CustomerManagement';
import EditCustomer from '../EDITComponent/EditCustomer';
import EditVendor from '../EDITComponent/EditVendor';
import EditRider from '../EDITComponent/EditRider';
import VendorAllProducts from '../VendorScreens/VendorAllProducts'
import EditProduct from '../EDITComponent/EditProduct';

const Stack = createNativeStackNavigator();

export default function AdminNavigation() {
  return (
    
      <Stack.Navigator initialRouteName="AdminHome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
        <Stack.Screen name="ManageOrders" component={ManageOrdersScreen} />
        <Stack.Screen name="CustomerManagement" component={CustomersManagementScreen} />
        <Stack.Screen name="EditCustomer" component={EditCustomer} />
        <Stack.Screen name="EditVendor" component={EditVendor} />
        <Stack.Screen name="EditRider" component={EditRider} />
        <Stack.Screen name="AllProducts" component={VendorAllProducts} />
        <Stack.Screen name="EditProduct" component={EditProduct} />
        {/* <Stack.Screen name="Orders" component={OrdersScreen} /> */}
        {/* <Stack.Screen name="Customers" component={CustomersScreen} />
        <Stack.Screen name="Vendors" component={VendorsScreen} />
        <Stack.Screen name="Products" component={ProductsScreen} />
        <Stack.Screen name="Ratings" component={RatingsScreen} />
        <Stack.Screen name="Reports" component={ReportsScreen} /> */}
      </Stack.Navigator>
  
  );
}
