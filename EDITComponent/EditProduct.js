import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { productsApi } from '../lib/api';
import { colors, radius, spacing, typography } from '../theme';
import { Card, Button, ModalAlert } from '../components/ui';

const EditProduct = ({ route, navigation }) => {
  const { ProductID } = route.params; // Fetch ProductID from route params
    console.log('id',ProductID)
  const [ProductName, setProductName] = useState('');
  const [Price, setPrice] = useState('');
  const [Discount, setDiscount] = useState('');
  const [ProductDescription, setProductDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', onConfirm: null });

  const closeAlert = () => setAlert((a) => ({ ...a, visible: false }));

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const product = await productsApi.getProductById(ProductID);

        setProductName(product.ProductName || '');
        setPrice(product.Price.toString() || '');
        setDiscount(product.Discount.toString() || '');
        setProductDescription(product.ProductDescription || '');
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch product details:', error);
        setAlert({ visible: true, title: 'Error', message: 'Failed to fetch product details', onConfirm: closeAlert });
        setIsLoading(false);
      }
    };

    if (ProductID) {
      fetchProductDetails();
    }
  }, [ProductID]);

  // Save updated product details
  const saveProductDetails = async () => {
    try {
      const updatedProduct = {
        ProductName,
        Price: parseFloat(Price),
        Discount: parseFloat(Discount),
        ProductDescription,
      };

      await productsApi.updateProduct(ProductID, updatedProduct);

      setAlert({
        visible: true,
        title: 'Success',
        message: 'Product updated successfully',
        onConfirm: () => {
          closeAlert();
          navigation.goBack();
        },
      });
    } catch (error) {
      console.error('Failed to update product:', error);
      setAlert({ visible: true, title: 'Error', message: 'Failed to update product', onConfirm: closeAlert });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[typography.body, styles.loadingText]}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={[typography.display, styles.title]}>Edit Product</Text>

      <Card style={styles.formCard}>
        <TextInput
          style={[typography.body, styles.input]}
          placeholder="Product Name"
          placeholderTextColor={colors.textGray}
          value={ProductName}
          onChangeText={setProductName}
        />
        <TextInput
          style={[typography.body, styles.input]}
          placeholder="Price"
          placeholderTextColor={colors.textGray}
          value={Price}
          keyboardType="numeric"
          onChangeText={setPrice}
        />
        <TextInput
          style={[typography.body, styles.input]}
          placeholder="Discount"
          placeholderTextColor={colors.textGray}
          value={Discount}
          keyboardType="numeric"
          onChangeText={setDiscount}
        />
        <TextInput
          style={[typography.body, styles.input]}
          placeholder="Product Description"
          placeholderTextColor={colors.textGray}
          value={ProductDescription}
          onChangeText={setProductDescription}
        />

        <Button title="Save Changes" onPress={saveProductDetails} style={styles.button} />
        <Button variant="secondary" title="Cancel" onPress={() => navigation.goBack()} style={styles.button} />
      </Card>

      <ModalAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        confirmLabel="OK"
        onConfirm={alert.onConfirm}
        onRequestClose={closeAlert}
      />
    </ScrollView>
  );
};

export default EditProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.space5,
    paddingTop: spacing.space8,
  },
  title: {
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.space5,
  },
  formCard: {},
  input: {
    backgroundColor: colors.backgroundFaf,
    height: spacing.touchTarget,
    paddingHorizontal: spacing.space4,
    borderRadius: radius.pill,
    marginBottom: spacing.space3,
    borderWidth: 1,
    borderColor: colors.white,
    color: colors.textPrimary,
  },
  button: {
    marginTop: spacing.space2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.textGray,
  },
});
