/**
 * Setup exports references
 */

module.exports = exports;


/**
 * Flags the `field` to be modified (optionally to the specified `value`)
 *
 * @param {String} field The name of the field to modify
 * @param {Mixed} [value] Optional value to set the field
 * @public
 *
 * @returns {Query}
 */

exports.set = function( field, value ) {
  if (!field || typeof field !== 'string')
    throw new Error( 'query#set( field ) field must be a string' );

  // Force action to update
  this.action = 'update';

  var mod = {set: field};
  if (typeof value !== 'undefined') mod.value = value;
  this.modifiers.push( mod );

  return this;
};


/**
 *
 *
 * @returns {Query}
 */

exports.to = function( value ) {

  if (this.modifiers.length < 1)
    throw new Error( 'Must specify query#set( field ) before calling .to()' );

  // Apply value set to the last modifier in the queue
  this.modifiers[ this.modifiers.length - 1 ].value = value;

  return this;
};


/**
 *
 *
 * @returns {Query}
 */

exports.unset = function( field ) {
  if (!field || typeof field !== 'string')
    throw new Error( 'query#unset( field ) field must be a string' );

  // Force action to update
  this.action = 'update';

  var mod = {unset: field};
  this.modifiers.push( mod );

  return this;
};


/**
 *
 *
 * @returns {Query}
 */

exports.rename = function( field, to ) {
  if (!field || typeof field !== 'string')
    throw new Error( 'query#rename( field ) field must be a string' );

  // Force action to update
  this.action = 'update';

  var mod = {rename: field};
  if (typeof to !== 'undefined') {
    if (typeof to !== 'string')
      throw new Error( 'Renamed field must be of type string' );

    mod.value = to;
  }

  this.modifiers.push( mod );

  return this;
};


/**
 *
 *
 * @returns {Query}
 */

exports.increment =
exports.increase = function( field, amount ) {
  if (!field || typeof field !== 'string')
    throw new Error( 'Modifier field must be a string' );

  // Force action to update
  this.action = 'update';

  var mod = {inc: field};
  if (typeof amount !== 'undefined') {
    if (typeof amount !== 'number')
      throw new Error( 'Modifying a field value must be a number' );

    mod.value = amount;
  }

  this.modifiers.push( mod );

  return this;
};


/**
 * Shorthand method to apply a negative increment of `value`
 *
 * Requires `amount` parameter (unlike `.increment()`)
 *
 * @param {String} field The name of the field to modify
 * @param {Number} amount Value to decrement the field by
 * @public
 *
 * @returns {Query}
 */

exports.decrement =
exports.decrease = function( field, amount ) {
  if (typeof amount === 'undefined')
    throw new Error( 'Decrement modifiers must provide a valid `value`' );

  if (typeof amount !== 'number')
    throw new Error( 'Modifying a field value must be a number' );

  return exports.increment.call( this, field, -amount );
};


/**
 * Set the amount to modify the `.increment(field)` by
 *
 * @param {Number} amount Value to modify the field by
 * @public
 *
 * @returns {Query}
 */

exports.by = function( amount ) {
  if (this.modifiers.length < 1)
    throw new Error( 'Must specify query#set( field ) before calling .to()' );

  if (typeof amount !== 'number')
    throw new Error( 'Modifying a field value must be a number' );

  // Apply value set to the last modifier in the queue
  this.modifiers[ this.modifiers.length - 1 ].value = amount;

  return this;
};
