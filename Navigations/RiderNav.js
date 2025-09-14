import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RiderHome from '../RiderScreens/RiderHome';
import RiderRegistration from '../RiderScreens/RiderRegister';
import RiderVanNav from '../RiderScreens/RiderVanNav'
import OrderPickup from "../RiderScreens/OrderPickup"
import NavToCust from "../RiderScreens/RiderCustNav"
import RiderIncomeScreen from '../RiderScreens/RiderIncome';
export default function RiderNavigation() {
  const stack = createNativeStackNavigator();
    return (
        <stack.Navigator screenOptions={{
            headerShown: false
          }}>
        
            
            <stack.Screen name="RiderHome" component={RiderHome} />
            <stack.Screen name="RiderVanNav" component={RiderVanNav} />
            <stack.Screen name="OrderPickUp" component={OrderPickup} />
            <stack.Screen name="RiderCustNav" component={NavToCust} />
            <stack.Screen name="RiderIncome" component={RiderIncomeScreen} />
          </stack.Navigator>
        );
    }



