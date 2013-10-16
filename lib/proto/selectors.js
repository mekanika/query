/**
 * Setup exports references
 */

module.exports = exports;


/**
 * Applies a `field` to the `unique` property on a query
 *
 * @param {String} field The name of the field to be unique/distinct
 * @public
 */

exports.distinct = function( field ) {
  if (typeof field === 'undefined')
    throw new Error('query#distinct( field ) must be called with a `field`');

  this.unique = field;

  return this;
};
