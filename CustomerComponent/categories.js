import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { categories } from "../constants";

export default function Categories() {
  const [activecategory, setactivecategory] = useState(null);
  return (
    <View style={{marginTop: 16}}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicato={false}
        style={{overflow: 'visible'}}
        contentContainerStyte={{
          paddingHorizonta1: 15,
        }}
      >
        {categories.map((category, index) => {
          let isActive = category.id == activecategory;

          let btnClass = isActive ? '#4B5563' : '#E5E7EB';
          let textColor = isActive? '#111827' : '#718096';
          let textClass = isActive  
            ? '600'
            : null

          return (
            <View
              key={index}
              style={{flexDirection: 'column',justifyContent: 'center',alignItems: 'center',  marginRight: 20, marginBottom: 20,}}
            >
              <TouchableOpacity
                onPress={() => setactivecategory(category.id)}
                style={{ padding: 4,             // p-1 (assuming 4 pixels per unit)
                borderRadius: 9999,     // rounded-full (a very large value for perfect circle)
                shadowColor: '#000',    // shadow
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,backgroundColor: btnClass}}
                
              >
                <Image
                  style={{ width: 45, height: 45 }}
                  source={require("..\\assets\\favicon.png")}
                />
              </TouchableOpacity>
              <Text 
              style={{ fontSize: 12,color:textColor,fontWeight:textClass}}
             >{category.name}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
