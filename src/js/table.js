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
    if (!value || value.length < 2) {
      $scope.found = [];
      $scope.fresh = true;
    } else {
      value = value.toLowerCase();
      var filtered = all.filter(function(item) {
        return item.name.toLowerCase() == value;
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

    document.querySelector(".scroll").classList.remove("show");
    if (document.querySelector(".names-table").scrollHeight > 200) {
      document.querySelector(".scroll").classList.add("show");
    }
  });

  $scope.found = [];
}]);

