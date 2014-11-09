
/**
  Setup exports reference
*/

module.exports = exports;


/**
  Sets a limit on the number of records to return

  @param {Number} num

  @return {Query}
  @public
*/

exports.limit = function( num ) {
  this.qe.limit = num;
  return this;
};


/**
  Offsets the starting results returned

  Works in two modes, when passed:

  - Number - acts as "skip" (ie. jump over the first 'x' results)
  - Match object - `{field:{op:val}}` acts in "startAt" mode

  Example: Fetching the 3rd page of results limited to 10 results per page

      query().from('User').limit(10).offset(30);
      # Returns record 31 as the 1st result

  @param {Number|Object} block Number for 'skip', Match object for 'startAt'

  @return {Query}
  @public
*/

exports.offset = function( block ) {
  this.qe.offset = block;
  return this;
};


/**
  Shorthand method to set an offset by simply specifying which "page" to
  return. Requires having set a `limit( num )` to calculate the offset.

  @param {Number} page

  @return {Query}
  @public
*/

exports.page = function( page ) {
  if ( !this.qe.limit ) throw new Error('No limit set');
  this.qe.offset = (page-1) * this.qe.limit;
  return this;
};
