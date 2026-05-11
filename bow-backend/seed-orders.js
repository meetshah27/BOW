const Order = require('./models-dynamodb/Order');

async function seedOrders() {
  const sampleOrders = [
    {
      customerName: 'Meet Shah',
      customerEmail: 'meet@example.com',
      totalAmount: 45.99,
      status: 'paid',
      items: [
        { name: 'BOW Official T-Shirt', price: 25.00, quantity: 1, size: 'L', color: 'Black' },
        { name: 'BOW Cap', price: 20.99, quantity: 1 }
      ],
      shippingAddress: {
        addressLine1: '123 Music Ave',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        country: 'USA'
      },
      createdAt: new Date(Date.now() - 86400000).toISOString() // Yesterday
    },
    {
      customerName: 'Gaurav Khandekar',
      customerEmail: 'gaurav@example.com',
      totalAmount: 25.00,
      status: 'shipped',
      items: [
        { name: 'BOW Official T-Shirt', price: 25.00, quantity: 1, size: 'M', color: 'White' }
      ],
      shippingAddress: {
        addressLine1: '456 Tech St',
        city: 'Redmond',
        state: 'WA',
        postalCode: '98052',
        country: 'USA'
      },
      createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    }
  ];

  for (const orderData of sampleOrders) {
    try {
      await Order.create(orderData);
      console.log(`✅ Seeded order for ${orderData.customerName}`);
    } catch (error) {
      console.error(`❌ Error seeding order for ${orderData.customerName}:`, error);
    }
  }
}

seedOrders();
