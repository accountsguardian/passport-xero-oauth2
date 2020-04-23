var XeroStrategy = require('../lib');
var assert = require('assert');
var should = require('should');

describe('xero strategy', function () {
  beforeEach(function () {
    this.strategy = new XeroStrategy({
       clientID:     'testid',
       clientSecret: 'testsecret',
       callbackURL:  '/callback'
      },
      function(accessToken, idToken, profile, done) {}
    );
  });

  it('state should be true by default', function() {
    this.strategy.options.state.should.be.true();
  });

  it('should copy options object without mutating', function () {
    var options = {
      clientID:     'testid',
      clientSecret: 'testsecret',
      callbackURL:  '/callback'
    };
    var strategy = new XeroStrategy(
      options,
      function(accessToken, idToken, profile, done) {}
    );

    strategy.options.should.be.not.equal(options);
    options.should.not.have.property('authorizationURL');
  });

  describe('authenticate', function () {
    it('when there is an error querystring propagate', function (done) {

      this.strategy.fail = function (challenge, status) {
        challenge.should.eql('domain_mismatch');
        done();
      };

      this.strategy.authenticate({
        query: {
          error: 'domain_mismatch'
        }
      });
    });
  });
});

describe('xero strategy with state parameter disabled', function () {
  var strategy = new XeroStrategy({
    clientID:     'testid',
    clientSecret: 'testsecret',
    callbackURL:  '/callback',
    state: false
   },
   function(accessToken, idToken, profile, done) {}
  );

 it('state parameter should remain disabled', function() {
  strategy.options.state.should.be.false();
 });
});

describe('xero strategy with state parameter enabled explicitly', function () {
  var strategy = new XeroStrategy({
    clientID:     'testid',
    clientSecret: 'testsecret',
    callbackURL:  '/callback',
    state: true
   },
   function(accessToken, idToken, profile, done) {}
  );

 it('state parameter should be enabled', function() {
  strategy.options.state.should.be.true();
 });
});
