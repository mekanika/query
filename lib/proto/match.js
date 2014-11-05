
/**
  Setup exports reference
*/

module.exports = exports;


/**
  A 'where' constraint setting up a core 'field' and optional 'value'

  Subsequent modifications are handled by modifier operators, gt(), eq() etc.

  @param {String} field The name of the field to constrain
  @param {Mixed} [val] Optional value to constrain. Default operator is 'eq'.
  @public
*/

exports.where = function( field, val ) {
  // Prevent setting constraints if query is in findByID mode: `.find( ids )`
  if (this.qo.ids)
    throw new Error('Query#where(...) cannot follow setting .find( ids )');

  if (!this.qo.match) this.qo.match = [];

  // Create a default match object `{field:$f, op:$op, value:$val}`
  var mo = {field:field, op:'eq', value:true};
  // Optional value to assign as 'equal'
  // `.where('id',5)` is equivalent to `.where('id').eq(5)`
  if (val) mo.value = val;
  this.qo.match.push( mo );
  return this;
};


/**
  Operator modifiers enable to changing of where constraints and values.

  Format: `{operator}( condition )`

  Example: `query().where( 'age' ).gte( 21 );`
*/

var operators = [
  'eq',  // ===
  'is',  // Alias 'eq' (more fluent for non-numeric)
  'neq', // !==
  'not', // Alias 'neq'
  'in',  // has
  'nin', // !has
  'lt',  // <
  'gt',  // >
  'lte', // <=
  'gte', // >=
  'all'  // has every (tags:['action','adventure'])
];

// Loop through each operator and setup a named function
var each = function(arr, fn) {
  for (var i=0; i<arr.length; i++) fn( arr[i] );
};
each( operators, function( op ) {

  exports[ op ] = function( value ) {
    if (!this.qo.match)
      throw new Error('Query#'+op+' requires .where(field) to be set');

    // Normalise aliases
    if (op === 'is') op = 'eq';
    if (op === 'not') op = 'neq';

    // Enforce array entries for `in, nin, all`
    if ( /in$|^all/.test( op ) ) {
      if ( !(value instanceof Array) )
        throw new Error('Operator "'+op+'" requires value as array');
    }

    // Get the most recent 'where' constraint
    var match = this.qo.match[ this.qo.match.length-1 ];
    match.op = op;
    match.value = value;

    return this;
  };

});
