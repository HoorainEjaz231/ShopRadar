import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { themeColors } from '../theme';
import RestaurentCard1 from './RestaurentCard1';
import { useNavigation } from '@react-navigation/native';

export default function FeaturedRow({ title, description, restaurants }) {
  const navigation = useNavigation()
  return (
    <View style={{ marginBottom: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 }}>
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{title}</Text>
          <Text style={{ color: '#6B7280', fontSize: 14 }}>{description}</Text>
        </View>
        <TouchableOpacity onPress={()=>navigation.navigate('SelectedCategory',  title )}>
          <Text style={{ color: themeColors.text, fontWeight: '600' }}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 15 }} style={{ paddingVertical: 20, overflow: 'visible' }}>
        {restaurants.map((restaurant, index) => (
          <RestaurentCard1 key={index} item={restaurant} />
        ))}
      </ScrollView>
    </View>
  );
}
