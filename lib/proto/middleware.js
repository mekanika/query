
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

  var _act = action;
  var _hook = fn;

  if (typeof action === 'function') {
    _act = 'all';
    _hook = action;
  }

  var mid = this.middleware[ prepost ];
  if (!mid[ _act ]) mid[ _act ] = [];

  mid[ _act ].push( _hook );

  return this;
}


/**
 * Add middleware `fn` to pre `action`
 *
 * @param {String|Function} action Name of the action to run before. If passed a function, action defaults to 'all' actions.
 * @param {Function} fn Middleware to execute, passed ({Query#})
 *
 * @returns {this}
 */

exports.pre = function( action, fn ) {
  return _addMiddleware.call( this, 'pre', action, fn );
};


/**
 * Add middleware `fn` to post `action`. If no action supplied,
 *
 * @param {String|Function} action Name of the action to run after. If passed a function, action defaults to 'all' actions.
 * @param {Function} fn Middleware to execute, passed ({Query#})
 *
 * @returns {this}
 */

exports.post = function( action, fn ) {
  return _addMiddleware.call( this, 'post', action, fn );
};
