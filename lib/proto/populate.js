
/**
  Export module
*/

module.exports = exports;


/**
  Specify a field on the resource to 'populate' (optionally driven by a sub-Qe)

  May optionally pass:

  - `key` {String} field to identify/associate on
  - `query` {Qe} Qe governing populate of field

  ```js
  query().from('users')
    .populate('posts', 'posts_id')
    .populate('following', {on:'users'} )
    .populate('tags', 'tag_key', {limit:10} );
  ```

  @param {String} field
  @param {String} [key] Optional second param - field to associate on
  @param {Qo} [query] Optional second OR third param

  @throws {Error} When setting populate prior to specifying a resource
  @throws {Error} On passing a "non-find" style sub-Qe

  @public
*/

exports.populate = function (field) {
  if (!this.qe.on)
    throw new Error('Query#populate(field) requires .on to be set');

  var key = null;
  var subqe = null;

  if (arguments.length > 1) {
    if ('string' === typeof arguments[1]) key = arguments[1];
    else subqe = arguments[1];

    if (arguments[2]) subqe = arguments[2];
  }

  // Throw on subqo that are not conformant to populate Qo spec
  if (subqe) {
    if (subqe.updates || subqe.body)
      throw new Error('Invalid populate Qe');
  }

  if (!this.qe.populate) this.qe.populate = {};

  var po = {};
  if (key) po.key = key;
  if (subqe) po.query = subqe;

  // Overwrites any existing field of the same name
  this.qe.populate[field] = po;

  return this;
};
