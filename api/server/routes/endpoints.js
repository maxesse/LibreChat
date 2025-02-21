const express = require('express');
const router = express.Router();
const endpointController = require('~/server/controllers/EndpointController');
const overrideController = require('~/server/controllers/OverrideController');
const filterModelSpecsMiddleware = require('~/server/middleware/filterModelSpecs');
const { requireJwtAuth } = require('~/server/middleware');

router.get('/', endpointController);
router.get('/modelspecs', requireJwtAuth, filterModelSpecsMiddleware, endpointController);
router.get('/config/override', overrideController);

module.exports = router;
