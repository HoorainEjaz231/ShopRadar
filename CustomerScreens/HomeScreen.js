import React from "react";

import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Icon from "react-native-feather";
import { themeColors } from "../theme";
import Categories from "../CustomerComponent/categories";
import { featured } from "../constants";
import FeaturedRow from "../CustomerComponent/featuredRow";

export default function HomeScreen() {
  return (
   
     <SafeAreaView style={{backgroundColor: 'white'}}>
      <StatusBar barStyte="dark-content" />
      {/*Searchbar*/} 
      <View style={stylehome.container}>
        <View style={stylehome.style1}>
          <Icon.Search height="24" width="24" stroke="grey" />
          <TextInput placeholder="Shop" style={{marginLeft: 8,  flex: 1,}} />
          <View style={stylehome.style2}>
            <Icon.MapPin height="20" width="20" stroke="gray" />
            <Text style={{color: '#718096'}}>New York NYC</Text>
          </View>
        </View>
        <View
          style={{ backgroundColor: themeColors.bgColor(1) , padding: 12,borderRadius: 9999,marginLeft:5}}
          
        >
          <Icon.Sliders
            height="20"
            width="20"
            strokeWidth={2.5}
            stroke="white"
          />
        </View>
      </View>
      {/* Main */}
      <ScrollView
        showsVerticatScrottIndicator={false}
        contentContainerStyte={{
          paddingBottom: 50,
        }}
      >
        {/* Categories */}
        <Categories />
        {/* Component */}
        <View style={{marginTop: 20, marginBottom:20}}>
          {[featured, featured, featured].map((item, index) => {
           
            return (
              <FeaturedRow
                key={index}
                title={item.title}
                restaurants={item.restaurants}
                description={item.description}
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>

  );
}

const stylehome = StyleSheet.create({
  container:{
    flexDirection: 'row',    // flex-row
    alignItems: 'center',    // items-center
    paddingLeft: 10,         // px-4
    paddingRight: 5,        // px-4
    paddingBottom: 8, 
    marginRight: 8, 
             
  },
  style1:{
    flexDirection: 'row',     // flex-row
    flex: 1,                  // flex-1
    alignItems: 'center',     // items-center
    padding: 12,              // p-3 (assuming 4 pixels per unit)
    borderRadius: 9999,      // rounded-full (a very large value for perfect circle)
    borderWidth: 1,          // border
    borderColor: '#D1D5DB',
  
  },
  style2:{
    flexDirection: 'row',      // flex-row
    alignItems: 'center',      // items-center
    marginLeft: 0,             // space-x-l (custom spacing)
    paddingLeft: 8,            // pl-2
    borderLeftWidth: 2,        // border-l-2
    borderLeftColor: '#D1D5DB',
  },
 
})
