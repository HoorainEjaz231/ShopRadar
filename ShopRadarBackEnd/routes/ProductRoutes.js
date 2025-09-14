  const express = require('express');
  const router = express.Router();
  const multer = require('multer');
  const Product = require('../modals/Product'); // Ensure the Product model is imported correctly
  const fs = require('fs');
  const path = require('path');
  const Vendor = require('../modals/Vendor')
  // Configure multer for file uploads (if necessary)
  // const upload = multer({ dest: 'uploads/' }); // Example configuration
  const { Op } = require('sequelize');

  router.get('/SearchProducts', async (req, res) => {
    const { market, searchText, category } = req.query;

    let whereClause = {};

    if (searchText) {
      whereClause.ProductName = {
        [Op.like]: `%${searchText}%`
      };
    }

    if (category) {
      whereClause.ProductCategory = category;
    }

    if (market) {
      whereClause['$Vendor.Market$'] = market;
    }

    try {
      const products = await Product.findAll({
        where: whereClause,
        include: [{
          model: Vendor,
          as: 'Vendor'
        }]
      });

      if (products.length > 0) {
        res.json(products);
      } else {
        res.status(404).send('No products found');
      }
    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).send('Error searching products');
    }
  });

  router.use((req, res, next) => {
    console.log('Incoming request fields:', req.body);
    console.log('Incoming request files:', req.files);
    next();
  });

  // Route to add a product
  router.post('/', async (req, res) => {
    const { VendorID, ProductName, ProductCategory, Price,Image, Discount, ProductDescription } = req.body;

    // Validate required fields
    if (!VendorID || !ProductName || !Price) {
      return res.status(400).send('VendorID, ProductName, and Price are required.');
    }

    try {
      const product = await Product.create({
        VendorID,
        ProductName,
        ProductCategory,
        Price,
        Image,
        Discount,
        ProductDescription
      });

      res.status(201).json({ message: 'Product added successfully', Product: product });
    } catch (error) {
      console.error('Error adding Product:', error);
      res.status(500).json({ error: 'Failed to add Product' });
    }
  });

  // Route to get all products (with image handling, if necessary)
  router.get('/allProducts', async (req, res) => {
    try {
      const products = await Product.findAll();
      if (products.length > 0) {
        // If products include image data, handle it here
        res.json(products);
      } else {
        res.status(404).send('No products found');
      }
    } catch (error) {
      console.error('Error retrieving products:', error);
      res.status(500).send('Error retrieving products');
    }
  });

  // Route to get products by VendorID
  router.get('/:VendorID', async (req, res) => {
    const { VendorID } = req.params;

    try {
      const products = await Product.findAll({
        where: { VendorID }
      });

      if (products.length > 0) {
        res.json(products);
      } else {
        res.status(404).send('No products found for this VendorID');
      }
    } catch (error) {
      console.error('Error querying products by VendorID:', error);
      res.status(500).send('Error querying products by VendorID');
    }
  });

  router.get('/Products/:productId', async (req, res) => {
    console.log('Fetching product with ID:', req.params.productId);
    try {
      const product = await Product.findByPk(req.params.productId);
      if (!product) {
        console.log('Product not found');
        return res.status(404).json({ error: 'Product not found' });
      }
      console.log('Product found:', product);
      res.json(product);
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      res.status(500).json({ error: 'Failed to fetch product details' });
    }
  });


  // Update product route
router.put('/updateProduct/:ProductID', async (req, res) => {
  const { ProductID } = req.params;
  const { ProductName, Price, Discount, ProductDescription } = req.body;
  console.log('id',ProductID)
  console.log('Called')

  try {
    const product = await Product.findByPk(ProductID);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update the product details
    await product.update({
      ProductName,
      Price,
      Discount,
      ProductDescription,
    });

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Route to delete a product by ProductID
router.delete('/deleteProduct/:ProductID', async (req, res) => {
  const { ProductID } = req.params;

  try {
    const product = await Product.findByPk(ProductID);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // // Optionally delete any associated files (e.g., images)
    // if (product.Image) {
    //   const imagePath = path.join(__dirname, '..', 'uploads', product.Image);
    //   fs.unlink(imagePath, (err) => {
    //     if (err) {
    //       console.error('Failed to delete product image:', err);
    //     }
    //   });
    // }

    // Delete the product from the database
    await product.destroy();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});



  module.exports = router;
