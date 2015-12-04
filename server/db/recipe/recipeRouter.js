var request = require('request');
var auth    = require('../../config/auth.js');

module.exports = function(app) {
 
	// Search for a query string
  app.route('/search/:query')
    .get(function(req, res, next) {
      var query = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?ingredients=" + req.params.query + "&number=30";

      var options = {
        url: query,
        headers: {
          'X-Mashape-Key': auth.spoonacularAPIkey,
          'Accept': 'application/json'
        }
      };
      request(options, function(err, response, data) {
        if (err) {
          console.log(err);
        }
        console.log('data recieved from API request:', data); // debugging -- remove later
        res.status(200).send(data);
        next();
      });
    });

  // Will find a single recipe by ID
  app.route('/:recipeId')
    .get(function(req, res, next) {
      var query = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/" + req.params.recipeId + "/information";
      var options = {
        url: query,
        headers: {
          'X-Mashape-Key': auth.spoonacularAPIkey,
          'Accept': 'application/json'
        }
      };
      request(options, function(err, response, data) {
        if (err) {
          console.log(err);
        }
        console.log('data recieved from single ingredient API request: ', data); // debugging -- remove later
        res.status(200).send(data);
      });
    });
};
