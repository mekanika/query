module.exports = exports;

// -- Paging
exports.limit = function( num ) {
  this.paging.limit = num;
  return this;
};

exports.offset = function( amount ) {
  this.paging.offset = amount;
  return this;
};

exports.page = function( page ) {
  if ( !this.paging.limit ) throw new Error('No limit set');
  this.paging.offset = page * this.paging.limit;
  return this;
};
