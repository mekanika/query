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

  if (typeof field === 'string') {
    // Adds the new match operator (or partial)
    this.qe.match.add(field, val);

  } else {
    // Handle objects being based as `where` conditions
    // Looks like a match condition
    if (field.and || field.or) {
      // Already a MatchContainer
      if (field.add) this.qe.match = field;

      // A plain object - convert into MC format
      else {
        var iop = field.and ? 'and' : 'or';
        field[iop].forEach(function (cond) {
          var prop = Object.keys(cond)[0];
          var op2 = Object.keys(cond[prop])[0];
          var value = cond[prop][op2];
          this.qe.match.add(prop, value, op2);
        }, this);
      }
    } else {
      for (var key in field) this.qe.match.add(key, field[key]);
    }
  }

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
    return _mo.call(this, 'and', field, val);
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
    this.qe.match.or(field, val);
    return this;
  }
  else return _mo.call(this, 'or', field, val);
};

/**
  Adds the match operators to the export (eg. 'eq','in','gte', etc)
*/

operators(exports, true);

/**
  Raw `.match` match container setter.

  Applies the `mc` match container directly to `.match` IF it contains an
  `mc.and` or `mc.or` key - otherwise loads it using `Query.where()` to
  attempt to build a MatchContainer.

  @param {MatchContainer|Object} mc

  @return {Query}
*/

exports.match = function (mc) {
  if (!mc.and && !mc.or) this.where(mc);
  else this.qe.match = mc;

  return this;
};
