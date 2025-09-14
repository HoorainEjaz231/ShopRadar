import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VendorRegister from '../VendorScreens/VendorRegister';
import VendorHome from '../VendorScreens/VendorHome';
import VendorAllProducts from '../VendorScreens/VendorAllProducts'
import VendorAddProduct from '../VendorScreens/VendorAddProduct';
import VendorIncomeScreen from '../VendorScreens/VendorIncome';
import EditCustomer from '../EDITComponent/EditCustomer'
import EditProduct from '../EDITComponent/EditProduct';

export default function VendorNavigation() {
  const stack = createNativeStackNavigator();
    return (
        <stack.Navigator screenOptions={{
            headerShown: false
          }}>
           
            <stack.Screen name="VendorHome" component={VendorHome} />
            <stack.Screen name="AllProducts" component={VendorAllProducts} />
            <stack.Screen name="AddProducts" component={VendorAddProduct} />
            <stack.Screen name="VendorIncome" component={VendorIncomeScreen} />
            <stack.Screen name="EditProduct" component={EditProduct} />
            
            
          </stack.Navigator>
        );
    }



