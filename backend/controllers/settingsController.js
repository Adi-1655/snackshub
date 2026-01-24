const Settings = require('../models/Settings');

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne();
        if (settings) {
            res.json({ success: true, data: settings });
        } else {
            // Return default settings if none exist
            res.json({ success: true, data: { orderingEnabled: true, message: '' } });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    try {
        const {
            orderStartTime,
            orderEndTime,
            deliveryCharge,
            minOrderAmount,
            isOrderingEnabled,
            maintenanceMode,
            maintenanceMessage,
            isFreeDelivery,
            offerImages,
        } = req.body;

        let settings = await Settings.findOne();

        if (settings) {
            settings.orderStartTime = orderStartTime || settings.orderStartTime;
            settings.orderEndTime = orderEndTime || settings.orderEndTime;
            settings.deliveryCharge = deliveryCharge !== undefined ? deliveryCharge : settings.deliveryCharge;
            settings.minOrderAmount = minOrderAmount !== undefined ? minOrderAmount : settings.minOrderAmount;
            settings.isOrderingEnabled = isOrderingEnabled !== undefined ? isOrderingEnabled : settings.isOrderingEnabled;
            settings.maintenanceMode = maintenanceMode !== undefined ? maintenanceMode : settings.maintenanceMode;
            settings.maintenanceMessage = maintenanceMessage || settings.maintenanceMessage;
            settings.isFreeDelivery = isFreeDelivery !== undefined ? isFreeDelivery : settings.isFreeDelivery;
            settings.offerImages = offerImages || settings.offerImages;

            const updatedSettings = await settings.save();
            res.json({ success: true, data: updatedSettings });
        } else {
            settings = new Settings({
                orderStartTime,
                orderEndTime,
                deliveryCharge,
                minOrderAmount,
                isOrderingEnabled,
                maintenanceMode,
                maintenanceMessage,
                isFreeDelivery,
                offerImages,
            });
            const createdSettings = await settings.save();
            res.json({ success: true, data: createdSettings });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Check ordering status
// @route   GET /api/settings/check-ordering
// @access  Public
const checkOrdering = async (req, res) => {
    try {
        const settings = await Settings.findOne();

        if (!settings) {
            return res.json({ success: true, data: { isAllowed: true } });
        }

        if (settings.maintenanceMode) {
            return res.json({
                success: true,
                data: { isAllowed: false, message: settings.maintenanceMessage }
            });
        }

        if (!settings.isOrderingEnabled) {
            return res.json({
                success: true,
                data: { isAllowed: false, message: 'Ordering is currently disabled.' }
            });
        }

        // Check time window
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const [startHour, startMinute] = settings.orderStartTime.split(':').map(Number);
        const startTime = startHour * 60 + startMinute;

        const [endHour, endMinute] = settings.orderEndTime.split(':').map(Number);
        const endTime = endHour * 60 + endMinute;

        let isWithinTime;
        if (startTime <= endTime) {
            // Standard window (e.g., 09:00 to 17:00)
            isWithinTime = currentTime >= startTime && currentTime <= endTime;
        } else {
            // Crossing midnight (e.g., 20:00 to 02:00)
            isWithinTime = currentTime >= startTime || currentTime <= endTime;
        }

        if (!isWithinTime) {
            return res.json({
                success: true,
                data: {
                    isAllowed: false,
                    message: `Ordering is only available between ${settings.orderStartTime} and ${settings.orderEndTime}.`
                }
            });
        }

        res.json({
            success: true,
            data: { isAllowed: true, message: '' }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getSettings,
    updateSettings,
    checkOrdering
};
