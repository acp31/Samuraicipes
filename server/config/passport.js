var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../db/user/userModel.js');

module.exports = function(passport) {

  /**
   * Passport serialize/deserialize functions
   */
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  /**
   * Local Signup Strategy
   */

  passport.use('local-signup', new LocalStrategy({
    // Can overwrite default names for the username and password
    // ex. usernameField: 'email' to check user by email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true

  }, function(req, email, password, done) {

    User.findOne({
      'local.email': email
    }, function(err, user) {
      if (err) {
        return done(err);
      }

      // If user already exists
      if (user) {
        return done(null, false, 'That email is already taken!');
      } else {
        // Create and save new user
        var newUser = new User();

        newUser.local.email = email;
        // TODO --> Add generateHash function to User model
        newUser.local.password = newUser.generateHash(password);

        newUser.save(function(err) {
          if (err) {
            throw err;
          }

          return done(null, newUser);
        });
      }
    });
  }));



  /**
   * Local Login Strategy
   */

  passport.use('local-login', new LocalStrategy({
    // Can overwrite default names for the username and password
    // ex. usernameField: 'email' to check user by email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true

  }, function(req, email, password, done) {
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    // TODO --> Resolve with DB
    User.findOne({
      'local.email': email
    }, function(err, user) {
      // if there are any errors, return the error before anything else
      if (err)
        return done(err);

      // if no user is found, return the message
      if (!user)
        return done(null, false, 'User not found');

      // if the user is found but the password is wrong
      // TODO --> Add validPassword method to user model
      if (!user.validPassword(password))
        return done(null, false, 'Wrong Password'); 

      // all is well, return successful user
      return done(null, user);
    });
  }));



  /**
   * Google Authentication Strategy
   */ 
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    function(token, refreshToken, profile, done) {
      // try to find the user based on their google id
      User.findOne({
        'google.id': profile.id
      }, function(err, user) {
        
        if (err)
          return done(err);

        if (user) {

          // if a user is found, log them in
          return done(null, user);
        } else {
          // if user is not in the DB, add a new user
          var newUser = new User();

          // set all user info
          newUser.google.id = profile.id;
          newUser.google.token = token;
          newUser.google.name = profile.displayName;
          newUser.google.email = profile.emails[0].value; // pull the first email

          console.log(newUser);
          // save the user
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
  }));





};
