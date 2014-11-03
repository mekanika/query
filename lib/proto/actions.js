/**
  Module dependencies
*/

var match = require('./match');


/**
  Setup exports references
*/

module.exports = exports;


/**
  Helper to add `data` to an array key on a passed Qo reference

  @param {String} key
  @param {Qo} qo
  @param {Mixed} data The data to add to the array

  @private
*/

function _addTo (key, qo, data) {
  if (!data) return;
  if (!qo[key]) qo[key] = [];

  data instanceof Array
    ? qo[key] = qo[key].concat( data )
    : qo[key].push( data );
}


/**
  Set the query action to `create`

  @param {Object|Array|String} [payload] The data to associate with create
  @param {Function} [cb] Forces query exec and pass results to this function
  @public
*/

exports.create = function( payload, cb ) {
  if (cb && typeof cb !== 'function')
    throw new Error('Query#create(payload,cb) requires `cb` as a Function');

  this.qo.action = 'create';

  // Add payload to Qo
  _addTo( 'body', this.qo, payload );

  if (cb) this.done( cb );
  else return this;
};


/**
  Set query to 'save' passed object records

  Note: Query does not attempt any validation of payload. Validation of
  contents is out of scope.

  @param {Object|Object[]} payload Documents/Records/Objects to save
  @param {Function} [cb]
  @public
*/

exports.save = function( payload, cb ) {
  if (cb && typeof cb !== 'function')
    throw new Error('Query#save(payload,cb) requires `cb` as a Function');

  this.qo.action = 'save';

  // Add payload to Qo
  _addTo( 'body', this.qo, payload );

  if (cb) this.done( cb );
  else return this;
};


/**
  Sets the query action to `find`

  @param {String|String[]} [ids] id or ids to associate with find
  @param {Function} [cb]
  @public
*/

exports.find = function( ids, cb ) {
  if (cb && typeof cb !== 'function')
    throw new Error('Query#find(ids,cb) requires cb to be a function');

  this.qo.action = 'find';

  // First parameter is a function - assign this as the callback
  if ( typeof ids === 'function' ) cb = ids;
  // Otherwise add payload to Qo
  else _addTo( 'ids', this.qo, ids );

  if (cb) this.done( cb );
  else return this;
};


/**
  Updates records matching `conditions` (ids) with the `update` param

  Note: It is possible to pass nothing to `.update()` which only sets the
        action to 'update'. You can subsequently set conditions with .where()

  @param {String|String[]} [conditions] Ids to match updates
  @param {Object} [update] The object containing the updates to apply
  @param {Function} [cb] Callback function to execute update against

  @public
*/

exports.update = function( conditions, update, cb ) {
  if (cb && typeof cb !== 'function')
    throw new Error('Query#update(...) requires cb to be a function');

  this.qo.action = 'update';

  var self = this;

  // Enable calling .update( {data: 'to_update'} )
  // and **returning** query
  if ( arguments.length === 1 ) {
    _addTo( 'body', this.qo, arguments[0] );
    return this;
  }

  // Support: Single ID definition
  if (typeof conditions === 'string') {
    match
      .where.call( self, 'id' )
      .is( conditions );
  }
  // Support: Multiple IDs in an Array
  else if (conditions instanceof Array) {
    match
      .where.call( self, 'id' )
      .in( conditions );
  }

  // Apply the update to the query .inputs array
  if (update) _addTo( 'body', this.qo, update );

  if (cb) this.done( cb );
  else return this;
};


/**
  Sets the query action to `remove`

  Note: If you do not pass an id, AND you forget to set a .where('id').is(val)
        further down the query, most adapters will treat this as instruction
        to DELETE ALL in the resource. DANGER DANGER. High voltage.

  @param {String|String[]} [id] An id or ids to associate with remove
  @param {Function} [cb] Executes query and passes results to function

  @alias remove
  @public
*/

exports.remove = function( id, cb ) {
  if (cb && typeof cb !== 'function')
    throw new Error('Query#remove(id,cb) requires cb to be a function');

  this.qo.action = 'remove';

  // Assign the first parameter as callback if it's a function
  if (typeof id === Function) cb = id;
  else _addTo( 'ids', this.qo, id );

  if (cb) this.done( cb );
  else return this;
};


/**
  Adds this query as the final argument passed to an arbitrary callback
  and forces callback to run Asynchronously. DO NOT RELEASE ZALGO.
  Th͏e Da҉rk Pońy Lo͘r͠d HE ́C͡OM̴E̸S

  @see http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony


  @param {Function} cb The callback to add the query param to

  @returns Modified callback
  @private
*/

function _wrap( cb ) {
  var _cb = cb
    , self = this;

  // Grabs whatever args are usually passed to `cb` and adds this query to that
  cb = function() {
    var args = [].slice.call( arguments );
    args.push( self );
    // Force callback to run after the current "tick"
    setTimeout( function() { _cb.apply( this, args );}, 0 );
  };

  return cb;
}


/**
  Returns a 'callback' function that first applies all `post` middleware
  and then runs the final `_cb` with the mutated `(err, res)` params

  @param {Function[]} post Array of post hook functions
  @param {Function} _cb The final callback to run after post hooks
  @param {Query} qry The query running the post hooks

  @throws {Error} post middleware failed

  @private
*/

exports.posthook = function ( post, cb, qry ) {
  return function( err , res ) {

    // Execute all middleware prior to running the final user callback
    post.map( function(f) {

      // Apply the method
      var out = f( err, res, qry );

      // Ensure middleware returns array
      if (out instanceof Array && out.length === 2) {
        // Deconstruct mutated err + res
        err = out[0];
        res = out[1];
      }
      // Throw a user provided error
      else if (out instanceof Error) throw out;
      // Unexpected return value - throw
      else throw new Error('Post middleware failed to return');

    });

    // Finally run the original callback with mutated err + res, and query
    if (cb) cb( err, res, qry );
  };
};


/**
  Execute Query chain. Passes query results to the callback if adapter is
  present, otherwise simply passes the query object back.
  Guaranteed Asynchronous execution of the callback. No Zalgo.
  Th͏e Da҉rk Pońy Lo͘r͠d HE ́C͡OM̴E̸S

  @see http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony

  @param {Function} [cb] Called on completion, passed `cb( error, results )`
  @public
*/

exports.done = function( cb ) {

  var qo = this.toObject();

  // Incomplete minimal query error
  if (!qo.resource || !qo.action)
    return cb && _wrap.call( qo, cb )( 'Must set `from` and `action`');

  // Return the query and an error message if no adapter
  if (!this.adapter)
    return cb && _wrap.call( qo, cb )( 'No adapter to query');


  // Simple join method for two arrays (either may be undefined)
  var _join = function( x, y ) {
    var z = x || [];
    z.push.apply( z, y );
    return z;
  };

  var hooks = this.middleware;

  // --- Pre action middleware
  var pre = _join( hooks.pre.all, hooks.pre[ qo.action ] );
  var self = this;
  // Do we have middleware to run on this event
  if ( pre && pre.length )
    pre.map( function(f){ f( qo ); } );


  // -- Post action middleware
  var post = _join( hooks.post.all, hooks.post[ qo.action ] );
  if ( post && post.length ) {
    var _cb = cb;
    cb = exports.posthook( post, _cb, qo );
  }

  // Wrap the final callback to:
  // - 1. Add this query object to the arguments stack
  // - 2. Force ASYNC execution (Do not release źálġő)
  //      - http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony
  this.adapter.exec( qo, _wrap.call(qo, cb) );

};
