module.exports = exports;

// -- Associations

// Specify a field on the resource to return a full lookup
// @alias populate
exports.include = exports.populate = function() {
  if (!this.resource)
    throw new Error('Query#include(fields) requires .from() to be set');

  if (arguments) {
    for (var i=0; i<arguments.length; i++) {
      // Defaults lookup key on foreign resource to `{resource}_id`
      var inc = {
        field: arguments[i],
        key: this.resource+'_id'
      };
      this.includes.push( inc );
    }
  }

  return this;
};

// Set a key to bind the association
exports.key = function( key ) {
  if (key) {
    if (!this.includes.length)
      throw new Error('Query#key(key) requires .include(fields) to be set');

    this.includes[ this.includes.length-1 ].key = key;
  }
  return this;
};
