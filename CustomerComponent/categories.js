import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from "react-native";
import { categories } from "../constants";
import { useNavigation } from "@react-navigation/native";

export default function Categories() {
  const navigation = useNavigation()
  const [activeCategory, setActiveCategory] = useState(null);
const handleCategories = (props) => {
  let name = props.name
  setActiveCategory(props.id)
  navigation.navigate('SelectedCategory',  name );
}
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
      >
        {categories.map((category, index) => {
          let isActive = category.id === activeCategory;

          let btnClass = isActive ? '#4B5563' : '#E5E7EB';
          let textColor = isActive ? '#111827' : '#718096';
          let textClass = isActive ? '600' : 'normal';

          return (
            <View
              key={index}
              style={styles.categoryContainer}
            >
              <TouchableOpacity
                onPress={() => handleCategories(category)}
                style={[styles.button, { backgroundColor: btnClass }]}
              >
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.image}
                    source={category.image || require("../assets/favicon.png")}
                  />
                </View>
              </TouchableOpacity>
              <Text 
                style={[styles.categoryText, { color: textColor, fontWeight: textClass }]}
              >
                {category.name}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  scrollView: {
    overflow: 'visible',
  },
  scrollContainer: {
    paddingHorizontal: 15,
  },
  categoryContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 20,
  },
  button: {
    padding: 4,
    borderRadius: 9999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5, // Half of the width/height to make it circular
    overflow: 'hidden', // Ensures image stays within the circle
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryText: {
    fontSize: 12,
  },
});
