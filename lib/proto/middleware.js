
/**
 * Expose module
 */

module.exports = exports;


/**
 * Helper to apply middleware functions to pre or post stack
 *
 * @param {String} prepost Either 'pre' or 'post'
 * @param action
 * @param fn
 *
 * @returns this query
 * @private
 */

function _addMiddleware( prepost, action, fn ) {
  var mid = this.middleware[ prepost ];
  if (!mid[ action ]) mid[ action ] = [];

  mid[ action ].push( fn );

  return this;
}


/**
 * Add middleware `fn` to pre `action`
 *
 * @param {String} action Name of the action to run before
 * @param {Function} fn Middleware to execute, passed ({Query#})
 *
 * @returns {this}
 */

exports.pre = function( action, fn ) {
  return _addMiddleware.call( this, 'pre', action, fn );
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
  return _addMiddleware.call( this, 'post', action, fn );
};
