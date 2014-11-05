/**
  Setup exports references
*/

module.exports = exports;


/**
  Helper method to:
  - setup `qo.updates`
  - set action to 'update'
  - add the update object to qo.updates

  @param {String} field
  @param {String} operator
  @param {Mixed} value

  @throws {Error} When 'field' is not a string

  @private
*/

function _update (field, op, value) {
  if (typeof field !== 'string')
    throw new Error( 'query#'+op+'() field must be a string' );

  this.qo.action = 'update';
  if (!this.qo.updates) this.qo.updates = [];

  var mod = {field:field, op:op, value:value};
  this.qo.updates.push( mod );

  return this;
};


/**
  Update operator 'push'

  @param {String} field
  @param {Mixed} value

  @return {Query}
*/

exports.push = function (field, value) {
  return _update.call(this, field, 'push', value);
};


/**
  Update operator 'pull'

  @param {String} field
  @param {Mixed} value

  @return {Query}
*/

exports.pull = function (field, value) {
  return _update.call(this, field, 'pull', value);
};


/**
  Update operator 'inc'

  @param {String} field
  @param {Mixed} value

  @return {Query}
*/

exports.inc = function (field, value) {
  return _update.call(this, field, 'inc', value);
};


/**
  Convenience 'dec' inverse method for update operator 'inc'.

  @param {String} field
  @param {Mixed} value

  @return {Query}
*/

exports.dec = function (field, value) {
  return _update.call(this, field, 'inc', -value);
};
