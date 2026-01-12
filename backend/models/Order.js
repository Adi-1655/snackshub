const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        image: { type: String },
      },
    ],
    deliveryDetails: {
      hostelName: {
        type: String,
        required: true,
      },
      roomNumber: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'UPI'],
      required: true,
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    isCancellable: {
      type: Boolean,
      default: true,
    },
    cancelledAt: {
      type: Date,
    },
    cancelReason: {
      type: String,
    },
    deliveredAt: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-update isCancellable based on order status
orderSchema.pre('save', function () {
  if (this.orderStatus === 'Preparing' || this.orderStatus === 'Out for Delivery' || this.orderStatus === 'Delivered') {
    this.isCancellable = false;
  }
});

module.exports = mongoose.model('Order', orderSchema);
