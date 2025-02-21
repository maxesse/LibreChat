const { logger } = require('~/config');

/**
 * Filters ModelSpecs based on user group memberships.
 * Models without allowedGroups are considered public and accessible to all users.
 * Models with allowedGroups are only accessible to users who are members of at least one of the allowed groups.
 *
 * @param {Object} modelSpecs - The ModelSpecs configuration object
 * @param {Array<string>} userGroups - Array of group GUIDs the user is a member of
 * @returns {Object} Filtered ModelSpecs configuration
 */
function filterModelSpecs(modelSpecs, userGroups) {
  // Handle invalid input
  if (!modelSpecs) {
    return modelSpecs;
  }

  // If modelSpecs.list is not an array, return as is
  if (!Array.isArray(modelSpecs.list)) {
    return modelSpecs;
  }

  // Filter the list based on group membership
  const filteredList = modelSpecs.list.filter((spec) => {
    // If no allowedGroups specified, model is public
    if (!spec.allowedGroups || !Array.isArray(spec.allowedGroups)) {
      return true;
    }

    // Check if user is member of any allowed group
    return spec.allowedGroups.some((group) => userGroups.includes(group.id));
  });

  return {
    ...modelSpecs,
    list: filteredList,
  };
}

module.exports = filterModelSpecs;