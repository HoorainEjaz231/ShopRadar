import React from 'react';
import { View, Text, Image, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Icon from 'react-native-feather';
import { colors, radius, spacing, typography, shadows } from '../theme';

export default function RestaurentCard1({ item }) {
  const navigation = useNavigation();
  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate('ShopScreen', { ...item })}>
      <View style={styles.container}>
        <Image style={styles.image} source={{ uri:item.Image}} />
        <View style={styles.content}>
          <Text style={[typography.cardTitle, styles.name]}>{item.BusinessName}</Text>
          <View style={styles.row}>
            <Image style={styles.starIcon} source={require("../assets/star-icon-19125.png")} />
            <Text style={typography.caption}>
              <Text style={styles.rating}>{item.AverageRating}</Text>
              <Text style={styles.reviews}> ({item.RatingCount}) Reviews</Text>
              <Text style={styles.category}> · {item.ShopCategory}</Text>
            </Text>
          </View>
          <View style={styles.row}>
            <Icon.MapPin color={colors.textGray} width={15} height={15} />
            <Text style={[typography.label, styles.market]}> {item.Market}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}


const styles = StyleSheet.create({
  container: {
    marginRight: spacing.space6,
    marginBottom: spacing.space3,
    backgroundColor: colors.backgroundFaf,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.white,
    overflow: 'hidden',
    ...shadows.card,
  },
  image: {
    height: 144,
    width: 256,
  },
  content: {
    paddingHorizontal: spacing.space3,
    paddingBottom: spacing.space4,
    paddingTop: spacing.space2,
  },
  name: {
    color: colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.space1,
  },
  starIcon: {
    height: 16,
    width: 16,
    marginRight: spacing.space1,
  },
  rating: {
    color: colors.success,
  },
  reviews: {
    color: colors.textGray,
  },
  category: {
    color: colors.textPrimary,
    fontFamily: typography.chipSelected.fontFamily,
  },
  market: {
    color: colors.textGray,
  },
});
