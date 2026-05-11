const express = require('express');
const router = express.Router();
const Product = require('../models-dynamodb/Product');
const { upload, uploadToS3, S3_CONFIG } = require('../config/s3');
const { v4: uuidv4 } = require('uuid');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, category, sizes, colors, stock, images: bodyImages, isActive } = req.body;
    
    let imageUrls = [];
    
    // 1. Handle pre-uploaded URLs from body (sent as JSON from frontend)
    if (bodyImages) {
      if (Array.isArray(bodyImages)) {
        imageUrls = [...bodyImages];
      } else {
        try {
          imageUrls = JSON.parse(bodyImages);
        } catch (e) {
          imageUrls = [bodyImages];
        }
      }
    }

    // 2. Handle direct file uploads if any
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await uploadToS3(file, S3_CONFIG.FOLDERS.PRODUCTS);
        imageUrls.push(uploadResult.fileUrl);
      }
    }

    const productData = {
      name,
      description,
      price: parseFloat(price) || 0,
      category: category || 'General',
      images: imageUrls,
      sizes: Array.isArray(sizes) ? sizes : (sizes ? JSON.parse(sizes) : []),
      colors: Array.isArray(colors) ? colors : (colors ? JSON.parse(colors) : []),
      stock: parseInt(stock) || 0,
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true
    };

    const product = await Product.create(productData);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { name, description, price, category, sizes, colors, stock, isActive, images: bodyImages, existingImages } = req.body;
    
    let imageUrls = [];

    // 1. Handle images from body (could be new URLs or existing ones)
    if (bodyImages) {
      if (Array.isArray(bodyImages)) {
        imageUrls = [...bodyImages];
      } else {
        try {
          imageUrls = JSON.parse(bodyImages);
        } catch (e) {
          imageUrls = [bodyImages];
        }
      }
    } else if (existingImages) {
      // Fallback for older frontend logic
      imageUrls = Array.isArray(existingImages) ? existingImages : JSON.parse(existingImages);
    } else {
      // Default to current images if nothing provided
      imageUrls = [...(product.images || [])];
    }
    
    // 2. Handle new direct file uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await uploadToS3(file, S3_CONFIG.FOLDERS.PRODUCTS);
        imageUrls.push(uploadResult.fileUrl);
      }
    }

    const updateData = {
      name: name !== undefined ? name : product.name,
      description: description !== undefined ? description : product.description,
      price: price !== undefined ? parseFloat(price) : product.price,
      category: category !== undefined ? category : product.category,
      images: imageUrls,
      sizes: sizes !== undefined ? (Array.isArray(sizes) ? sizes : JSON.parse(sizes)) : product.sizes,
      colors: colors !== undefined ? (Array.isArray(colors) ? colors : JSON.parse(colors)) : product.colors,
      stock: stock !== undefined ? parseInt(stock) : product.stock,
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : product.isActive
    };

    await product.update(updateData);
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.delete();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
