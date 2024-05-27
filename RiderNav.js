import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RiderHome from './RiderScreens/RiderHome';
import RiderRegistration from './RiderScreens/RiderRegister';

export default function VendorNavigation() {
  const stack = createNativeStackNavigator();
    return (
        <stack.Navigator screenOptions={{
            headerShown: false
          }}>
            <stack.Screen name="RiderRegister" component={RiderRegistration} />
            <stack.Screen name="RiderHome" component={RiderHome} />
            
          </stack.Navigator>
        );
    }



