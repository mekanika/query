
var operators = require('./operators');


/**
  Expose constructor
*/

module.exports = MatchContainer;


/**
  @constructor
*/

function MatchContainer(op) {
  op || (op = 'and');
  // Overwrites one of the operators
  this[ op ] = [];
}


/**
  Helper: Rename last key found on an object. Useful to rename single key obj

  @param {Object} obj
  @param {String} newKey

  @private
*/

var _renameSoloKey = function (obj, newKey) {
  var oldkey = Object.keys( obj )[0];
  obj[ newKey ] = obj[ oldkey ];
  delete obj[ oldkey ];
};


/**
  Adds a new Match object 'mo' to the match container
*/

MatchContainer.prototype.add = function (field, val, op) {
  // Setup match object
  var mo = {};
  mo[field] = {};

  // Apply a provided operator if any
  if (op) mo[field][op] = val;
  else mo[field] = {eq: val};

  // Add the `mo` to the stack
  this[ Object.keys( this )[0] ].push( mo );

  return this;
};


/**
  Chain match objects
*/

MatchContainer.prototype.where = function (field, val) {
  return this.add( field, val );
};


/**
  Overwrites the 'or' method (ie. can only be used once)
*/

MatchContainer.prototype.or = function (field, val) {
  // Switch the `mc` operator to OR
  _renameSoloKey( this, 'or' );

  // Add a new match object condition
  this.add( field, val );

  return this;
};


/**
  Chain match operators
*/

operators( MatchContainer.prototype );
