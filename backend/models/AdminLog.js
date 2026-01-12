const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'LOGIN',
        'LOGOUT',
        'CREATE_PRODUCT',
        'UPDATE_PRODUCT',
        'DELETE_PRODUCT',
        'UPDATE_ORDER_STATUS',
        'UPDATE_SETTINGS',
        'CREATE_USER',
        'UPDATE_USER',
        'DELETE_USER',
      ],
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AdminLog', adminLogSchema);
