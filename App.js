import React from "react";
import { View } from "react-native";
import { Provider } from "react-redux";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { store } from "./store";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from "@expo-google-fonts/outfit";
import DrawerNav from "./Drawer";
import Login from "./AuthScreens/Login";
import SignUp from "./AuthScreens/SignUp";
import { colors } from "./theme";

export default function App() {
  const Stack = createNativeStackNavigator();
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp}/>
            <Stack.Screen name="DrawerNav" component={DrawerNav} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
}
