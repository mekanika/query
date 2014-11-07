


module.exports = mixin;


/**
  Match operators
*/

var operators = [
  'eq',  // ===
  'is',  // Alias 'eq' (more fluent for non-numeric)
  'not', // Alias 'neq' (more fluent for non-numeric)
  'neq', // !==
  'in',  // has
  'nin', // !has
  'lt',  // <
  'gt',  // >
  'lte', // <=
  'gte', // >=
  'all'  // has every (tags:['action','adventure'])
];


/**
  Mixin operators as methods on `target` that modify
*/

function mixin( target, loc ) {

  if (!target) throw new Error('Must specify target');

  // Protects scope
  var each = function(arr, fn) {
    for (var i=0; i<arr.length; i++) fn( arr[i] );
  };

  // Add each `operator` as a function on `target`
  each( operators, function(op) {

    target[ op ] = function( value ) {
      // Normalise aliases
      if (op === 'is') op = 'eq';
      if (op === 'not') op = 'neq';

      // Enforce array entries for `in, nin, all`
      if ( /in$|^all/.test( op ) ) {
        if ( !(value instanceof Array) )
          throw new Error('Operator "'+op+'" requires value as array');
      }

      // Get the most recent 'match' constraint
      // Where to look?
      var store = loc ? this.qe.match : this;
      if (!store) throw new Error('No Qe .match field setup');

      // All the `Object.keys(obj)[0]` references are simply trying
      // `object[ 0 ]`
      // Of course, that doesn't work. For objects with known key length of 1
      // we can list the keys as an array, and fetch the first one.
      // Convoluted perhaps, performant, no.
      // @todo Write a util to speed this up
      // @see http://jsperf.com/unknown-object-key

      var mos = store[ Object.keys( store )[0] ];

      var _renameSoloKey = function (obj, newKey) {
        var oldkey = Object.keys( obj )[0];
        obj[ newKey ] = obj[ oldkey ];
        delete obj[ oldkey ];
      };

      var lastmo = mos[ mos.length-1 ];

      var mod = lastmo[ Object.keys(lastmo)[0] ];
      _renameSoloKey( mod, op );
      mod[op] = value;

      return this;
    };

  });
}
