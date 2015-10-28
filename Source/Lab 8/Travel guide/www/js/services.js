var services = angular.module("TravelGuide.services", []);

var url = "http://localhost:9080/TravelGuideRest/user";

services.factory('MongoRESTService', function($http) {
    return {
      login: function(username, password, callback) {

        var res = $http.get(url+"?name="+txt_uname+"&password="+txt_pwd);

        res.success(function(data, status, headers, config) {
          console.log(data);
          callback(data);
        });
        res.error(function(data, status, headers, config) {
          console.log(data);
        });
      },

      register: function(user) {
        console.log(user);
        var res = $http.post(url, user);

        res.success(function(data, status, headers, config) {
          console.log(data);
        });
        res.error(function(data, status, headers, config) {
          console.log(data);
        });
      }
    }
});
