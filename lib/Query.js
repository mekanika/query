
/**
 * The Query object constructor
 *
 * @constructor
 */

module.exports = function Query() {

  // Internal reference to (optional) external adapter
  this.adapter;

  // Query action (verb)
  this.action;

  // Service identifier to act upon
  this.resource;

  // Used to set a string field on which to enforce unique entities (eg. phone)
  this.unique;

  // Unique ids on the resource
  this.identifiers = [];

  // Model fields to return or exclude from resource
  this.fields = [];
  this.excludeFields = [];

  // User input values/data to action
  this.inputs = [];

  // Modifiers
  this.modifiers = [];

  this.display = {
    limit: 0,
    offset: 0
  };

  // Sort ordering - `{direction: $dir, index: $index}`
  this.sort = [];

  this.constraints = [];

  // Relation fields to auto-load
  this.includes = [];

  // Pre and Post event middleware
  this.middleware = {
    pre: {},
    post: {}
  };

  return this;
};
