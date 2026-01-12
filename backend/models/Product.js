const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['Chips', 'Biscuits', 'Chocolates', 'Cold Drinks', 'Instant Noodles'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    image: {
      type: String,
      default: '/uploads/default-product.jpg',
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: 0,
      default: 0,
    },
    maxQuantityPerOrder: {
      type: Number,
      default: 5,
      min: 1,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    weight: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for low stock warning
productSchema.virtual('isLowStock').get(function () {
  return this.stock > 0 && this.stock <= 5;
});

module.exports = mongoose.model('Product', productSchema);
