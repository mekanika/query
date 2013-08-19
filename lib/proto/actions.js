var constraints = require('./constraints');

module.exports = exports;

// -- Action/Returning methods
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

exports.find = function( identifiers, cb ) {
  this.action = 'find';

  if ( identifiers ) {
    // First parameter is a function - assign this as the callback
    if ( typeof identifiers === 'function' ) cb = identifiers;
    // Otherwise add the identifiers to the query
    else identifiers instanceof Array
      ? this.identifiers = this.identifiers.concat( identifiers )
      : this.identifiers.push( identifiers );
  }

  if (cb && typeof cb !== 'function')
    throw new Error('Query#find(ids,cb) requires cb to be a function');

  if (cb) this.done( cb );
  else return this;
};


// Note: If you do not pass an id, AND you forget to set a .where('id').is(val)
//       further down the query, most adapters will treat this as instruction
//       to DELETE ALL in the resource. DANGER DANGER. High voltage.
// Alias .remove()
exports.destroy = exports.remove = function( id, cb ) {
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

// Execute Query chain through an adapter if present
exports.done = function( cb ) {
  if (typeof cb !== 'function')
    throw new Error('Query#done(cb) requires `cb` as a Function');

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
