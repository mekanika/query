
/**
 * Dependencies
 */

var utils = require( '../utils' );

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
 * @param {String|String[]} field A named field to project the returned object onto
 * @public
 */

exports.select = function( fields ) {
  if (!arguments.length)
    throw new Error('Query#select(fields...) requires fields');

  // Special case: set fields to `null` (adapter to return boolean on complete)
  if (fields === null) return this.fields = null, this;

  // Support "fields with spaces"
  if (typeof fields === 'string') {
    var f = utils.splace( fields );
    this.fields = this.fields.concat( f.add );
    this.excludeFields = this.excludeFields.concat( f.minus );
  }
  else
    // Apply fields array onto `this.fields` array
    this.fields = this.fields.concat( fields );

  return this;
};


/**
 * Specify fields to exclude from results object
 *
 * @example
 * query().exclude( 'name' );
 * query().exclude( ['name', 'age'] );
 * // Or as a space separated string
 * query().exclude( 'name age' );
 *
 * @param {String[]} fields Array of fields to exclude from results
 *
 * @returns this
 */

exports.exclude = function ( fields ) {

  if ( !(fields instanceof Array) && typeof fields !== 'string' )
    throw new Error('Query#exclude(fields) requires fields array or string');

  if (typeof fields === 'string')
    // Invert the `utils.splace` result because we're excluding
    this.excludeFields = this.excludeFields.concat( utils.splace( fields ).add );

  else
    fields.forEach( function(el) { this.excludeFields.push( el ); }, this );

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
