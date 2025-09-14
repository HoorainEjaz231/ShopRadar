const express = require("express");
const router = express.Router();
const { sql } = require("../db");
const Customer = require("../modals/Customer");
const Vendor = require("../modals/Vendor")
const Rider = require("../modals/Rider")
// Route to update a customer
router.put('/update/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    const { FullName, Email, Phone, Address, City, StateProvince, Country, VendorID, RiderID, Password } = req.body;

    // Find the customer by ID
    const customer = await Customer.findByPk(customerId);

    if (customer) {
      // Update the customer's details
      await customer.update({
        FullName,
        Email,
        Phone,
        Address,
        City,
        StateProvince,
        Country,
        VendorID,
        RiderID,
        Password
      });

      res.json({ message: 'Customer updated successfully', customer });
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (err) {
    console.error('Error updating customer:', err);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});


router.get('/:id', async (req, res) => {
  try {
      const customerId = req.params.id;
      const customer = await Customer.findByPk(customerId);

      if (customer) {
          res.json(customer);
      } else {
          res.status(404).json({ error: 'Customer not found' });
      }
  } catch (err) {
      console.error('Error fetching customer by ID:', err);
      res.status(500).json({ error: err.message });
  }
});

router.get('/Customers', async (req, res) => {
    try {
    
      const customers = await Customer.findAll();
      console.log('Customers fetched:', customers);
      res.json(customers);
    } catch (err) {
      console.error('Error fetching customers:', err);
      res.status(500).json({ error: err.message });
    }
  });

// Route to add a new customer
router.post('/', async (req, res) => {
  try {
    // Extract data from request body
    const { FullName, Email, Phone,Password, Address, City, StateProvince, Country } = req.body;

    // Create a new customer
    const newCustomer = await Customer.create({
      FullName,
      Email,
      Phone,
      Address,
      City,
      StateProvince,
      Country,
      Password
    });

    // Send success response
    res.status(201).json({ message: 'Customer added successfully', customer: newCustomer });
  } catch (error) {
    // Send error response
    console.error('Error adding customer:', error);
    res.status(500).json({ error: 'Failed to add customer' });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { FullName, Email, Phone, Address, City, StateProvince, Country, Password } = req.body;

    const newCustomer = await Customer.create({
      FullName,
      Email,
      Phone,
      Address,
      City,
      StateProvince,
      Country,
      Password
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Sign up failed:', error);
    res.status(500).json({ error: 'Sign up failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const customer = await Customer.findOne({ where: { Email, Password } });

    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/Customers/all', async (req, res) => {
  console.log('Fetching all customers with Vendor and Rider details');

  try {
    // Fetch all customers along with related Vendor and Rider details if they exist
    const customers = await Customer.findAll({
      include: [
        {
          model: Vendor,
          as: 'vendor', // Assuming you've set up an alias in associations
          attributes: ['VendorID', 'BusinessName', 'Market'], // Specify which fields to return
          required: false, // Allow null (if no VendorID)
        },
        {
          model: Rider,
          as: 'rider', // Assuming you've set up an alias in associations
          attributes: ['RiderID', 'Name', 'BikeNumber'], // Specify which fields to return
          required: false, // Allow null (if no RiderID)
        }
      ]
    });

    // Return the customers along with their Vendor and Rider data
    res.json(customers);
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});
module.exports = router;