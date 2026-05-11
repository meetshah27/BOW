const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLES } = require('./config/dynamodb');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const products = [
  {
    id: '2c07f97c-c9ea-420d-a6c6-dc71b6625838', // Existing T-Shirt ID
    name: 'BOW Official T-Shirt',
    description: 'Premium quality Beats of Washington official t-shirt. Show your support for the community!',
    price: 150,
    category: 'Apparel',
    images: [
      'https://bow-media-storages.s3.us-west-2.amazonaws.com/products/1778457119610_w00qbyz7s3_WhatsApp_Image_2026_05_07_at_7_37_50_PM__1_.jpeg',
      'https://bow-media-storages.s3.us-west-2.amazonaws.com/products/1778457128452_wduc6y74i8_Gemini_Generated_Image_kaj5wmkaj5wmkaj5.png'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black'],
    stock: 100,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {}
  }
];

async function seedProducts() {
  console.log('🌱 Seeding products...');
  
  for (const product of products) {
    try {
      const command = new PutCommand({
        TableName: TABLES.PRODUCTS,
        Item: product
      });
      await docClient.send(command);
      console.log(`✅ Seeded: ${product.name}`);
    } catch (error) {
      console.error(`❌ Failed to seed ${product.name}:`, error.message);
    }
  }
  
  console.log('🎉 Seeding complete!');
}

seedProducts();
