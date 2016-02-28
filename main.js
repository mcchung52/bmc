'use strict';

var app = angular.module('app', []);

app.controller('formCtrl', ['$scope', '$timeout', function($scope, $timeout) {

  $scope.reset = function() {
    $scope.form = {
      userName: "",
      company: "",
      incidentTemp: "",
      autoAssign: false,
      incidentTitle: "",
      calcPrior: "High"
    };
    $scope.calcPriorClass = "btn-danger";
    $scope.showDropdown = false;
  }
  $scope.inputValid = function() {
    if ($scope.form.userName !== "" && 
        $scope.form.company !== "" && 
        $scope.form.incidentTitle !== "") {
      return false;
    } else {
      return true;
    }
  }
  $scope.calPriorClicked = function() {
    switch ($scope.form.calcPrior) {
      case "High":
        $scope.form.calcPrior = "Medium";
        $scope.calcPriorClass = "btn-warning";//yellow
        break;
      case "Medium":
        $scope.form.calcPrior = "Low";
        $scope.calcPriorClass = "btn-success";//green
        break;
      case "Low":
        $scope.form.calcPrior = "High";
        $scope.calcPriorClass = "btn-danger";//red
        break;
    };
  }
  $scope.save = function() {
      //give spinner or output status
      $('#Searching_Modal').modal('show');
      $timeout(function() {
        $('#Searching_Modal').modal('hide');
        $scope.reset();
      }, 3000);
  }
}]);

app.directive('userName', function() {
  return {
    replace: true,
    scope: {
      typeAhead: '@',
      form: '=formObj'
    },
    templateUrl: "userName.html",
        
    controller: function($scope, dataSvc){//, $http) {
      $scope.xClicked = function() {
        $scope.form.userName = "";
        $scope.users = [];
        //put focus on input box
      }
      $scope.populate = function(user) {
        $scope.form.userName = user.name;
        $scope.form.company = user.company;
      }
      $scope.nameChanged = function(queryStr) {
        if (queryStr.length >= $scope.typeAhead) {
          $scope.showDropdown = true;
          dataSvc.getResults(queryStr, function(data){
            console.log("data",data);
            $scope.users = data;
          });
        } else {
          $scope.showDropdown = false;
        }       
      }
    }
  }
});

app.service('dataSvc', function($http) {
  this.getResults = function(queryStr, cb) {
    $http.get("data.json")
    .then(function(data){ //success

      var result = data.data.filter(function(res) {
        return res.name.startsWith(queryStr);
      });
      cb(result);

    }, function(data){ //fail
      //console.log("data",data);
      cb(data);
    });
  }
});