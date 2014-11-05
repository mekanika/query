
/**
  Export module
*/

module.exports = exports;


/**
  Specify a field on the resource to 'populate' (optionally driven by a subQo)

  @param {String} field
  @param {Qo} [subqo]

  @throws {Error} When setting populate prior to specifying a resource
  @throws {Error} On passing a "non-find" style subQo

  @public
*/

exports.populate = function (field, subqo) {
  if (!this.qo.resource)
    throw new Error('Query#populate(field) requires .resource to be set');

  // Throw on subqo that are not conformant to populate Qo spec
  if (subqo) {
    if (
      subqo.action && subqo.action !== 'find' ||
      subqo.updates ||
      subqo.body)
        throw new Error('Invalid populate Qo');
  }

  if (!this.qo.populate) this.qo.populate = {};

  // Note that this will overwrite an existing field, keeping fields unique
  this.qo.populate[ field ] = subqo || {};

  return this;
};
