var express = require('express');
var db      = require('./db/config');
var config  = require('./config/config');

var app = express();
var port = process.env.PORT || 8000;

/**
 * Set up Middleware
 */
require('./config/middleware.js')(app, express);

app.listen(port);
console.log('Making digital magic on port ' + port);
// Export app for index.js
module.exports = app;

