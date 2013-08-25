
/**
 * Setup exports reference
 */

module.exports = exports;


/**
 * Sets a limit on the number of records to return
 *
 * @param {Number} num
 * @public
 */

exports.limit = function( num ) {
  this.paging.limit = num;
  return this;
};


/**
 * Sets a number of records to 'skip' when starting a query. Useful for
 * instructing the query to return paged results.
 *
 * Example: Fetching the 3rd page of results limited to 10 results per page
 *
 *     query().from('User').limit(10).offset(30);
 *     # Returns record 31 as the 1st result
 *
 * @param {Number} amount The number of records to skip
 * @public
 */

exports.offset = function( amount ) {
  this.paging.offset = amount;
  return this;
};


/**
 * Shorthand method to set an offset by simply specifying which "page" to
 * return. Requires having set a `limit( num )` to calculate the offset.
 *
 * @param {Number} page
 * @public
 */

exports.page = function( page ) {
  if ( !this.paging.limit ) throw new Error('No limit set');
  this.paging.offset = page * this.paging.limit;
  return this;
};
