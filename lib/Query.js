
/**
  The Query object constructor

  @constructor
*/

module.exports = function Query() {

  // Internal reference to (optional) external adapter
  this.adapter;

  // Initialise a new `Qo`
  this.qo = {};

  // Pre and Post event middleware
  this.middleware = {
    pre: {},
    post: {}
  };

};
