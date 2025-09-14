import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VendorsByCategoryScreen from '../CustomerScreens/SelectedCategory';
import {View,Text} from 'react-native'
import HomeScreen from '../CustomerScreens/HomeScreen';

import CartScreen from '../CustomerScreens/CartScreen';
import OrderPreparing from '../CustomerScreens/OrderPreparing';
import ShopScreen from '../CustomerScreens/ShopScreen';
import DeliveryScreen from '../CustomerScreens/DeliveryScreen';
import InProgressOrders from '../CustomerScreens/PendingOrders';
import SearchFilterScreen from '../CustomerScreens/SearchScreenModal';


export default function CustomerNav() {
  const stack = createNativeStackNavigator();
    return (
          <stack.Navigator screenOptions={{
            headerShown: false
          }}>
            <stack.Screen name="HomeScreen" component={HomeScreen} />
            <stack.Screen name="SelectedCategory" component={VendorsByCategoryScreen} />
            <stack.Screen name="ShopScreen" component={ShopScreen} />
            <stack.Screen name="Cart" options={{presentation:'modal'}} component={CartScreen} />
            <stack.Screen name="In Progress Orders" options={{presentation:'modal'}} component={InProgressOrders} />
            <stack.Screen name="OrderPreparing" options={{presentation:'fullScreenModal'}} component={OrderPreparing} />
            <stack.Screen name="Delivery" options={{presentation:'fullScreenModal'}} component={DeliveryScreen} />
              <stack.Screen name="SearchScreen"  component={SearchFilterScreen} />
            </stack.Navigator>
      );
    }



