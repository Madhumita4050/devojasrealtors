const express = require('express');
const router = express.Router();
const { getPublicPlots, getPublicPlotDetail, submitPublicEnquiry } = require('../controllers/publicController');

// NO auth middleware here on purpose — this is meant for the public/marketing website
router.get('/plots', getPublicPlots);
router.get('/plots/:id', getPublicPlotDetail);
router.post('/enquiries', submitPublicEnquiry);

module.exports = router;
