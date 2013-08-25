
/**
 * Setup exports reference
 */

module.exports = exports;


/**
 * Set sorting order to be ascending. Optionally on `index` param.
 *
 * @param {String} [index] The name of the field to sort on
 * @public
 */

exports.asc = function( index ) {
  this.paging.sort[0].direction = 'asc';
  if (index) this.paging.sort[0].index = index;

  return this;
};


/**
 * Set sorting order to be descending. Optionally on `index` param.
 *
 * @param {String} [index] The name of the field to sort on
 * @public
 */

exports.desc = function( index ) {
  this.paging.sort[0].direction = 'desc';
  if (index) this.paging.sort[0].index = index;

  return this;
};


/**
 * Sets the index to sort on
 *
 * @param {String} [index] The name of the field to sort on
 * @public
 */

exports.order = function( index ) {
  this.paging.sort[0].index = index;
  return this;
};
