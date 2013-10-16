
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

  // Model fields to return from service identifier (empty array implies ALL)
  this.fields = [];

  // User input values/data to action
  this.inputs = [];

  // Modifiers
  this.modifiers = [];

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
