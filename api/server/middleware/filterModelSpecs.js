const filterModelSpecs = require('~/server/services/Config/filterModelSpecs');
const { logger } = require('~/config');

/**
 * Middleware to filter ModelSpecs based on user groups
 */
async function filterModelSpecsMiddleware(req, res, next) {
  try {
    const { user } = req;
    const { modelSpecs } = req.app.locals;

    if (!modelSpecs || !modelSpecs.list) {
      return next();
    }

    // Compute filtered list directly
    const userGroups = user?.entraGroups ?? [];
    const filteredSpecs = filterModelSpecs(modelSpecs, userGroups);

    // Set the filtered specs for this request
    req.modelSpecs = filteredSpecs;
    next();
  } catch (error) {
    logger.error('[filterModelSpecs] Error in middleware:', error);
    // Don't fail the request if filtering fails, just pass through unfiltered specs
    next();
  }
}

module.exports = filterModelSpecsMiddleware;