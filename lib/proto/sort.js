module.exports = exports;

// -- Sorting
exports.asc = function( index ) {
  this.paging.sort[0].direction = 'asc';
  if (index) this.paging.sort[0].index = index;

  return this;
};

exports.desc = function( index ) {
  this.paging.sort[0].direction = 'desc';
  if (index) this.paging.sort[0].index = index;

  return this;
};

exports.order = function( index ) {
  this.paging.sort[0].index = index;
  return this;
};
