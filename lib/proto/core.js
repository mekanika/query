
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

var _select = function (qo, type, str) {
  if (typeof str !== 'string')
    throw new Error('Query#'+type+'(fields) requires fields string');

  if (!qo[type]) qo[type] = str.split(' ');
  else qo[type].push.apply( qo[type], str.split(' ') );

  return this;
};


/**
  Specify fields to return as object

  .from('User').select( 'name age' )
  # Only returns the 'name' and 'age' fields
  # -> { name: 'Jake the Dog', age: 28 }

  @param {String} fields Space separated list of fields
  @public
*/

exports.include = function (fields) {
  // Support "fields with spaces"
  return _select.call( this, this.qo, 'include', fields );
};


/**
  Specify fields to exclude from results object

  @example
      query().exclude( 'name' );
      query().exclude( ['name', 'age'] );
      // Or as a space separated string
      query().exclude( 'name age' );

  @param {String[]} fields Array of fields to exclude from results

  @throw {Error} When trying to exclude _after_ declaring include
  @returns this
*/

exports.exclude = function ( fields ) {
  if ( this.qo.include ) throw new Error('Cannot exclude after include');
  return _select.call( this, this.qo, 'exclude', fields );
};


/**
  Active resource selector

  @param {String} resource The identifier for the resource to query
  @public
*/

exports.resource =
exports.from = function( resource ) {
  if (typeof resource !== 'string')
    throw new Error('Query#from(resource) requires `resource` as a string');

  this.qo.resource = resource;

  return this;
};


/**
  Adds an object hash to the Qo meta field

  @param {Object} obj Hash of fields to add to `meta`

  @return this
*/

exports.meta = function (obj) {
  if (!this.qo.meta) this.qo.meta = obj;
  else for (var key in obj) this.qo.meta[key] = obj[key];

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
