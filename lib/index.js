// Requires adapter interface:
// adapterGetter( adapterKey ).exec( query, cb ) // - adapter#exec()
var _adapter;


var query = function( adapterKey ) {
  var q = new Query();

  // Instantiate the query with an adapter
  if (adapterKey) q.use( adapterKey );

  return q;
};

// Usually `query.adapterClass( require('adapter') )`
query.adapterClass = function( adapterClass ) {
  _adapter = adapterClass;

  // Support declaring: var query = require('query').adapterclass( adptr );
  return this;
};

// Purge `query` class of all prior settings
query.reset = function() {
  _adapter = undefined;
};



var Query = function() {
  // Internal reference to (optional) external adapter
  this.adapter;

  // Query action (verb)
  this.action;

  // Service identifiers to act upon
  this.resource = [];

  // Unique ids on the resource
  this.identifiers = [];

  // Model fields to return from service identifier (empty array implies ALL)
  this.fields = [];

  // User input values/data to action
  this.inputs = [];

  this.paging = {
    limit: 0,
    offset: 0,
    sort: [{ direction:0, index:0 }]
  };

  this.constraints = [];

  return this;
};

var proto = Query.prototype;



// Associate query instance with adapter `adapterKey`
proto.use = function( adapterKey ) {
  // Do we have an adapterClass to work with
  if (!_adapter)
    throw new Error('Query#use() requires query.adapterClass(class)');

  // Optimistically load in the adapter `adapterKey`
  if ( adapterKey ) this.adapter = _adapter( adapterKey );

  return this;
};

proto.select = function( /* fields, field2, ... */ ) {
  if (!arguments.length)
    throw new Error('Query#select(fields...) requires fields');

  // Decompose paramters into `this.fields` array
  for (var i=0; i<arguments.length; i++) {
    arguments[i] instanceof Array
      ? this.fields = this.fields.concat( arguments[i] )
      : this.fields.push( arguments[i] );
  }

  return this;
};




// -- Action/Returning methods
proto.create = function( payload, cb ) {
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

proto.find = function( identifiers, cb ) {
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

proto.destroy = function( id, cb ) {
  if (!id) throw new Error('Query#destroy(id) requires `id`');

  this.action = 'delete';

  id instanceof Array
    ? this.inputs = this.inputs.concat( id )
    : this.inputs.push( id );

  if (cb) this.done( cb );
  else return this;
};

// Execute Query chain through an adapter if present
proto.done = function( cb ) {
  if (typeof cb !== 'function')
    throw new Error('Query#done(cb) requires `cb` as a Function');

  var err = !this.resource.length || !this.action
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





// -- Active resource selector
proto.from = function( fields ) {
  if (fields instanceof Array) this.resource.concat( fields );
  else if (typeof fields === 'string') this.resource.push( fields );

  return this;
};

// @todo: enable 'distinct' records selections
proto.distinct = function() {
  return this;
};




// -- Constraints
proto.where = proto.and = function( field ) {
  // Create a 'default' constraint {field, operator, condition, type}
  var defaults = { field:field, operator:'eq', condition:true, type:'and' };
  this.constraints.push( defaults );
  return this;
};

proto.or = function( field ) {
  this.where( field );
  // Switch the most recent 'where' type to 'or'
  this.constraints[ this.constraints.length-1 ].type = 'or';
  return this;
};


var operators = [
  'eq',  // ===
  'neq', // !==
  'in',  // has
  'nin', // !has
  'lt',  // <
  'gt',  // >
  'lte', // <=
  'gte'  // >=
];
var each = function(arr, fn) {
  for (var i=0; i<arr.length; i++) fn( arr[i] );
};
each( operators, function( operator ) {
  proto[ operator ] = function( condition ) {
    if (!this.constraints.length)
      throw new Error('Query#'+operator+' requires .where(field) to be set');

    // Get the most recent 'where' constraint
    var where = this.constraints[ this.constraints.length-1 ];
    where.operator = operator;
    where.condition = condition;

    return this;
  };
});

proto.limit = function( num ) {
  this.paging.limit = num;
  return this;
};

proto.offset = function( amount ) {
  this.paging.offset = amount;
  return this;
};

proto.page = function( page ) {
  if ( !this.paging.limit ) throw new Error('No limit set');
  this.paging.offset = page * this.paging.limit;
  return this;
};




// -- Sorting
proto.asc = function( index ) {
  this.paging.sort[0].direction = 'asc';
  if (index) this.paging.sort[0].index = index;

  return this;
};

proto.desc = function( index ) {
  this.paging.sort[0].direction = 'desc';
  if (index) this.paging.sort[0].index = index;

  return this;
};

proto.order = function( index ) {
  this.paging.sort[0].index = index;
  return this;
};



// Export query
module.exports = exports = query;
