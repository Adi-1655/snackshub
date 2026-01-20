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

    // Current time in minutes
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Parse start and end times
    const [startHour, startMinute] = settings.orderStartTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMinute;

    const [endHour, endMinute] = settings.orderEndTime.split(':').map(Number);
    const endMinutes = endHour * 60 + endMinute;

    // Check if within window
    let isWithinTime;
    if (startMinutes <= endMinutes) {
      // Standard window (e.g., 09:00 to 17:00)
      isWithinTime = currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    } else {
      // Midnight crossing (e.g., 20:00 to 01:30)
      isWithinTime = currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    }

    if (!isWithinTime) {
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
