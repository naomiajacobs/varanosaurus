process.env['NODE_ENV'] = 'testing';
process.env['TOKEN_SECRET'] = 'testing';

var request = require('request');
var inviteUrl = 'http://localhost:5000/api/invitations/';
// var authUrl = 'http://localhost:5000/auth';
var db = require('../../server/db/interface');
var tokens = require('../../server/services/tokens');

//really-need lets us easily clear node's cache
//after each test so that we can have a clean
//server instance before the next text
var needRequire = require('really-need');

//TODO: add spec testing that we get invitation householdName properly
//TODO: add spec testing that we send back all invites upon update
describe('invitationRouter', function() {

  var server;

  beforeEach(function(done) {
    var context = this;

    this.headers = {'Content-Type': 'application/json'};

    server = needRequire('../../server/server', {bustCache: true, keep: false});

    db.init()
      .catch(done.fail.bind(done))

      .then(function() {
        return db.User.bulkCreate(
          [
            {
              username: 'redstarter',
              password: 'broioioing',
            },
            {
              username: 'sylkal',
              password: '4dmathshapes',
            },
          ]
        );
      })

      .then(function() {
        return db.Household.create({name: 'Bro Palace'});
      })

      .then(function(household) {
        return db.User.findOne({where: {username: 'sylkal'}})
          .then(function(user) {
            household.addUser(user);
            user.setHousehold(household);
            context.headers['X-Access-Token'] = tokens.issue(user.id, household.id);
          });
      })

      .then(done);

  }); // beforeEach

  afterEach(function(done) {
    server.close(done);
  });

  it('should allow Gary to invite Michael to the household', function(done) {

    request({
          method: 'POST',
          headers: this.headers,
          url: inviteUrl,
          body: JSON.stringify({
                      toUsername: 'redstarter',
                    }),
    }, function(err, response, body) {

      var parsedBody = JSON.parse(body);

      expect(err).toBeNull();
      expect(response.statusCode).toEqual(201);
      expect(Array.isArray(parsedBody.invitations)).toBeTruthy();
      expect(parsedBody.invitations[0].toUserId).toEqual(1);
      done();
    });

  }); // 'should allow Gary to invite Michael to the household'

  it('should allow Gary to retrieve the invitations he\'s sent', function(done) {

    var context = this;

    request({
      method: 'POST',
      headers: context.headers,
      url: inviteUrl,
      body: JSON.stringify({
        toUsername: 'redstarter',
      }),
    }, function(error, response) {

      if (error) {
        done.fail(error);
      }

      expect(response.statusCode).toEqual(201);

      request({
        method: 'GET',
        headers: context.headers,
        url: inviteUrl + '/outbox',
      }, function(error, response, body) {
        var parsedBody = JSON.parse(body);

        expect(response.statusCode).toEqual(200);
        expect(parsedBody).toBeTruthy();
        expect(parsedBody.invitations).toEqual(jasmine.any(Array));
        expect(parsedBody.invitations.length).toEqual(1);

        done();
      });

    });

  }); // 'should allow Gary to retrieve the invitations he\'s sent'

  it('should allow Michael to request his invites over HTTP', function(done) {

    var context = this;

    request({
      method: 'POST',
      headers: context.headers,
      url: inviteUrl,
      body: JSON.stringify({
        toUsername: 'redstarter',
      }),
    }, function(error, response) {

      if (error) {
        done.fail(error);
      }

      expect(response.statusCode).toEqual(201);

      db.User.findOne({where: {username: 'redstarter'}})

        .then(function(user) {
          context.headers['X-Access-Token'] = tokens.issue(user.id, user.householdId);
        })

        .then(function() {

          request({
            method: 'GET',
            headers: context.headers,
            url: inviteUrl + '/inbox',
          }, function(error, request, body) {
            var parsedBody = JSON.parse(body);

            expect(parsedBody).toBeTruthy();
            expect(parsedBody.invitations).toEqual(jasmine.any(Array));
            expect(parsedBody.invitations.length).toEqual(1);
            done();
          });

        })

        .catch(done.fail.bind(done));


    });

  }); // 'should allow Michael to request his invites over HTTP'

  it('should allow Michael to accept Gary\'s invitation', function(done) {

    var context = this;

    request({
      method: 'POST',
      headers: context.headers,
      url: inviteUrl,
      body: JSON.stringify({
        toUsername: 'redstarter',
      }),
    }, function(err, response, body) {

      var parsedBody = JSON.parse(body);

      request({
        method: 'PUT',
        headers: context.headers,
        url: inviteUrl + parsedBody.invitations[0].id,
        body: JSON.stringify({
          status: 'accepted',
        }),
      },
      function(error, response, body) {

        var parsedBody = JSON.parse(body);
        expect(parsedBody.household).toBeTruthy();
        expect(parsedBody.token).toBeTruthy();
        expect(parsedBody.invitations.length).toEqual(0);
        done();

      });

    });

  });

  it('should allow Michael to reject Gary\'s invitation', function(done) {

    var context = this;

    request({
      method: 'POST',
      headers: context.headers,
      url: inviteUrl,
      body: JSON.stringify({
        toUsername: 'redstarter',
      }),
    }, function(err, response, body) {

      var parsedBody = JSON.parse(body);

      request({
        method: 'PUT',
        headers: context.headers,
        url: inviteUrl + parsedBody.invitations[0].id,
        body: JSON.stringify({
          status: 'rejected',
        }),
      },
      function(error, response, body) {

        var parsedBody = JSON.parse(body);
        expect(parsedBody.household).toBeFalsy();
        expect(parsedBody.invitations.length).toEqual(0);
        done();

      });

    });

  }); // 'should allow Michael to reject Gary\'s invitation'

  it('should allow Michael to delete an invite he doesn\'t care for', function(done) {

    var context = this;

    request({
          method: 'POST',
          headers: context.headers,
          url: inviteUrl,
          body: JSON.stringify({
                      toUsername: 'redstarter',
                    }),
    }, function(error, response, body) {

      var invitation = JSON.parse(body).invitations[0];

      if (error) {
        done.fail(error);
      }

      expect(response.statusCode).toEqual(201);

      db.User.findOne({where: {username: 'redstarter'}})

        .then(function(user) {
          context.headers['X-Access-Token'] = tokens.issue(user.id, user.householdId);
        })

        .then(function() {

          request({
            method: 'DELETE',
            headers: context.headers,
            url: inviteUrl + invitation.id,
          }, function(error, response) {
            expect(error).toBeFalsy();
            expect(response.statusCode).toEqual(200);

            db.Invitation.findAll()
              .then(function(invitations) {
                expect(invitations.length).toEqual(0);
              })
              .then(done);

          });

        })

        .catch(done.fail.bind(done));

    });

  }); // 'should allow Michael to delete an invite he doesn't care for'




}); // 'Invitation router'
