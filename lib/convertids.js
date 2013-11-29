
/**
 * Expose module
 */

module.exports = exports;


/**
 * Converts a query's `where` constraints on IDs to .identifiers[]
 *
 * Requires being invoked as .call( query ) to set 'this' correctly
 *
 * @this query
 * @private
 */

exports.convertIdConstraints = function () {
  if ( !this.constraints )
    throw new Error('Must call using `.call( this )`');

  var idfield = this.idField || 'id';

  for (var i=0; i < this.constraints.length; i++) {
    var whr = this.constraints[ i ];

    if (whr.field === idfield) {
      // Skip anything except `eq` and `in` operators
      if ( whr.operator !== 'eq' && whr.operator !== 'in' ) continue;

      whr.condition instanceof Array
        ? this.identifiers = this.identifiers.concat( whr.condition )
        : this.identifiers.push( whr.condition );

      // Remove this constraint
      this.constraints.splice( i, i+1 );
    }
  }
};
