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

// GET /api/orders/:id/receipt - Get HTML receipt for a single order
router.get('/:id/receipt', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const { EmailService } = require('../config/ses');
    
    // Format the address if it's an object
    let shippingAddress = order.shippingAddress;
    if (typeof shippingAddress === 'object' && shippingAddress !== null) {
      const parts = [];
      if (shippingAddress.addressLine1) parts.push(shippingAddress.addressLine1);
      if (shippingAddress.addressLine2) parts.push(shippingAddress.addressLine2);
      
      let cityStateZip = [];
      if (shippingAddress.city) cityStateZip.push(shippingAddress.city);
      if (shippingAddress.state) cityStateZip.push(shippingAddress.state);
      if (shippingAddress.postalCode) cityStateZip.push(shippingAddress.postalCode);
      if (cityStateZip.length > 0) parts.push(cityStateZip.join(', '));
      
      if (shippingAddress.country) parts.push(shippingAddress.country);
      shippingAddress = parts.join('<br>');
    } else if (typeof shippingAddress === 'string') {
      // It might be a JSON string
      try {
        const parsed = JSON.parse(shippingAddress);
        shippingAddress = parsed.addressLine1 ? `${parsed.addressLine1}<br>${parsed.city || ''}, ${parsed.state || ''} ${parsed.postalCode || ''}` : shippingAddress;
      } catch (e) {
        // Just use as is
      }
    }
    
    // Fetch logo from about page settings
    let logoUrl = 'https://bow-platform.s3.amazonaws.com/bow-logo.png';
    try {
      const AboutPage = require('../models-dynamodb/AboutPage');
      const aboutPage = await AboutPage.getSettings();
      if (aboutPage && aboutPage.logo && aboutPage.logo.trim()) {
        const logo = aboutPage.logo.trim();
        if (logo.startsWith('http://') || logo.startsWith('https://')) {
          logoUrl = logo;
        } else {
          // In case it's a relative URL, try to make it absolute if S3 bucket is known
          const s3BucketUrl = process.env.AWS_S3_BUCKET ? `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION || 'us-west-2'}.amazonaws.com/` : '';
          if (s3BucketUrl) {
            logoUrl = logo.startsWith('/') ? `${s3BucketUrl}${logo.substring(1)}` : `${s3BucketUrl}${logo}`;
          }
        }
      }
    } catch (logoErr) {
      console.error('[Orders] Error fetching logo:', logoErr);
    }

    const orderData = {
      customerName: order.customerName || 'Customer',
      items: order.items || [],
      totalAmount: order.totalAmount,
      paymentId: order.paymentIntentId || order.id,
      shippingAddress: shippingAddress || 'N/A',
      logoUrl
    };
    
    const htmlReceipt = EmailService.getOrderConfirmationTemplate(orderData);
    
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlReceipt);
  } catch (error) {
    console.error('Error generating receipt:', error);
    res.status(500).json({ error: 'Failed to generate receipt' });
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
