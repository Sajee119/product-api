const Product = require('../models/Product');

// @desc    Get all products with pagination, search and sorting
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search,
      category,
      sort,
      minPrice,
      maxPrice,
    } = req.query;

    // Enforce max limit of 100
    const pageLimit = Math.min(parseInt(limit, 10) || 50, 100);
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (pageNumber - 1) * pageLimit;

    // Build filter query
    const filter = {};

    if (search) {
      filter.$text = { $search: search };
    }

    if (category) {
      filter.category = { $regex: new RegExp(category, 'i') };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = parseFloat(maxPrice);
    }

    // Build sort options
    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(pageLimit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageLimit),
      limit: pageLimit,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    if (error.name === 'CastError') {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid product ID' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Public
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    // Basic input validation
    if (!name || name.trim() === '') {
      return res
        .status(400)
        .json({ success: false, message: 'Product name is required' });
    }
    if (price === undefined || price === null) {
      return res
        .status(400)
        .json({ success: false, message: 'Product price is required' });
    }
    if (isNaN(price) || price < 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Price must be a non-negative number' });
    }

    const product = await Product.create({
      name: name.trim(),
      description,
      price,
      category,
      stock,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    // Basic validation on provided fields
    if (price !== undefined && (isNaN(price) || price < 0)) {
      return res
        .status(400)
        .json({ success: false, message: 'Price must be a non-negative number' });
    }
    if (stock !== undefined && (isNaN(stock) || stock < 0)) {
      return res
        .status(400)
        .json({ success: false, message: 'Stock must be a non-negative number' });
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (description !== undefined) updateFields.description = description;
    if (price !== undefined) updateFields.price = price;
    if (category !== undefined) updateFields.category = category;
    if (stock !== undefined) updateFields.stock = stock;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).lean();

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    if (error.name === 'CastError') {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid product ID' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id).lean();

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid product ID' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
