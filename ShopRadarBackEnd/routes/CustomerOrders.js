const express = require('express');
const router = express.Router();

const {Order} = require('../modals/Order')
const {Vendor} = require('../modals/Vendor')
const {OrderDetail} = require('../modals/OrderDetail')

router.get('/customer-orders/:CustomerID', async (req, res) => {
    const { CustomerID } = req.params;
    try {
      const orders = await Order.findAll({
        where: { CustomerID },
        // include: [
        //   {
        //     modal: Vendor,
        //     attributes: ['BusinessName'],
        //   },
        //   {
        //     model: OrderDetail,
        //     attributes: ['OrderDetailID', 'ProductDetails'],
        //   }
        // ],
      });
  
      if (!orders.length) {
        return res.status(404).json({ message: 'No orders found for this customer' });
      }
  
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching customer orders:', error); // Log the error
      res.status(500).json({ error: 'Unable to fetch customer orders' });
    }
  });
  

module.exports = router;
