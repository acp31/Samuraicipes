/**
 * Helper Functions
 * @type {Object}
 */
module.exports = {

  errorLogger: function(error, req, res, next) {
    // log the error then send it to the next middleware in
    // middleware.js

    console.error(error.stack);
    next(error);
  },

  errorHandler: function(error, req, res, next) {
    // send error message to client
    // message for gracefull error handling on app
    res.send(500, {
      error: error.message
    });
  },

  // Checks to see if user is logged in via passport
  restrict: function(request, response, next) {
    if (request.isAuthenticated()) {
      return next();
    } else {
      response.redirect('/login');
    }
  }
};
