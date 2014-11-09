
var MatchContainer = require('../match/MatchContainer'),
  operators = require('../match/operators');

/**
  Setup exports reference
*/

module.exports = exports;



/**
  Helper to set match containers and objects

  @param {String} boolop The boolean operator to use on the MatchContainer
  @param {String} field
  @param {Mixed} [val]

  @return {Query}
  @private
*/

var _mo = function (boolop, field, val) {
  // Creates a new `.match` field if needed
  if (!this.qe.match) this.qe.match = new MatchContainer(boolop);

  // Adds the new match operator (or partial)
  this.qe.match.add(field, val);

  return this;
};



/**
  A 'where' condition (defaults to boolean AND operator)

  May apply match operator methods (eg. `.gt(5)`, `.not('1')`)

  @param {String} field The name of the field to match
  @param {Mixed} [val] Optional value to match. Default operator is 'eq'.

  @return {Query}
  @public
*/

exports.where =
exports.and = function (field, val) {
  return _mo.call( this, 'and', field, val );
};


/**
  A boolean OR match object. Converts an existing 'AND' to 'OR'

  May apply match operator methods (eg. `.gt(5)`, `.not('1')`)

  @param {String} field The name of the field to match
  @param {Mixed} [val] Optional value to match. Default operator is 'eq'.

  @return {Query}
  @public
*/

exports.or = function (field, val) {
  if (this.qe.match) {
    this.qe.match.or( field, val );
    return this;
  }
  else return _mo.call( this, 'or', field, val );
};


/**
  Adds the match operators to the export (eg. 'eq','in','gte', etc)
*/

operators( exports, true );


/**
  Raw `.match` match container setter.

  Applies the `mc` match container directly to `.match`

  @param {MatchContainer} mc

  @return {Query}
*/

exports.match = function (mc) {
  this.qe.match = mc;
  return this;
};
