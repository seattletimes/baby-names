// Angular table

require("component-responsive-frame/child");

require("angular");
var app = angular.module("baby-names", []);
var util = require("./util");

app.controller("NamesController", ["$scope", function($scope) {
  var all = namesData;

  $scope.fresh = true;

  $scope.search = util.debounce(function() {
    var value = $scope.searchText;
    if (!value) {
      $scope.found = [];
      $scope.fresh = true;
    } else {
      value = value.toLowerCase();
      var filtered = all.filter(function(item) {
        return item.name.toLowerCase().indexOf(value) > -1;
      });
      $scope.found = filtered.sort(function(a,b) {
        if (a.name == b.name) {
          if (a.year > b.year) {
            return -1
          } else if (a.year < b.year) {
            return 1
          }
        } else if (a.name > b.name) {
          return 1
        } else if (a.name < b.name) {
          return -1
        }
      });
      $scope.fresh = false;
    }
    $scope.$apply();
  });

  $scope.found = [];
}]);

