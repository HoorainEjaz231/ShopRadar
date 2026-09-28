import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, radius, spacing, typography } from '../theme';

const SelectImage = ({ image, setImage }) => {
  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity style={styles.imageContainer} onPress={selectImage}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text style={[typography.bodySm, styles.imagePlaceholder]}>Select Image</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.space3,
    padding: spacing.space3,
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: radius.md,
    backgroundColor: colors.backgroundFaf,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: radius.md,
  },
  imagePlaceholder: {
    color: colors.textGray,
  },
});

export default SelectImage;
