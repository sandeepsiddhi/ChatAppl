angular.module('TravelGuide.controllers', ['ionic', 'ui.router', 'TravelGuide.services'])
  
  .controller('RegisterCtrl', function ($scope, MongoRESTService) {
    $scope.Register = function (data) {
      var id = MongoRESTService.register(data);
      console.log(id);

    }
  })
  .controller('HomeCtrl', function ($scope, MongoRESTService) {
    $scope.user = {};

  });

