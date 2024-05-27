import React from "react";

import { Provider } from "react-redux";
import { View, Text } from "react-native";




import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "react-native-feather";
import { store } from "./store";
import NavScreen from "../Shop-Radar/NavScreen";
import DrawerNav from "./Drawer";
export default function App() {

  return (
    <Provider store={store    }>
      {/* <NavScreen /> */}
      <DrawerNav />
    </Provider>
  );
}
