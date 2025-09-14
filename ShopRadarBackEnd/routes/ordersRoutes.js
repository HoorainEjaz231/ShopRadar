const express = require('express');
const router = express.Router();
const Order = require('../modals/Order');
const OrderDetail = require('../modals/OrderDetail');
const Rating = require('../modals/Rating')
const Vendor = require('../modals/Vendor')
const { Op } = require('sequelize');
const moment = require('moment');  // Import moment here

//Vendor Income 
router.get('/VendorIncome/:VendorID', async (req, res) => {
  try {
    const vendorID = req.params.VendorID;
    const today = moment().startOf('day');
    const tomorrow = moment().add(1, 'days').startOf('day');
    
    console.log("Fetching orders for VendorID:", vendorID);

    // Fetch all relevant orders
    const orders = await Order.findAll({
      where: { 
        VendorID: vendorID, 
        [Op.or]: [
          { OrderStatus: 'Delivered' },
          { OrderStatus: 'Cancelled' }
        ]
      },
      attributes: ['OrderID', 'DeliveryAddress', 'OrderStatus', 'OrderPrice', 'OrderDate'],
      order: [['OrderDate', 'DESC']]
    });

    console.log("Orders fetched:", orders);

    const groupedOrders = {
      today: [],
      tomorrow: [], 
      others: {},
      incomes: {}  // Object to store daily incomes
    };

    orders.forEach(order => {
      const orderDate = moment(order.OrderDate).startOf('day');
      const dateString = orderDate.format('DD/MM/YYYY');

      // Calculate daily income only for delivered orders
      if (order.OrderStatus === 'Delivered') {
        if (!groupedOrders.incomes[dateString]) {
          groupedOrders.incomes[dateString] = 0;
        }
        groupedOrders.incomes[dateString] += order.OrderPrice;
      }

      if (orderDate.isSame(today, 'day')) {
        groupedOrders.today.push(order);
      } else if (orderDate.isSame(tomorrow, 'day')) {
        groupedOrders.tomorrow.push(order);
      } else {
        if (!groupedOrders.others[dateString]) {
          groupedOrders.others[dateString] = [];
        }
        groupedOrders.others[dateString].push(order);
      }
    });

    console.log("Grouped Orders:", groupedOrders);

    res.json(groupedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



//Rider Income
router.get('/RiderIncome/:RiderID', async (req, res) => {
  try {
      const riderID = req.params.RiderID;
      const today = moment().startOf('day');
      const tomorrow = moment().add(1, 'days').startOf('day');
      
      console.log("Fetching orders for RiderID:", riderID);

      const orders = await Order.findAll({
          where: { 
              RiderID: riderID, OrderStatus:'Delivered'
          },
          attributes: ['OrderID', 'DeliveryAddress', 'OrderStatus', 'DeliveryFee', 'OrderDate'],
          order: [['OrderDate', 'DESC']]
      });

      console.log("Orders fetched:", orders);
      
      const groupedOrders = {
          today: [],
          tomorrow: [],
          others: {},
          incomes: {}  // New object to store daily incomes
      };

      orders.forEach(order => {
          const orderDate = moment(order.OrderDate).startOf('day');

          const dateString = orderDate.format('DD/MM/YYYY');

          // Calculate daily income
          if (!groupedOrders.incomes[dateString]) {
              groupedOrders.incomes[dateString] = 0;
          }
          groupedOrders.incomes[dateString] += order.DeliveryFee;

          if (orderDate.isSame(today, 'day')) {
              groupedOrders.today.push(order);
          } else if (orderDate.isSame(tomorrow, 'day')) {
              groupedOrders.tomorrow.push(order);
          } else {
              if (!groupedOrders.others[dateString]) {
                  groupedOrders.others[dateString] = [];
              }
              groupedOrders.others[dateString].push(order);
          }
      });

      console.log("Grouped Orders:", groupedOrders);

      res.json(groupedOrders);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/upcoming/:vendorId', async (req, res) => {
  const vendorId = req.params.vendorId;
  try {
    const orders = await Order.findAll({
      where: {
        VendorID: vendorId,
        OrderStatus: { [Op.ne]: 'PickedUP' } // Exclude orders with 'PickedUP' status
      }
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

router.get('/customer/:customerId', async (req, res) => {
  const { customerId } = req.params;

  try {
    // Log the incoming customerId to debug
    console.log(`Searching for orders with CustomerID: ${customerId}`);

    // Fetch orders by CustomerID
    const orders = await Order.findAll({
      where: {
        CustomerID: customerId,
        OrderStatus: ['pending', 'accepted', 'PickedUp', 'AtVendor','PickUp']
      },
      include: [
        {
          model: Vendor,
          attributes: ['BusinessName','Image','Latitude','Longitude','Contact','Market','CompanyAddress'],
        },
      ]
    });

    // Check if any orders are found
    if (orders.length > 0) {
      res.json(orders);
    } else {
      res.status(404).json({ error: 'No orders found for this CustomerID' });
    }
  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ error: error.message });
  }
});



router.get('/customer-orders/:CustomerID', async (req, res) => {

  const { CustomerID } = req.params;
  try {
    const orders = await Order.findAll({
      where: { CustomerID ,OrderStatus:['Delivered','Cancelled']},
      include: [
        {
          model: Vendor,
          attributes: ['BusinessName','Image'],
        }, 
        {
          model: OrderDetail,
          attributes: ['OrderDetailID', 'ProductDetails'],
        },
        {
          model:Rating,
          attributes: ['Rating','RatingDate']
        }
      ],
    });

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this customer' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching customer orders:', error.message, error.stack);

    res.status(500).json({ error: 'Unable to fetch customer orders' });
  }
});

// Get pending orders
router.get('/all', async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { OrderStatus: 'pending' ,VanAccept: true}
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  const  {id}  = req.params;

  try {
    // Log the incoming ID to debug
    console.log('Searching for order with ID:',id);

    // Fetch the order by primary key
    const order = await Order.findByPk(id);

    // Check if the order exists
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching order:', error.message);
    res.status(500).json({ error: error.message });
  }
});


// Update order status
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
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

router.post('/', async (req, res) => {
  try {
      const { CustomerID, VanAccept,VendorID,DeliveryType, RiderID,DeliveryFee,OrderPrice, OrderDate, DeliveryAddress, OrderStatus, isDelivered ,CustLatitude,CustLongitude} = req.body;

      // Create the order
      const newOrder = await Order.create({
          CustomerID,
          VendorID,
          RiderID,
          OrderDate,
          DeliveryAddress,
          OrderStatus,
          isDelivered,
          CustLatitude,
          CustLongitude,
          OrderPrice,
          DeliveryFee,
          VanAccept,
          DeliveryType
      });

      res.status(201).json(newOrder);
  } catch (error) {
      console.error(error);
      res.status(500).json({
          error: error.message,
          details: error
      });
  }
});

router.get('/orders/:customerId', async (req, res) => {
  try {
      const customerId = req.params.customerId;

      // Fetch orders
      const orders = await Order.findAll({
          where: { CustomerID: customerId },
          include: [
              {
                  model: OrderDetail,
                  as: 'orderDetails',
                  attributes: ['OrderDetailID', 'ProductDetails']
              },
              {
                  model: Rating,
                  as: 'ratings',
                  attributes: ['RatingID', 'Rating', 'OrderID']
              }
          ]
      });

      res.json(orders);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/admin/allOrders', async (req, res) => {
  console.log('all Orders Called')
  try {
    const order = await Order.findAll();
    res.json(order);
  } catch (error) {
    console.error('Error fetching Orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router;