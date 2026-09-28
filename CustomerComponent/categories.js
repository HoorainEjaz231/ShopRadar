import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from "react-native";
import { categories } from "../constants";
import { useNavigation } from "@react-navigation/native";
import { colors, spacing, typography, shadows } from "../theme";

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

          return (
            <View
              key={index}
              style={styles.categoryContainer}
            >
              <TouchableOpacity
                onPress={() => handleCategories(category)}
                style={[styles.button, isActive ? styles.buttonActive : styles.buttonInactive]}
              >
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.image}
                    source={category.image || require("../assets/favicon.png")}
                  />
                </View>
              </TouchableOpacity>
              <Text
                style={[isActive ? typography.chipSelected : typography.chip, { color: isActive ? colors.textPrimary : colors.textGray }]}
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
    marginTop: spacing.space4,
  },
  scrollView: {
    overflow: 'visible',
  },
  scrollContainer: {
    paddingHorizontal: spacing.space4,
  },
  categoryContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.space5,
    marginBottom: spacing.space5,
  },
  button: {
    padding: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.white,
    ...shadows.card,
  },
  buttonActive: {
    backgroundColor: colors.primary,
  },
  buttonInactive: {
    backgroundColor: colors.backgroundFaf,
  },
  imageContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
