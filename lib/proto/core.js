
/**
 * Setup exports reference
 */

module.exports = exports;


/**
 * Set an explicit adapter reference, where `adapter` is an Adapter instance
 *
 * @param {Adapter} adapter An adapter instance eg. require('mekanika-mongo')
 * @public
 */
//
exports.useAdapter = function( adapter ) {
  this.adapter = adapter;

  // Enable chaining `.adapter( adptr )` calls
  return this;
};


/**
 * Specify fields to return as object
 *
 * .from('User').select( 'name', 'age' )
 * # Only returns the 'name' and 'age' fields
 * # -> { name: 'Jake the Dog', age: 28 }
 *
 * @param {String...} field A named field to project the returned object onto
 * @public
 */

exports.select = function( /* fields, field2, ... */ ) {
  if (!arguments.length)
    throw new Error('Query#select(fields...) requires fields');

  // Decompose paramters into `this.fields` array
  for (var i=0; i<arguments.length; i++) {
    arguments[i] instanceof Array
      ? this.fields = this.fields.concat( arguments[i] )
      : this.fields.push( arguments[i] );
  }

  return this;
};


/**
 * Active resource selector
 *
 * @param {String} resource The identifier for the resource to query
 * @public
 */

exports.from = function( resource ) {
  if (typeof resource !== 'string')
    throw new Error('Query#from(resource) requires `resource` as a string');

  this.resource = resource;

  return this;
};
