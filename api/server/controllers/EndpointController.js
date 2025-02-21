const { getEndpointsConfig } = require('~/server/services/Config');

async function endpointController(req, res) {
  const endpointsConfig = await getEndpointsConfig(req);
  // Use filtered ModelSpecs if available
  if (req.modelSpecs) {
    endpointsConfig.modelSpecs = req.modelSpecs;
  }
  res.send(JSON.stringify(endpointsConfig));
}

module.exports = endpointController;
