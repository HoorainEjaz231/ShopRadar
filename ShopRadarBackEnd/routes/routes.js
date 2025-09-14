const express = require("express");
const router = express.Router();
const { sql } = require("../db");
const Vendor = require('../modals/Vendor');
const Rating = require('../modals/Rating');

router.get("/Customers", async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM Customers`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to handle root endpoint
router.get("/", (req, res) => {
  res.send("Connected");
});

// Route to add vendor
router.post("/Vendor", async (req, res) => {
  try {
    const {
      BusinessName,
      CompanyAddress,
      City,
      StateProvince,
      Country,
      Latitude,
      Longitude,
      Contact,
      Market,
      Email,
      ShopCategory,
      TotalRating,
      RatingCount
    } = req.body;

    const newVendor = await Vendor.create({
      BusinessName,
      CompanyAddress,
      City,
      StateProvince,
      Country,
      Latitude,
      Longitude,
      Contact,
      Market,
      Email,
      ShopCategory,
      TotalRating,
      RatingCount
    });

    res.status(201).json(newVendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Route to add a new product
router.post("/Product", async (req, res) => {
  try {
    const { productName, category, price, image, discount, description } = req.body;

    // Insert the product into the database
    const newProduct = await Product.create({
      ProductName: productName,
      ProductCategory: category,
      Price: price,
      Image: null,
      Discount: discount,
      ProductDescription: description,
      VendorID: 1 // Assuming you are setting VendorID as 1
    });

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
});



//Route to rating
router.post("/", async (req, res) => {
  try {
      const { CustomerID, VendorID, Rating } = req.body;

      const newRating = await Rating.create({
          CustomerID,
          VendorID,
          Rating,
          RatingDate: new Date() // Set the current date as the rating date
      });

      res.status(201).json(newRating);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Route to get all ratings
router.get("/", async (req, res) => {
  try {
      const ratings = await Rating.findAll();
      res.json(ratings);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Route to get ratings for a specific vendor
router.get("/vendor/:vendorId", async (req, res) => {
  try {
      const { vendorId } = req.params;
      const ratings = await Rating.findAll({ where: { VendorID: vendorId } });
      res.json(ratings);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});


module.exports = router;
