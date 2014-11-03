
/**
  Setup exports reference
*/

module.exports = exports;


/**
  Set an explicit adapter reference, where `adapter` is an Adapter instance

  @param {Adapter} adapter An adapter instance eg. require('mekanika-mongo')
  @public
*/

exports.useAdapter = function( adapter ) {
  this.adapter = adapter;

  // Enable chaining `.adapter( adptr )` calls
  return this;
};


/**
  Helper method to add split string arrays to a `qo[type]`

  @param {Object} qo The internal Qo to attach properties to
  @param {String} type Name of the field to be adding to
  @param {String} str Space separated list to add as array

  @private
*/

var adder = function (qo, type, str) {
  if (!qo[type]) qo[type] = str.split(' ');
  else qo[type].push.apply( qo[type], str.split(' ') );
}


/**
  Specify fields to return as object

  .from('User').select( 'name age' )
  # Only returns the 'name' and 'age' fields
  # -> { name: 'Jake the Dog', age: 28 }

  @param {String} fields Space separated list of fields
  @public
*/

exports.select = function (fields) {
  if (typeof fields !== 'string')
    throw new Error('Query#select(fields) requires fields string');

  // Support "fields with spaces"
  adder( this.qo, 'include', fields );

  return this;
};


/**
  Specify fields to exclude from results object

  @example
      query().exclude( 'name' );
      query().exclude( ['name', 'age'] );
      // Or as a space separated string
      query().exclude( 'name age' );

  @param {String[]} fields Array of fields to exclude from results

  @returns this
*/

exports.exclude = function ( fields ) {
  if (typeof fields !== 'string')
    throw new Error('Query#exclude(fields) requires fields string');

  if ( this.qo.include ) throw new Error('Cannot exclude after include');

  adder( this.qo, 'exclude', fields );

  return this;
};


/**
  Active resource selector

  @param {String} resource The identifier for the resource to query
  @public
*/

exports.from = function( resource ) {
  if (typeof resource !== 'string')
    throw new Error('Query#from(resource) requires `resource` as a string');

  this.qo.resource = resource;

  return this;
};


/**
  Formats the Query down to a lean (no empty arrays), plain JS object

  @alias toQo
  @returns clean query object
*/

exports.toObject = function() {
  return this.qo;
};
