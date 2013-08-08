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

exports.destroy = function( id, cb ) {
  if (!id) throw new Error('Query#destroy(id) requires `id`');

  this.action = 'delete';

  id instanceof Array
    ? this.inputs = this.inputs.concat( id )
    : this.inputs.push( id );

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
