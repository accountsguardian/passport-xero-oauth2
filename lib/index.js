/**
 * Module dependencies.
 */
var util = require('util'),
  OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
  crypto = require('crypto');

var verifyWrapper = require('./verifyWrapper');

/**
 * `Strategy` constructor.
 *
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  [
    'clientID',
    'clientSecret',
    'callbackURL'].forEach(function (k) {
    if(!options[k]){
      throw new Error('You must provide the ' + k + ' configuration value to use passport-xero-oauth2.');
    }
  });

  options.customHeaders = typeof options.customHeaders === 'object' ? options.customHeaders : {};

  var defaultOptions = {
    authorizationURL: 'https://login.xero.com/identity/connect/authorize',
    tokenURL:         'https://identity.xero.com/connect/token',
    scope:            'openid profile email'
  }

  this.options = Object.assign({}, options, defaultOptions);

  if (this.options.state === undefined) {
    this.options.state = true;
  }

  this._base = Object.getPrototypeOf(Strategy.prototype);
  this._base.constructor.call(this, this.options, verify);

  this.name = 'xero';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.authenticate = function (req, options) {
  if (req.query && req.query.error) {
    return this.fail(req.query.error);
  }

  if (req.query.code) {
    // If the code parameter is present, authenticate() is being called on the callback route.
    this._verify = verifyWrapper(this._verify, this.options, req.session.authParams);
  } else {
    // If the code parameter is not present, authenticate() is being called on the login route.
    req.session.authParams = {};
    req.session.authParams.scope = options.scope;
    this.authParams = req.session.authParams
  }

  this._base.authenticate.call(this, req, options);
};


/**
 * Expose `Strategy` directly from package.
 */
exports = module.exports = Strategy;

/**
 * Export constructors.
 */
exports.Strategy = Strategy;
