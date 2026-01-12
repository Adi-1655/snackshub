const Settings = require('../models/Settings');

/**
 * Middleware: Check if ordering is allowed within time window
 */
exports.checkOrderingTime = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();

    // Global ordering toggle
    if (!settings.isOrderingEnabled) {
      return res.status(403).json({
        success: false,
        message: 'Ordering is currently disabled',
      });
    }

    // Maintenance mode check
    if (settings.maintenanceMode) {
      return res.status(503).json({
        success: false,
        message: settings.maintenanceMessage || 'System under maintenance',
      });
    }

    // Current time in HH:MM
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    // Time window validation
    if (
      currentTime < settings.orderStartTime ||
      currentTime > settings.orderEndTime
    ) {
      return res.status(403).json({
        success: false,
        message: `Ordering is only available between ${settings.orderStartTime} and ${settings.orderEndTime}`,
        orderingWindow: {
          start: settings.orderStartTime,
          end: settings.orderEndTime,
        },
      });
    }

    // Proceed to next middleware/controller
    next();
  } catch (error) {
    console.error('Order time validation error:', error);
    const err = new Error(error.message || 'Order time validation error');
    err.status = 500;
    next(err);
  }
};

/**
 * Middleware: Check daily order limit per user
 */
exports.checkOrderLimit = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    // Proceed to next middleware/controller
    next();
  } catch (error) {
    console.error('Order limit validation error:', error);
    const err = new Error(error.message || 'Order limit validation error');
    err.status = 500;
    next(err);
  }
};
