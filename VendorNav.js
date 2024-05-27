import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VendorRegister from './VendorScreens/VendorRegister';
import VendorHome from './VendorScreens/VendorHome';

import VendorAddProduct from './VendorScreens/VendorAddProduct';



export default function VendorNavigation() {
  const stack = createNativeStackNavigator();
    return (
        <stack.Navigator screenOptions={{
            headerShown: false
          }}>
            <stack.Screen name="VendorRegister" component={VendorRegister} />
            <stack.Screen name="VendorHome" component={VendorHome} />
            <stack.Screen name="AddProducts" component={VendorAddProduct} />
            
          </stack.Navigator>
        );
    }



