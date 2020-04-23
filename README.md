# passport-xero-oauth2



This is a Xero OAuth2 authentication strategy for [Passport.js](http://passportjs.org/). Passport is authentication middleware for Node.js that can be unobtrusively dropped into any Express-based web application.

[![Build Status](https://github.com/accountsguardian/passport-xero-oauth2/workflows/Node.js%20CI/badge.svg)](https://github.com/accountsguardian/passport-xero-oauth2)
[![npm](https://img.shields.io/npm/dm/passport-xero-oauth2)](https://npmjs.org/package/passport-xero-oauth2)
[![License](http://img.shields.io/:license-mit-blue.svg?style=flat)](https://opensource.org/licenses/MIT)

## Table of Contents

- [Installation](#installation)
- [Customization](#customization)
- [License](#license)

## Installation

The Xero Passport strategy is installed with npm.

    npm install passport-xero-oauth2

## Customization

### State parameter

The Xero Passport strategy enforces the use of the `state` parameter in OAuth 2.0 [authorization requests](https://tools.ietf.org/html/rfc6749#section-4.1.1) and requires session support in Express to be enabled.

If you require the `state` parameter to be omitted (which is not recommended), you can suppress it when calling the Xero Passport strategy constructor:

```js
const XeroStrategy = require('passport-xero-oauth2');
const strategy = new XeroStrategy({
     // ...
     state: false
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    // ...
  }
);
```

### Scopes

If you want to change the scope of the ID token provided, add a `scope` property to the authenticate configuration passed when defining the route.

```js
app.get(
	'/login',
	passport.authenticate('xero', {scope: 'openid email profile'}),
	function (req, res) {
		res.redirect('/');
	}
);
```

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
