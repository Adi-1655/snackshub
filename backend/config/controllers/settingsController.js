const Settings = require('../models/Settings');

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();

    Object.keys(req.body).forEach((key) => {
      if (settings[key] !== undefined) {
        settings[key] = req.body[key];
      }
    });

    await settings.save();

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Check if ordering is allowed
// @route   GET /api/settings/check-ordering
// @access  Public
exports.checkOrdering = async (req, res) => {
  try {
    const settings = await Settings.getSettings();

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const isAllowed =
      settings.isOrderingEnabled &&
      !settings.maintenanceMode &&
      currentTime >= settings.orderStartTime &&
      currentTime <= settings.orderEndTime;

    res.json({
      success: true,
      data: {
        isAllowed,
        currentTime,
        orderStartTime: settings.orderStartTime,
        orderEndTime: settings.orderEndTime,
        isOrderingEnabled: settings.isOrderingEnabled,
        maintenanceMode: settings.maintenanceMode,
        maintenanceMessage: settings.maintenanceMessage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
