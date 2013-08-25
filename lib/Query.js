
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

  // Unique ids on the resource
  this.identifiers = [];

  // Model fields to return from service identifier (empty array implies ALL)
  this.fields = [];

  // User input values/data to action
  this.inputs = [];

  this.paging = {
    limit: 0,
    offset: 0,
    sort: [{ direction:0, index:0 }]
  };

  this.constraints = [];

  // Relation fields to auto-load
  this.includes = [];

  return this;
};
