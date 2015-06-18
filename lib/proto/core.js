/**
  Setup exports reference
*/

module.exports = exports;

/**
  Set an explicit adapter reference, where `adapter` is an Adapter instance

  @param {Adapter} adapter An adapter instance eg. require('mekanika-mongo')

  @return {Query}
  @public
*/

exports.useAdapter = function (adapter) {
  this.adapter = adapter;

  // Enable chaining `.adapter( adptr )` calls
  return this;
};

/**
  Manually assign the Query envelope value (dangerous - no validation!)

  @param {Qe} qe The Query envelope object

  @return {Query}
*/

exports.raw = function (qe) {
  this.qe = qe;
  return this;
};

/**
  Specify a space separated whitelist or blacklist fields for return.

  ```js
  .on('users').select( 'name age' ) // whitelist
  // -> { name: 'Jake the Dog', age: 28 }

  .on('users').select('-age'); // blacklist
  // -> {id:1, name: 'Jake the Dog'}
  ```

  @param {String} fields Space separated list of fields

  @return {Query}
  @public
*/

exports.select = function (fields) {
  if (typeof fields !== 'string' && !(fields instanceof Array)) {
    throw new Error('Query#select() expected String or array of Strings');
  }

  this.qe.select = fields instanceof Array
    ? fields
    : fields.split(' ');

  return this;
};

/**
  Active resource selector

  @param {String} resource The identifier for the resource to query

  @return {Query}
  @public
*/

exports.on = function (resource) {
  if (typeof resource !== 'string') {
    throw new Error('Query#from(resource) requires `resource` as a string');
  }

  this.qe.on = resource;

  return this;
};

/**
  Set the body contents to 'data'

  If data is not an array, it is wrapped in an array (per Qe spec)

  @param {Mixed}

  @return {Query}
*/

exports.body = function (data) {
  // Do not attempte to add no data
  if (typeof data === 'undefined') return this;

  if (!(data instanceof Array)) data = [data];

  // Bail out if ids array is empty
  if (data.length < 1) return this;

  this.qe.body = data;

  return this;
};

/**
  Appends provided id/s to the `qe.ids` field.

  If data is not an array, it is wrapped in an array (per Qe spec)

  @param {Mixed}

  @return {Query}
*/

exports.ids = function (data) {
  // Do not attempte to add no data
  if (typeof data === 'undefined') return this;

  if (!(data instanceof Array)) data = [data];

  // Bail out if ids array is empty
  if (data.length < 1) return this;

  if (!this.qe.ids) this.qe.ids = [];

  this.qe.ids.push.apply(this.qe.ids, data);

  return this;
};

/**
  Adds an object hash to the Qo meta field

  @param {Object} obj Hash of fields to add to `meta`

  @return this
*/

exports.meta = function (obj) {
  if (!this.qe.meta) this.qe.meta = obj;
  else for (var key in obj) this.qe.meta[key] = obj[key];

  return this;
};
