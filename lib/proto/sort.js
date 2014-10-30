
/**
  Setup exports reference
*/

module.exports = exports;


/**
  Helper - creates a sort object and pushes to `this.sort`

  @param {String} dir Direction to sort: 'asc' or 'desc'
  @param {String} index to sort on

  @this Query
  @private
*/

function addToSort( dir, index ) {
  var _sort = { direction: dir };
  if (index) _sort.index = index;

  this.sort.push( _sort );
  return this;
}


/**
  Set sorting order to be ascending. Optionally on `index` param.

  @param {String} [index] The name of the field to sort on
  @public
*/

exports.asc = function( index ) {
  return addToSort.call( this, 'asc', index );
};


/**
  Set sorting order to be descending. Optionally on `index` param.

  @param {String} [index] The name of the field to sort on
  @public
*/

exports.desc = function( index ) {
  return addToSort.call( this, 'desc', index );
};


/**
  Sets the index to sort on

  @param {String} [index] The name of the field to sort on
  @public
*/

exports.order = function( index ) {

  // Create a new sort object
  if (!this.sort.length) this.sort.push( {index:index} );

  this.sort[ this.sort.length - 1 ].index = index;

  return this;
};
