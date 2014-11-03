
/**
  Setup exports reference
*/

module.exports = exports;


/**
  Specify sorting order based on string keys (including `-` prefix strings)

  ```
  query().sort( "-age name" );
  ```

  @param {String} [keys] The space separated names of the field to sort on
  @public
*/

exports.sort = function( keys ) {

  if (!this.qo.sort) this.qo.sort = keys.split(' ');
  else this.qo.sort.push.apply( this.qo.sort, keys.split(' ') );

  return this;
};
