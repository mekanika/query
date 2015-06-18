var MatchContainer = require('./match/MatchContainer');

/**
  Expose the `query()` accessor interface
*/

module.exports = query;

/**
  Match constraint generator

  @param {String} op 'and' or 'or'
  @param {Array} [mos] Optional array of match objects

  @return {MatchContainer}
*/

query.mc = function (op, mos) {
  return new MatchContainer(op, mos);
};

/**
  Expose Query constructor

  @constructor
*/

var Query = query.Query = function () {
  // Internal reference to (optional) external adapter
  this.adapter;

  // Initialise a new `Qo` object hash
  this.qe = {};

  // Pre and Post event middleware
  this.middleware = {
    pre: {},
    post: {}
  };
};

/**
  Shorthand reference to `Query.prototype`
*/

var proto = Query.prototype;

/**
  Internal method to mix in module `proto` methods into `main`

  @param {Query} proto The prototype of the Query class
  @param {Object} main The object with methods/props to mix into `proto`
  @ignore
*/

var mixin = function (proto, main) {
  for (var method in main)
    if (main.hasOwnProperty(method)) proto[ method ] = main[ method ];
};

/**
  Mix in the required methods into `Query.prototype`
*/

mixin(proto, require('./proto/core'));
mixin(proto, require('./proto/actions'));
mixin(proto, require('./proto/middleware'));
mixin(proto, require('./proto/match'));
mixin(proto, require('./proto/updates'));
mixin(proto, require('./proto/display'));
mixin(proto, require('./proto/sort'));
mixin(proto, require('./proto/populate'));

/**
  Main query accessor interface. Exposes `new Query()` instances

  @public
*/

function query (adapter) {
  var q = new Query();

  // Instantiate the query with an adapter
  if (adapter) {
    if (!adapter.exec) throw new Error('Invalid adapter');
    q.useAdapter(adapter);
  }

  return q;
}
