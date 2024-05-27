import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../Shop-Radar/CustomerScreens/HomeScreen'
import ShopScreen from '../Shop-Radar/CustomerScreens/ShopScreen'
import CartScreen from '../Shop-Radar/CustomerScreens/ShopScreen';
import { Pressable } from 'react-native';
import OrderPreparing from '../Shop-Radar/CustomerScreens/OrderPreparing';
import DeliveryScreen from '../Shop-Radar/CustomerScreens/DeliveryScreen';
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



