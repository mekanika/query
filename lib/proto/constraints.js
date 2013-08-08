module.exports = exports;

// -- Constraints
exports.where = exports.and = function( field, val ) {
  // Create a 'default' constraint {field, operator, condition, type}
  var defaults = { field:field, operator:'eq', condition:true, type:'and' };
  // Optional value to assign as 'equal'
  // `.where('id',5)` is equivalent to `.where('id').eq(5)`
  if (val) defaults.condition = val;
  this.constraints.push( defaults );
  return this;
};

exports.or = function( field, val ) {
  this.where( field, val );
  // Switch the most recent 'where' type to 'or'
  this.constraints[ this.constraints.length-1 ].type = 'or';
  return this;
};


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
  'gte'  // >=
];
var each = function(arr, fn) {
  for (var i=0; i<arr.length; i++) fn( arr[i] );
};
each( operators, function( operator ) {

  exports[ operator ] = function( condition ) {
    if (!this.constraints.length)
      throw new Error('Query#'+operator+' requires .where(field) to be set');

    // Get the most recent 'where' constraint
    var where = this.constraints[ this.constraints.length-1 ];
    where.operator = operator;
    where.condition = condition;

    return this;
  };

});
