
/**
  Export module
*/

module.exports = exports;


/**
  Specify a field on the resource to 'populate' (optionally driven by a subQo)

  May optionally pass:

  - `key` {String} field to identify/associate on
  - `query` {Qo} Qo governing populate of field

  ```js
  query().from('users')
    .populate('posts', 'posts_id')
    .populate('following', {resource:'users'} )
    .populate('tags', 'tag_key', {limit:10} );
  ```

  @param {String} field
  @param {String} [key] Optional second param - field to associate on
  @param {Qo} [query] Optional second OR third param

  @throws {Error} When setting populate prior to specifying a resource
  @throws {Error} On passing a "non-find" style subQo

  @public
*/

exports.populate = function (field) {
  if (!this.qe.on)
    throw new Error('Query#populate(field) requires .resource to be set');

  var key = null;
  var subqo = null;

  if (arguments.length > 1) {
    if ('string' === typeof arguments[1]) key = arguments[1];
    else subqo = arguments[1];

    if (arguments[2]) subqo = arguments[2];
  }

  // Throw on subqo that are not conformant to populate Qo spec
  if (subqo) {
    if (subqo.updates || subqo.body)
      throw new Error('Invalid populate Qo');
  }

  // Stores the index of any populate object of existing 'field'
  var insert;

  if (!this.qe.populate) this.qe.populate = [];

  // Find an existing field to populate
  else this.qe.populate.forEach( function (p, i) {
    if (p.field === field) insert = i;
  });

  var po = {field:field};
  if (key) po.key = key;
  if (subqo) po.query = subqo;

  // Overwrite if field exists, or simply add
  'undefined' !== typeof insert
    ? this.qe.populate[insert] = po
    : this.qe.populate.push( po );

  return this;
};
