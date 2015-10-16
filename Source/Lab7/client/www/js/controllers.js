angular.module('starter.controllers', [])


.controller('SignUpCtrl', function($rootScope,$scope,$http,$state,$ionicPopup) {
    
    
    
    $scope.user = {
        name : "",
        email: "",
        password: ""
    };
    
          $scope.createUser = function (username,email,password) {
        console.log("inside signup function");
        
            
$http({
    
method :'POST',
url :'https://api.mongolab.com/api/1/databases/userlogs/collections//users?apiKey=LXfAFUeZeAM_dhBbtNGTGFlRdts7QK7D',
data :JSON.stringify({
           name:this.username,
           email:this.email,
           password:this.password
         }),
contentType:"application/json"
}).success(function() {
    
    alert('success');
    
    
    $state.go('auth.signin');
      })
}
    	
 })
.controller('SignInCtrl', function ($rootScope,$scope,$httpParamSerializerJQLike,$http,$state,$ionicPopup) {
    
     $scope.user = {
        
        mail: "",
        password: ""
    };
   
$scope.pageClass = 'login';
$scope.validateUser = function(email,password) {
   console.log("inside login function");
$http({
    method: 'get',
    url :'https://api.mongolab.com/api/1/databases/userlogs/collections//users?apiKey=LXfAFUeZeAM_dhBbtNGTGFlRdts7QK7D',
    find: JSON.stringify({
        
                email:email,
                password:password
               
            }),
    contentType: "application/json"
}).success(function(sourcedata) {
  for(var i=0;i<sourcedata.length;i++)
{   
if(sourcedata[i].email==email && sourcedata[i].password==password)
{
    
    console.log("done checking");
    alert('credentials matched');
    
     var Popup = $ionicPopup.alert({
                title: 'success!',
                template: 'Logging in!'
     $state.go('auth.home');
    
}
    else
    {
        alert('credentials mismatched');
    var Popup = $ionicPopup.alert({
                title: 'failure!',
                template: 'Please check yor credentials!'
    console.log("credentials mismatched");
    })
}
    

});
     
}
})
}})
.controller('deleteCtrl', function($rootScope,$scope,$http,$ionicPopup) {
    $scope.deleteUser = function(username)
    
    {
        $http({
    method: 'delete',
    url :'https://api.mongolab.com/api/1/databases/userlogs/collections//users?apiKey=LXfAFUeZeAM_dhBbtNGTGFlRdts7QK7D',
        
            
            $scope.deleteUser($scope.username, $scope.password,$scope.email).success(function(data) {
            alert('account deleted successfully');
         var Popup = $ionicPopup.alert({
                title: 'Deleted',
                template: 'account deleted '
            });
		}).error(function(data) {
            var Popup = $ionicPopup.alert({
                title: 'delete failed!',
                template: 'invalid credentials'
            });
        });
		}
    
    
})
})
.controller('updatectrl', function($rootScope,$scope,$http,$ionicPopup) {
    
   
    $scope.updateUser = function(name,email,password) {
        
        
            $http({
            
  method: 'PUT',
  url: 'https://api.mongolab.com/api/1/databases/userlogs/collections//users?apiKey=LXfAFUeZeAM_dhBbtNGTGFlRdts7QK7D&q={"name":"'+name+'"}',
           data :JSON.stringify({"$set":{
           
           "email":this.email,
           "password":this.password}
         }),     
  
    .success(function (data) {
                $scope.ServerResponse = data;
                alert('user details updated successfully');
                var Popup = $ionicPopup.alert({
                title: 'Updated!',
                template: 'The user details are updated!'
                
            
            }
            
            
    })
    }
})



});
