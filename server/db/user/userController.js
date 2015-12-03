var Promise = require('bluebird');
var passport = require('passport');
var jwt = require('jwt-simple');
var User = require('./userModel.js');
var Recipe = require('../recipe/recipeModel.js');


exports.getUserList = function(req, res, next) {
  var user = jwt.decode(req.body.token, 'supersecret');
  User.findOne({
    'local.email': user.local.email
  }, 'recipeCollection', function(err, doc){
    if(err){
      res.send(404);
    } else {
      res.send(doc);
    }
  });
};

exports.updateUserList = function(req, res, next) {
  var user = jwt.decode(req.body.token, 'supersecret');
  User.update({
    'local.email': user.local.email
  }, {
    $set: {
      'recipeCollection': req.body.list
    }
  }, {}, function(err, affected) {
    res.send(user);
  });
};


/**
 * Find a single user regardless of signup strategy used
 * @param  {object}   user     
 * @return {object}           found user profile
 */
exports.findUser = function(user) {
  var query = {};
  if (google.id) {
    query = {
      'google.id': user.goggle.id
    };
  } else {
    query = {
      'local.email': user.local.email
    };
  }
  return new Promise(function(reject, resolve) {
    User.findOne(query, function(err, profile) {
      if (err) {
        reject(err);
      } else {
        resolve(profile);
      }
    });
  });
};

/**
 * Handles Registration for a new user using passport local strategy
 * Successful registration sends back DB user object into authenticate callback function
 */
exports.register = function(req, res, next) {
  passport.authenticate('local-signup', function(err, user, info) {
    // Signup error
    if (err) {
      return res.send({
        token: false,
        err: err
      });
    }
    // No user returned
    if (!user) {
      return res.send({
        token: false,
        err: info
      });
    }
    // Successfully registers new user
    // Log them in
    var token = jwt.encode(user, 'supersecret');
    return res.status(200).send({
      token: token
    });
  })(req, res, next);
};


/**
 * Login an existing user
 */
exports.login = function(req, res, next) {
  passport.authenticate('local-login', function(err, user, info) {
    if (err) {
      return res.send({
        token: false,
        err: err
      });
    }
    if (!user) {
      return res.send({
        token: false,
        err: info
      });
    }
    var token = jwt.encode(user, 'supersecret');
    return res.status(200).send({
      token: token
    });
  })(req, res, next);
};

/**
 * Not implemented
 */
exports.googleCallback = function(req, res, next) {
  // checking to see if the user is authenticated
  // grab the token in the header if any
  // then decode the token, which we end up being the user object
  // check to see if that user exists in the database
  console.log(req.query.code.slice(2));
  var token = req.query.code.slice(2);
  if (!token) {
    next(new Error('No token'));
  } else {
    var user = jwt.decode(token, 'secret');
    UserController.findUser(user, function(foundUser) {
      if (foundUser) {
        res.send(200);
      } else {
        res.send(401);
      }
    });
  }
};
