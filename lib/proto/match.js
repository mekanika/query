
var MatchContainer = require('../match/MatchContainer'),
  operators = require('../match/operators');

/**
  Setup exports reference
*/

module.exports = exports;


/**
  A 'where' constraint setting up a core 'field' and optional 'value'

  Subsequent modifications are handled by modifier operators, gt(), eq() etc.

  @param {String} field The name of the field to constrain
  @param {Mixed} [val] Optional value to constrain. Default operator is 'eq'.
  @public
*/


var _mo = function (boolop, field, val) {
  // Creates a new `.match` field if needed
  if (!this.qe.match) this.qe.match = new MatchContainer(boolop);

  // Adds the new match operator (or partial)
  this.qe.match.add(field, val);

  return this;
};


/**
  Setup a new 'AND' match object under `.match`

  @param {String} field
  @param {Mixed} [val]

  @return {Query}
*/

exports.where =
exports.and = function (field, val) {
  return _mo.call( this, 'and', field, val );
};


/**
  Setup a new 'OR' match object under `.match`

  @param {String} field
  @param {Mixed} [val]

  @return {Query}
*/

exports.or = function (field, val) {
  return _mo.call( this, 'or', field, val );
};

/**
  Adds the match operators to the export
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
