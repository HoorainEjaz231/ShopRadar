import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';
import RestaurentCard1 from './RestaurentCard1';
import { useNavigation } from '@react-navigation/native';

export default function FeaturedRow({ title, description, restaurants }) {
  const navigation = useNavigation()
  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[typography.sectionTitle, styles.title]}>{title}</Text>
          <Text style={[typography.bodySm, styles.description]}>{description}</Text>
        </View>
        <TouchableOpacity onPress={()=>navigation.navigate('SelectedCategory',  title )}>
          <Text style={[typography.chipSelected, styles.seeAll]}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer} style={styles.scrollView}>
        {restaurants.map((restaurant, index) => (
          <RestaurentCard1 key={index} item={restaurant} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.space5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.space5,
  },
  title: {
    color: colors.textPrimary,
  },
  description: {
    color: colors.textGray,
  },
  seeAll: {
    color: colors.primary,
  },
  scrollView: {
    paddingVertical: spacing.space5,
    overflow: 'visible',
  },
  scrollContainer: {
    paddingHorizontal: spacing.space4,
  },
});
