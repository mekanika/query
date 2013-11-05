/**
 * Module dependencies
 */

var constraints = require('./constraints')
  , map = require('mekanika-utils-map');


/**
 * Setup exports references
 */

module.exports = exports;


/**
 * Set the query action to `create`
 *
 * @param {Object|Array|String} [payload] The data to associate with create
 * @param {Function} [cb] Forces query exec and pass results to this function
 * @public
 */

exports.create = function( payload, cb ) {
  if (cb && typeof cb !== 'function')
    throw new Error('Query#create(payload,cb) requires `cb` as a Function');

  this.action = 'create';

  // Handle multiple payload objects
  if (payload) {
    payload instanceof Array
      ? this.inputs = this.inputs.concat( payload )
      : this.inputs.push( payload );
  }

  if (cb) this.done( cb );
  else return this;
};


/**
 * Set query to 'save' passed object records
 *
 * Note: Query does not attempt any validation of payload. Validation of
 * contents is out of scope.
 *
 * @param {Object|Object[]} payload Documents/Records/Objects to save
 * @param {Function} [cb]
 * @public
 */

exports.save = function( payload, cb ) {
  if (cb && typeof cb !== 'function')
    throw new Error('Query#save(payload,cb) requires `cb` as a Function');

  this.action = 'save';

  // Coerce a single Object# paramter into an Array
  if ( !(payload instanceof Array) ) payload = [payload];

  // Add all payload objects to `query.inputs`
  while (payload.length)
    this.inputs.push( payload.shift() );

  if (cb) this.done( cb );
  else return this;
};


/**
 * Sets the query action to `find`
 *
 * @param {String|String[]} [ids] id or ids to associate with find
 * @param {Function} [cb]
 * @public
 */

exports.find = function( ids, cb ) {
  if (cb && typeof cb !== 'function')
    throw new Error('Query#find(ids,cb) requires cb to be a function');

  this.action = 'find';

  if ( ids ) {
    // First parameter is a function - assign this as the callback
    if ( typeof ids === 'function' ) cb = ids;
    // Otherwise add the identifiers to the query
    else ids instanceof Array
      ? this.identifiers = this.identifiers.concat( ids )
      : this.identifiers.push( ids );
  }

  if (cb) this.done( cb );
  else return this;
};


/**
 * Updates records matching `conditions` (ids) with the `update` param
 *
 * Note: It is possible to pass nothing to `.update()` which only sets the
 *       action to 'update'. You can subsequently set conditions with .where()
 *
 * @param {String|String[]} [conditions] Ids to match updates
 * @param {Object} [update] The object containing the updates to apply
 * @param {Function} [cb] Callback function to execute update against
 *
 * @public
 */

exports.update = function( conditions, update, cb ) {
  if (cb && typeof cb !== 'function')
    throw new Error('Query#update(...) requires cb to be a function');

  this.action = 'update';

  var self = this;

  // Enable calling .update( {data: 'to_update'} )
  // and **returning** query
  if ( arguments.length === 1 ) {
    this.inputs.push( arguments[0] );
    return this;
  }

  // Support: Single ID definition
  if (typeof conditions === 'string') {
    constraints
      .where.call( self, 'id' )
      .is( conditions );
  }
  // Support: Multiple IDs in an Array
  else if (conditions instanceof Array) {
    constraints
      .where.call( self, 'id' )
      .in( conditions );
  }

  // Apply the update to the query .inputs array
  if (update) this.inputs.push( update );

  if (cb) this.done( cb );
  else return this;
};


/**
 * Sets the query action to `delete`
 *
 * Note: If you do not pass an id, AND you forget to set a .where('id').is(val)
 *       further down the query, most adapters will treat this as instruction
 *       to DELETE ALL in the resource. DANGER DANGER. High voltage.
 *
 * @param {String|String[]} [id] An id or ids to associate with delete
 * @param {Function} [cb] Executes query and passes results to function

 * @alias remove
 * @public
 */

exports.destroy =
exports.remove = function( id, cb ) {
  if (cb && typeof cb !== 'function')
    throw new Error('Query#remove(id,cb) requires cb to be a function');

  this.action = 'delete';

  // Local reference to this
  var self = this;

  // Assign the first parameter as callback if it's a function
  if (typeof id === Function) cb = id;
  // Otherwise apply provided ids as where() condition to delete
  else if (id && id.length) {
    var addIds = function( ids ) {
      // Get the most recent 'where' constraint
      while( ids.length ) {
        constraints
          .where.call( self, 'id' )
          .is( ids.shift() );
      }
    };
    id instanceof Array
      ? addIds( id )
      : addIds( [id] );
  }

  if (cb) this.done( cb );
  else return this;
};


/**
 * Execute Query chain. Passes query results to the callback if adapter is
 * present, otherwise simply passes the query object back.
 *
 * @param {Function} cb Called on completion, passed `cb( error, results )`
 * @public
 */

exports.done = function( cb ) {

  if (typeof cb !== 'function')
    throw new Error('Query#done(cb) requires `cb` as a Function');

  // --- Pre action middleware
  var pre = this.middleware.pre[ this.action ];
  var self = this;
  // Do we have middleware to run on this event
  if ( pre && pre.length )
    map( function(f){ f( self ); }, pre );


  // -- Post action middleware
  var post = this.middleware.post[ this.action ];
  if ( post && post.length ) {
    var _cb = cb;
    cb = function( err , res ) {

      map( function(f) {
        // Apply the method
        var out = f( err, res );

        // Ensure middleware returns array
        if (out instanceof Array && out.length === 2) {
          // Deconstruct mutated err + res
          err = out[0];
          res = out[1];
        }
      }, post );

      // Finally run the original callback with mutated err + res
      _cb( err, res );
    }
  }

  var err = !this.resource || !this.action
    ? new Error('Invalid query: must set `from` and `{action}`')
    : undefined;

  // Pass the query to an adapter, if one is present
  if (this.adapter) {
    if (err) throw err;
    this.adapter.exec( this, cb );
  }
  // Otherwise return the query to the callback( err, query )
  else err
    ? cb( err )
    : cb( null, this );
};
