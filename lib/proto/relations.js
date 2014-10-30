
/**
  Setup exports reference
*/

module.exports = exports;


/**
  Specify fields on the resource to return a full lookup

  @param {String|String[]} fields Any document fields to lookup
  @alias populate
  @public
*/

exports.include =
exports.populate = function( fields, opts, cb ) {
  if (!this.resource)
    throw new Error('Query#include(fields) requires .from() to be set');

  if (fields) {
    // Cast a string `fields` as an array
    if (typeof fields === 'string') fields = [fields];

    for (var i=0; i<fields.length; i++) {
      // Defaults lookup key on foreign resource to `{resource}_id`
      var inc = {
        field: fields[i],
        key: this.resource+'_id'
      };
      this.includes.push( inc );
    }
  }

  return this;
};


/**
  Set a key to bind the association. Default is `{resource}_id`. Requires
  that `.include( fields... )` has been set.

  @param {String} key
  @public
*/

exports.key = function( key ) {
  if (key) {
    if (!this.includes.length)
      throw new Error('Query#key(key) requires .include(fields) to be set');

    this.includes[ this.includes.length-1 ].key = key;
  }
  return this;
};
