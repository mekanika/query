
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
 * Checks whether `arr` is an empty Array
 *
 * @param arr The element to test
 *
 * @returns {Boolean} is array empty
 */

exports.isEmpty = function isEmpty( arr ) {
  if (arr instanceof Array)
    return arr.length ? false : true;

  return false;
};
