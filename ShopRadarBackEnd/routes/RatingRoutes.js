const express = require('express');
const router = express.Router();
const Ratings = require('../modals/Rating');

// Fetch all ratings for a customer
router.get('/', async (req, res) => {
  const { customerId } = req.query;
  try {
    const ratings = await Ratings.findAll({ where: { CustomerID: customerId } });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch ratings' });
  }
});

// Submit a new rating for an order
router.post('/', async (req, res) => {
  try {
    const { CustomerID, VendorID, Rating, RatingDate, OrderID } = req.body;

    // Create the rating
    const newRating = await Ratings.create({
      CustomerID,
      VendorID,
      Rating,
      RatingDate,
      OrderID
    });

    res.status(201).json(newRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
      details: error
    });
  }
});

router.get('/allRating', async (req, res) => {
  try {
    const ratings = await Rating.findAll();
    res.json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
