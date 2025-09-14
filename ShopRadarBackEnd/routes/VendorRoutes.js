const express = require('express');
const router = express.Router();
const Vendor = require('../modals/Vendor');

// Route to add a new vendor
router.post('/', async (req, res) => {
    try {
        const { BusinessName, CompanyAddress, City,Image, StateProvince, Country, Latitude, Longitude, Contact, Market, Email, ShopCategory } = req.body;
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
            Image
        });
        res.status(201).json({ message: 'Vendor added successfully', Vendor: newVendor });
    } catch (error) {
      // Send error response
      console.error('Error adding Vendor:', error);
      res.status(500).json({ error: 'Failed to add Vendor' });
    }
});

router.get('/vendors', async (req, res) => {
  try {
    const vendors = await Vendor.findAll();
    res.json(vendors);
  } catch (err) {
    console.error('Error querying the database:', err.message, err);
    res.status(500).send('Error querying the database');
  }
  });

  router.get('/:id', async (req, res) => {
    try {
      const vendorID = req.params.id;
      const vendor = await Vendor.findByPk(vendorID);
      
      if (vendor) {
        res.json(vendor);
      } else {
        res.status(404).json({ message: 'Vendor not found' });
      }
    } catch (err) {
      console.error('Error querying the database:', err.message, err);
      res.status(500).send('Error querying the database');
    }
  });


  router.put('/update/:id', async (req, res) => {
    try {
      const vendorID = req.params.id;
      const {
        BusinessName,
        CompanyAddress,
        City,
        Image,
        StateProvince,
        Country,
        Latitude,
        Longitude,
        Contact,
        Market,
        Email,
        ShopCategory,
      } = req.body;
  
      const vendor = await Vendor.findByPk(vendorID);
  
      if (vendor) {
        // Update vendor details
        await vendor.update({
          BusinessName,
          CompanyAddress,
          City,
          Image,
          StateProvince,
          Country,
          Latitude,
          Longitude,
          Contact,
          Market,
          Email,
          ShopCategory,
        });
  
        res.json({ message: 'Vendor updated successfully', Vendor: vendor });
      } else {
        res.status(404).json({ error: 'Vendor not found' });
      }
    } catch (err) {
      console.error('Error updating Vendor:', err.message, err);
      res.status(500).json({ error: 'Failed to update Vendor' });
    }
  });

module.exports = router;
