  // Requires interface:
  //  adapterGetter.has( adapterKey )               // - has an adapter
  //  adapterGetter( adapterKey ).exec( query, cb ) // - adapter#exec()
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
  };



  var Query = function() {
    this.adapter = undefined;

    // - find
    // - save?
    // this.method = ''
    this.action = undefined;

    // Service identifiers to act upon
    this.selects = [];

    // Model fields to return from service identifier
    this.fields = [];

    // User input values/data to action
    this.inputs = [];

    this.criteria = {
      limit: 0,
      offset: 0,
      sort: { direction:0, index:0 },
      where: []
    };

    return this;
  };

  var proto = Query.prototype;



  // Associate query instance with adapter `adapterKey`
  proto.use = function( adapterKey ) {
    // Do we have an adapterClass to work with
    if (!_adapter)
      throw new Error('Query#use() requires query.adapterClass(class)');

    // Check that the adapter exists
    if ( adapterKey && !_adapter.has(adapterKey) )
      throw new Error('Query#use(key) No such adapter `key` loaded');

    this.adapter = _adapter( adapterKey );

    return this;
  };




  // -- Action/Returning methods
  proto.create = function( payload, cb ) {
    if (typeof cb !== 'function')
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

  proto.find = function( /* [field, field2, ...][, cb] */ ) {
    this.action = 'find';

    if (arguments) {
      var last = arguments[arguments.length-1];

      // Add all arguments (presumed fields) to query
      for (var i=0; i<arguments.length; i++) this.fields.push( arguments[i] );

      // Execute the query if passed a callback
      if ( typeof last === 'function' ) {
        // Remove the function from fields (it's not a field)
        this.fields.pop();
        // Break out and run the query
        return this.done( last );
      }
    }

    return this;
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

    var err = !this.selects.length || !this.action
      ? new Error('Invalid query: must set `selects` and `action`')
      : undefined;

    // Pass the query to an adapter, if one is present
    if (this.adapter) {
      if (err) throw err;
      this.adapter.exec( this, cb );
    }
    // Otherwise return the query to the callback( err, query )
    else err ? cb( err ) : cb( null, this );
  };





  // -- Active record selector
  proto.select = function( fields ) {
    if (fields instanceof Array) this.selects.concat( fields );
    else if (typeof fields === 'string') this.selects.push( fields );

    return this;
  };

  // @todo: enable 'distinct' records selections
  proto.distinct = function() {
    return this;
  };




  // -- Constraints
  proto.where = function( c ) {
    this.criteria.where.push( c );
    return this;
  };

  proto.limit = function( num ) {
    this.criteria.limit = num;
    return this;
  };

  proto.offset = function( amount ) {
    this.criteria.offset = amount;
    return this;
  };

  proto.page = function( page ) {
    if ( !this.criteria.limit ) throw new Error('No limit set');
    this.criteria.offset = page * this.criteria.limit;
    return this;
  };




  // -- Sorting
  proto.asc = function( index ) {
    this.criteria.sort.direction = 'asc';
    if (index) this.criteria.sort.index = index;

    return this;
  };

  proto.desc = function( index ) {
    this.criteria.sort.direction = 'desc';
    if (index) this.criteria.sort.index = index;

    return this;
  };

  proto.order = function( index ) {
    this.criteria.sort.index = index;
    return this;
  };



  // Export query
  module.exports = exports = query;
