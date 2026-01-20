const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    orderStartTime: {
      type: String,
      required: true,
      default: '08:00',
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format'],
    },
    orderEndTime: {
      type: String,
      required: true,
      default: '23:00',
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format'],
    },
    maxOrdersPerDay: {
      type: Number,
      default: 3,
      min: 1,
    },
    maxItemsPerOrder: {
      type: Number,
      default: 10,
      min: 1,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFreeDelivery: {
      type: Boolean,
      default: true,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isOrderingEnabled: {
      type: Boolean,
      default: true,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    maintenanceMessage: {
      type: String,
      default: 'We are currently under maintenance. Please check back later.',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
