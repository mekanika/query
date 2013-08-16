module.exports = exports;


// Specify fields to return as object
exports.select = function( /* fields, field2, ... */ ) {
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


// -- Active resource selector
exports.from = function( resource ) {
  if (typeof resource !== 'string')
    throw new Error('Query#from(resource) requires `resource` as a string');

  this.resource = resource;

  return this;
};
