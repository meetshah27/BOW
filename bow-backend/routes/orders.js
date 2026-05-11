const express = require('express');
const router = express.Router();
const Order = require('../models-dynamodb/Order');

// GET /api/orders - Get all orders (Admin only)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll();
    // Sort by date (newest first)
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/user/:userIdOrEmail - Get orders for a specific user
router.get('/user/:userIdOrEmail', async (req, res) => {
  try {
    const { userIdOrEmail } = req.params;
    let orders;
    
    if (userIdOrEmail.includes('@')) {
      // Looks like an email
      orders = await Order.findByCustomerEmail(userIdOrEmail);
    } else {
      // Try by userId
      orders = await Order.findByUserId(userIdOrEmail);
    }
    
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
});

// GET /api/orders/:id - Get a single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// PUT /api/orders/:id/status - Update order status (Admin only)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    await order.update({ status });
    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
