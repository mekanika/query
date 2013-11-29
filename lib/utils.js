
/**
 * Expose modules
 */

module.exports = exports;


/**
 * Splits a string by spaces and returns arrays `add` and `minus` based on first character of the string
 *
 * @example
 * splace( 'first -second third' ) ;
 * // -> { add: ['first', 'third'], minus: ['second'] }
 *
 * @param {String} str to split
 *
 * @returns {Object} `{add: String[], minus: String[]}`
 */

exports.splace = function splace( str ) {
  var add = []
    , minus = [];


  str.split(' ').forEach( function(el) {

    el.substr(0,1) === '-'
      ? minus.push( el.slice(1) )
      : add.push( el );

  });

  return {add:add, minus:minus};

};


/**
 * Simple checks whether `el` is "empty"
 *
 * Does not handle everything. Useful only to test Query# attributes.
 *
 * @param el The element to test
 *
 * @returns {Boolean} is element empty
 */

exports.isEmpty = function isEmpty( el ) {
  if (el === undefined || el === null) return true;
  if (el === '') return true;

  if (el instanceof Array)
    return el.length ? false : true;

  if (Object.prototype.toString.call(el) === '[object Object]')
    return Object.keys( el ).length ? false : true

  return false;
};


/**
 * Checks if `arr` contains `val`
 *
 * @param {Array} arr
 * @param val to check for existence in array
 *
 * @returns {Boolean} does array have value
 */

exports.has = function has( arr, val ) {
  if (typeof arr.indexOf !== 'undefined')
    return arr.indexOf( val ) > -1 ? true : false;

  var len = arr.length;
  while( len-- )
    if (arr[len] === val) return true;

  return false;
};
