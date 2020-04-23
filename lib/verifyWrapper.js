var jwt = require ('./jwt');

/**
 * Adds ID token validation to Passport verification process.
 *
 * Parent passport-oauth2 library handles the verifier based on the number
 * of arguments and changes the order if passReqToCallback is passed
 * in with the strategy options. This wrapper will make the length of
 * arguments consistent and add support for passReqToCallback.
 *
 * @param {Function} verify
 * @param {Object} strategyOptions
 * @param {Object} authParams
 */
function verifyWrapper (verify, strategyOptions, authParams) {

  if (strategyOptions.passReqToCallback) {
    return function (req, accessToken, refreshToken, params, profile, done) {
      profile = handleIdTokenValidation(strategyOptions, authParams, params);
      verify.apply(null, arguments);
    }
  } else {
    return function (accessToken, refreshToken, params, profile, done) {
      profile = handleIdTokenValidation(strategyOptions, authParams, params);
      verify.apply(null, arguments);
    }
  }
}

/**
 * Perform ID token validation if an ID token was requested during login.
 *
 * @param {Object} strategyOptions
 * @param {Object} authParams
 * @param {Object} params
 */
function handleIdTokenValidation (strategyOptions, authParams, params) {
  if (authParams && authParams.scope && authParams.scope.includes('openid')) {
    var decoded = jwt.verify(params.id_token, {
      aud: strategyOptions.clientID,
      iss: 'https://identity.xero.com',
      leeway: strategyOptions.leeway,
      maxAge: strategyOptions.maxAge
    });
    return {
      email: decoded.payload.email,
      xero_userid: decoded.payload.xero_userid,
      preferred_username: decoded.payload.preferred_username,
      given_name: decoded.payload.given_name,
      family_name: decoded.payload.family_name
    };
  }
  return {};
}

module.exports = verifyWrapper;
