const express = require('express');
const router = express.Router();
const OrderDetail = require('../modals/OrderDetail');

// Fetch details for a specific order
router.get('/:orderId/details', async (req, res) => {
  
  try {
    const { orderId } = req.params;
    const orderDetails = await OrderDetail.findAll({ where: { OrderID: orderId } });
    if (orderDetails.length === 0) {
      return res.status(404).json({ error: 'No order details found for the given OrderID' });
    }
    res.status(200).json(orderDetails);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

// Create new order details
router.post('/', async (req, res) => {
  try {
    const { OrderID, ProductDetails } = req.body;

    // Validate and parse ProductDetails if necessary
    let productDetails;
    try {
      productDetails = typeof ProductDetails === 'string' ? JSON.parse(ProductDetails) : ProductDetails;
    } catch (error) {
      return res.status(400).json({ error: 'Invalid JSON format in ProductDetails' });
    }

    // Ensure the parsed data is in the expected format
    if (!productDetails.products || !Array.isArray(productDetails.products)) {
      return res.status(400).json({ error: 'Invalid ProductDetails format' });
    }

    // Insert order details
    const newOrderDetails = await OrderDetail.create({
      OrderID,
      ProductDetails: JSON.stringify(productDetails) // Save as a JSON string if needed
    });

    res.status(201).json(newOrderDetails);
  } catch (error) {
    console.error('Failed to add order details:', error);
    res.status(500).json({ error: error.message });
  }
});


router.put('/update/:OrderDetailID', async (req, res) => {
  console.log('OrderDetailID',req.params.OrderDetailID)
  console.log('PRODUCTS',req.body)
  console.log('called')
  try {
    const order = await OrderDetail.findByPk(req.params.OrderDetailID);
    if (order) {
      await order.update(req.body);
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// router.put('/update/:OrderDetailID', async (req, res) => {
//   const { OrderDetailID } = req.params;
//   const { Quantity, Price } = req.body; // Add other fields as needed

//   console.log(`Update request received for OrderDetailID: ${OrderDetailID}`);
//   console.log('Request body:', req.body);

//   try {
//     // Find the order detail by ID
//     const orderDetail = await OrderDetail.findByPk(OrderID);

//     if (orderDetail) {
//       // Update the order detail
//       await orderDetail.update({
//         Quantity,
//         Price, // Update other fields as needed
//       });

//       res.json({ message: 'Order detail updated successfully', orderDetail });
//     } else {
//       res.status(404).json({ error: 'Order detail not found' });
//     }
//   } catch (err) {
//     console.error('Error updating order detail:', err);
//     res.status(500).json({ error: 'Failed to update order detail' });
//   }
// });


module.exports = router;
