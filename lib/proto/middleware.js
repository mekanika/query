
/**
  Expose module
*/

module.exports = exports;


/**
  Helper to apply middleware functions to pre or post stack

  @param {String} prepost Either 'pre' or 'post'
  @param action
  @param fn

  @return {Query}
  @private
*/

function _addMiddleware( prepost, action, fn ) {

  var _act = action;
  var _hook = fn;

  if (typeof action === 'function' || action instanceof Array) {
    _act = 'all';
    _hook = action;
  }

  // Ensure `hook` function is always coerced to Array of fns
  if ( !(_hook instanceof Array) ) _hook = [_hook];

  var mid = this.middleware[ prepost ];
  if (!mid[ _act ]) mid[ _act ] = [];

  // Apply the array of middleware fns
  mid[ _act ].push.apply( mid[_act], _hook );

  return this;
}


/**
  Add middleware `fn` to pre `action`

  @param {String|Function} action Name of the action to run before. If passed a function, action defaults to 'all' actions.
  @param {Function} fn Middleware to execute, passed ({Query#})

  @return {Query}
*/

exports.pre = function( action, fn ) {
  return _addMiddleware.call( this, 'pre', action, fn );
};


/**
  Add middleware `fn` to post `action`. If no action supplied,

  @param {String|Function} action Name of the action to run after. If passed a function, action defaults to 'all' actions.
  @param {Function} fn Middleware to execute, passed ({Query#})

  @return {Query}
*/

exports.post = function( action, fn ) {
  return _addMiddleware.call( this, 'post', action, fn );
};
