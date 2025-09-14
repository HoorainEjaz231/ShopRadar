const express = require('express');
const router = express.Router();
const Rider = require('../modals/Rider'); // Import the Rider model

// Route to add a new rider
router.post('/', async (req, res) => {
    try {
        const { Name, IDCardNumber,AssignedOrder, City,Contact, BikeNumber, LicenseImage, IsAvailable, RiderProfileImage } = req.body; // Destructure request body
        const newRider = await Rider.create({ // Create a new rider instance
            Name,
            IDCardNumber,
            City,
            BikeNumber,
            LicenseImage,
            IsAvailable,
            RiderProfileImage,
            Contact,
            AssignedOrder
        });
        res.status(201).json(newRider); // Respond with the newly created rider
    } catch (error) {
        res.status(400).json({ error: error.message }); // Respond with an error if something goes wrong
    }
});


router.get('/:id', async (req, res) => {
    try {
      const rider = await Rider.findByPk(req.params.id);
      if (rider) {
        res.json(rider);
      } else {
        res.status(404).json({ error: 'Rider not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/assigned-order/:id', async (req, res) => {
    try {
      console.log('Assignened order ', req.params.id)
        const rider = await Rider.findByPk(req.params.id, {
            attributes: ['AssignedOrder'] // Select only the AssignedOrder attribute
        });
        if (rider) {
            res.json({ AssignedOrder: rider.AssignedOrder });
        } else {
            res.status(404).json({ error: 'Rider not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Route to update a rider by RiderID
router.put('/Update/:id', async (req, res) => {
  try {
    const rider = await Rider.findByPk(req.params.id);
    if (rider) {
      await rider.update(req.body);
      res.json(rider);
    } else {
      res.status(404).json({ error: 'rider not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
