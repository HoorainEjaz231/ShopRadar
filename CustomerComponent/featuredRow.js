import React from "react";
import RestaurentCard1 from "./RestaurentCard1";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { themeColors } from "../theme";


export default function FeaturedRow({title, description, restaurants}) {
  
  return (
    <View style={{marginBottom:20}}>
      <View style={{flexDirection: 'row',justifyContent: 'space-between',  alignItems: 'center',paddingHorizontal: 16, }}>
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 18,}}>{title}</Text>
          <Text style={{color: '#6B7280',fontSize: 14,  }}>{description}</Text>
        </View>
        <TouchableOpacity>
          <Text style={{ color: themeColors.text ,fontWeight:'600'}}>
            See All
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontatScrottIndicato={false}
        contentContainerStyte={{
          paddingHorizontal: 15,
        }}
        style={{paddingVertical: 20,overflow:'visible'}}
      >
        {restaurants.map((restaurant,index)=>{
            return(
                <RestaurentCard1 
                key={index}
                item={restaurant}
                />
            )
        })}
      </ScrollView> 
    </View>
  );
}

 