
module.exports = exports;

// -- Associations
exports.includes = function() {
  if (!this.resource)
    throw new Error('Query#includes(fields) requires .from() to be set');

  if (arguments) {
    for (var i=0; i<arguments.length; i++) {
      // Default key to associate on `{resource}_id`
      var inc = {
        field: arguments[i],
        key: this.resource+'_id'
      };
      this.associations.push( inc );
    }
  }

  return this;
};

// Set a key to bind the association
exports.key = function( key ) {
  if (key) {
    if (!this.assocations.length)
      throw new Error('Query#key(key) requires .includes(fields) to be set');

    this.associations[ this.associations.length-1 ].key = key;
  }
  return this;
};
