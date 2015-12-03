var request = require('request');
var auth    = require('../../config/auth.js');

angular.module('recipes')
  .controller('ShoppingListCtrl', ['$scope', '$rootScope', 'ShoppingList', function($scope, $rootScope, ShoppingList) {

    /**
     * Initialize List Data
     */
    var getUserList = function(){
      var deferred = ShoppingList.getUserList();
      if (deferred) {
        deferred
          .then(function(list) {
            $scope.list = list;
          });
      } else {
        $scope.list = list;
      }
    };

    getUserList();

    $rootScope.$on('userAction', function() {
      getUserList();
    });
    /**
     * Remove a recipe from the list and refreshes scope list with
     * recipes and ingredients
     * @param  {int} id [id of the recipe to remove]
     */
    $scope.removeItem = function(id) {
      ShoppingList.removeFromList(id);
      getUserList();
    };



    
  }]);
