import React from 'react'

import {} from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native';
import VendorNavigation from './VendorNav';
import NavScreen from '../Shop-Radar/NavScreen'
import VendorRegister from './VendorScreens/VendorRegister';
import RiderNav from '../Shop-Radar/RiderNav'
export default function DrawerNav () {
    const Drawer = createDrawerNavigator();
    return(
        <NavigationContainer>
            <Drawer.Navigator>
                <Drawer.Screen name='Customer Mode' component={NavScreen}/>
                <Drawer.Screen name='Vendor Mode' component={VendorNavigation}/>
                <Drawer.Screen name='Rider Mode' component={RiderNav}/>
            </Drawer.Navigator>
        </NavigationContainer>
    )
}