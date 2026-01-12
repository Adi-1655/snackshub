const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, checkOrdering } = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getSettings);
router.get('/check-ordering', checkOrdering);
router.put('/', protect, admin, updateSettings);

module.exports = router;
