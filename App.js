import React,{useState,useEffect} from "react";
import { Provider } from "react-redux";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { store } from "./store";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNav from "./Drawer";
import Login from "./AuthScreens/Login";
import SignUp from "./AuthScreens/SignUp";
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp}/>
          <Stack.Screen name="DrawerNav" component={DrawerNav} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
