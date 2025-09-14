import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../CustomerScreens/HomeScreen'
import ShopScreen from '../CustomerScreens/ShopScreen'
import CartScreen from '../CustomerScreens/ShopScreen';
import { Pressable } from 'react-native';
import OrderPreparing from '../CustomerScreens/OrderPreparing';
import DeliveryScreen from '../CustomerScreens/DeliveryScreen';
import VendorsByCategoryScreen from '../CustomerScreens/SelectedCategory';
import {View,Text} from 'react-native'


export default function NavigationContainerScreens() {
  const stack = createNativeStackNavigator();
    return (
          <stack.Navigator screenOptions={{
            headerShown: false
          }}>
            <stack.Screen name="HomeScreen" component={HomeScreen} />
            
            <stack.Screen name="ShopScreen" component={ShopScreen} />
            <stack.Screen name="Cart" options={{presentation:'modal'}} component={CartScreen} />
            <stack.Screen name="OrderPreparing" options={{presentation:'fullScreenModal'}} component={OrderPreparing} />
            <stack.Screen name="Delivery" options={{presentation:'fullScreenModal'}} component={DeliveryScreen} />
          </stack.Navigator>
        

        
      );
    }



