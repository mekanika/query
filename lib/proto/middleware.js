
/**
 * Expose module
 */

module.exports = exports;

/**
 * Add middleware `fn` to pre `action`
 *
 * @param {String} action Name of the action to run before
 * @param {Function} fn Middleware to execute, passed ({Query#})
 *
 * @returns {this}
 */

exports.pre = function( action, fn ) {

  var pre = this.middleware.pre;
  if (!pre[ action ]) pre[ action ] = [];

  pre[ action ].push( fn );

  return this;
};


/**
 * Add middleware `fn` to post `action`
 *
 * @param {String} action Name of the action to run after
 * @param {Function} fn Middleware to execute, passed ({Query#})
 *
 * @returns {this}
 */

exports.post = function( action, fn ) {
  var post = this.middleware.post;
  if (!post[ action ]) post[ action ] = [];

  post[ action ].push( fn );

  return this;
};
