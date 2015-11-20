
var app=angular.module('TravelGuide', ['ionic','ngCordova','TravelGuide.services','TravelGuide.controllers'])


var userLoginMode;
app.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
    .state('tabs', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })
  .state('tabs.login',{
  url:'/login',
        views: {
        'Login': {
          templateUrl: 'templates/login.html',
          controller: 'loginCtrl'
        }
      }
     
  })
  .state('tabs.home',{
  url:'/home',
      views:{
      'Home':{
      templateUrl:'templates/home.html',
          controller:'homeCtrlr'
      }
      }
  })
    .state('tabs.task',{
        url:'/task',
          views: {
        'Task': {
          templateUrl: 'templates/task.html',
          controller: 'myCtrl'
        }
      }
    })
  
  .state('tabs.accomodation',{
        url:'/accomodation',
          views: {
        'Task': {
          templateUrl: 'templates/tab-accomodation.html.html',
          controller: 'accomodationCtrl'
        }
      }
    })

.state('tabs.register',{
url:'/register',
    views:{
        'Register':{
        templateUrl:'templates/register.html',
            controller:'RegisterCtrl'
        }
    }
});

  // if none of the above states are matched, use this as the fallback
  
  $urlRouterProvider.otherwise('/tab/login');
  

})
.controller('loginCtrl', function($scope, $state, $q, UserService, $ionicLoading,$log,$state,$http,$cordovaOauth) {
     var loggedUserName;
    $scope.goToHome=function()
{
        if(document.getElementById('txt_Uname')){
    $scope.userName=document.getElementById('txt_Uname').value;
      
        document.getElementById('txt_Uname').value="";
        }
          if(document.getElementById('txt_Pwd')){
    $scope.password= document.getElementById('txt_Pwd').value;
        document.getElementById('txt_Pwd').value="";
          }
    if($scope.userName!=null && $scope.password!=null){
    $http( { url: "https://api.mongolab.com/api/1/databases/travelguide/collections/users?apiKey=1iwTCrjgXRLz-tbL9nznRtZRB5K9p_Zs",
		  method: "GET",
		  contentType: "application/json"}).then(onGetUserRecord_sucess,onGetUserRecord_failure);
    }
    function onGetUserRecord_sucess(result)
    {
        $scope.usersList=result.data;
       
        for(var i=0;i<usersList.length;i++)
        {
         if($scope.usersList[i].userName==$scope.userName && $scope.usersList[i].pwd==$scope.userName)
         {
         loggedUserName=$scope.usersList[i].name;
             break;
         }
        }
        if(loggedUserName!=null){
        alert("Welcome " + loggedUserName );
            userLoginMode = 'local';
           // $state.go('tabs.task');
            $state.go('tabs.home');
        }
    }
    function onGetUserRecord_failure(result)
    {
        alert("There was some issue. Please try again later");
    }

};
  // This is the success callback from the login method
  var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
      return;
    }

    var authResponse = response.authResponse;

    getFacebookProfileInfo(authResponse)
    .then(function(profileInfo) {
     loggedUserName = profileInfo.name;
      UserService.setUser({
        authResponse: authResponse,
				userID: profileInfo.id,
				name: profileInfo.name,
				email: profileInfo.email,
        picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=small"
      });
      $ionicLoading.hide();
      if(loggedUserName!=null){
        alert("Welcome " + loggedUserName );
           userLoginMode = 'fb';
            $state.go('tabs.home');
        }
    }, function(fail){
      // Fail get profile info
      console.log('profile info fail', fail);
    });
  };

  // This is the fail callback from the login method
  var fbLoginError = function(error){
    $log.info('fbLoginError'+ error);
    $ionicLoading.hide();
  };

  // This method is to get the user profile info from the facebook api
  var getFacebookProfileInfo = function (authResponse) {
    var info = $q.defer();

    facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
      function (response) {
				$log.info(response);
        info.resolve(response);
      },
      function (response) {
				$log.info(response);
        info.reject(response);
      }
    );
    return info.promise;
  };

  //This method is executed when the user press the "Login with facebook" button
  $scope.facebookSignIn = function() {
    facebookConnectPlugin.getLoginStatus(function(success){
      if(success.status === 'connected'){
        // The user is logged in and has authenticated your app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed request, and the time the access token
        // and signed request each expire
        console.log('getLoginStatus', success.status);

    		// Check if we have our user saved
    		var user = UserService.getUser('facebook');
            $log.info(JSON.stringify(user));
    		if(!user.userID){
                $log.info(JSON.stringify(user.userID));
					getFacebookProfileInfo(success.authResponse)
					.then(function(profileInfo) {
						loggedUserName = profileInfo.name;
                    $log.info(loggedUserName);
						UserService.setUser({
							authResponse: success.authResponse,
							userID: profileInfo.id,
							name: profileInfo.name,
							email: profileInfo.email,
							picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
						});

						if(loggedUserName!=null){
        alert("Welcome " + loggedUserName );
           userLoginMode = 'fb';
            $state.go('tabs.home');
        }
					}, function(fail){
						// Fail get profile info
						$log.info('profile info fail'+ fail);
					});
				}else{
                    loggedUserName = user.name;
                    if(loggedUserName!=null){
        alert("Welcome " + loggedUserName );
          userLoginMode = 'fb';
            $state.go('tabs.home');
        }
					
				}
      } else {
            $log.info('getLoginStatus'+ success.status);

				$ionicLoading.show({
          template: 'Logging in...'
        });

				// Ask the permissions you need. You can learn more about
				// FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
        facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
      }
    });
  };
       
    $scope.googlePlusLogin=function(){
        $cordovaOauth.google("925864935347-vacguv5ngpljfc9rffo6nmh9jk3u7ll2.apps.googleusercontent.com", ["email"]).then(function(result) {
            $log.info(JSON.stringify(result));
        $state.go('tabs.home');
        }, function(error) {
        alert('The login has failed');
        });
    }

    $scope.redirectToRegistration=function()
    {
    $state.go('tabs.register');
    };
})


app.controller('myCtrl',function($scope,$ionicPlatform,$cordovaLocalNotification,$ionicPopup,$ionicModal,$http){
var index;
    $scope.tasks;
    $http( { url: "https://api.mongolab.com/api/1/databases/travelguide/collections/userTasks?apiKey=1iwTCrjgXRLz-tbL9nznRtZRB5K9p_Zs",
		  method: "GET",
		  contentType: "application/json"}).then(onGetUserTask_sucess,onGetUserTask_failure);
      function onGetUserTask_sucess(result)
      {
if(result!=null && result.data!=null){                    
$scope.tasks=result.data;
    index=($scope.tasks.length!=0)?$scope.tasks.length:1;
}
      }
function onGetUserTask_failure(result)
      {
      
      }
//    $scope.tasks=[
//        {title: 'Task 1',descp:'This task is for studying',count:index++},
//        {title: 'Task 2', descp:'This task is for playing',count:index++},
//        {title: 'Task 3', descp:'This task is for eating',count:index++}
//]
  
$ionicModal.fromTemplateUrl('templates/new-task.html',function(modal){
    $scope.taskModal=modal;},{
    scope: $scope,
    animation: 'slide-in-up'
                              
});
     
$ionicModal.fromTemplateUrl('templates/task-info.html',function(modal){
    $scope.showModal=modal;},{
    scope: $scope,
    animation: 'slide-in-up'
                              
});
         $ionicModal.fromTemplateUrl('templates/notifications.html',function(modal){
    $scope.notifyModal=modal;},{
    scope: $scope,
    animation: 'slide-in-up'
                              
});
    // Called when the form is submitted
  $scope.createTask = function() {
    task ={};
      task.title=document.getElementById('txt_title').value;
      task.descp=document.getElementById('txt_descp').value;
      task.count=index++;
      $http( { url: "https://api.mongolab.com/api/1/databases/travelguide/collections/userTasks?apiKey=1iwTCrjgXRLz-tbL9nznRtZRB5K9p_Zs",
		  data: JSON.stringify(task),
		  method: "POST",
		  contentType: "application/json"}).then(function sucess(result){onCreateUserTask_sucess(result,task);},onCreateUserTask_failure);
      function onCreateUserTask_sucess(result,task)
      {
          alert("The task " +task.title + " has been created");
          $scope.tasks.push(task);
            document.getElementById('txt_title').value='';//Resetting the values.##
      document.getElementById('txt_descp').value='';
           $scope.taskModal.hide();
         
    
      }
function onCreateUserTask_failure(result)
      {
      alert("This task could not be created. Please try again.");
           $scope.taskModal.hide();
   
      }
      
   
  };
    
$scope.updateTask=function(taskToBeUpdated)
{
    if(taskToBeUpdated!=null){  
    for (var i=0;i<$scope.tasks.length;i++){
    if($scope.tasks[i].count==taskToBeUpdated.count){
        //$scope.tasks[i]=taskToBeUpdated;
        var changedTitle = document.getElementById("txt_Changed_Title").value.toString();
        var changedDescp = document.getElementById("txt_Changed_Descp").value.toString();
        $http( { url: 'https://api.mongolab.com/api/1/databases/travelguide/collections/userTasks?apiKey=1iwTCrjgXRLz-tbL9nznRtZRB5K9p_Zs&q={"count":' +taskToBeUpdated.count +'}',
 data: JSON.stringify( { "$set" : { 'title' : changedTitle, 'descp': changedDescp } } ),	  
method: "PUT",
		  contentType: "application/json"}).then(onUpdateUserTask_sucess,onUpdateUserTask_failure);
      function onUpdateUserTask_sucess(result)
      {
if(result.data!=null){                    
//$scope.tasks[i]=result.data;
   alert("The task " + changedTitle + " has been updated successfully.");    
     $scope.showModal.hide();
}
      }
function onUpdateUserTask_failure(result)
      {
      alert("This task could not be updated. Please try again.");
          
      }
        
        break;
    }
    
        }
    }

};
    $scope.deleteTask =function(taskIdToBeDeleted)
    {
    var taskToBeDeleted=getSelectedTask(taskIdToBeDeleted);
        if(taskToBeDeleted!=null)
        {
                $http( { url: 'https://api.mongolab.com/api/1/databases/travelguide/collections/userTasks/'+taskToBeDeleted._id.$oid +'?apiKey=1iwTCrjgXRLz-tbL9nznRtZRB5K9p_Zs',
 method: "DELETE",contentType: "application/json"}).then(onDeleteUserTask_sucess,onDeleteUserTask_failure);
      function onDeleteUserTask_sucess(result)
      {
if(result!=null){ 
    var positionOfTaskInLIst=getPositionOfTask(taskIdToBeDeleted);
    $scope.tasks.splice(positionOfTaskInLIst,1);//Removing deleted element from array.##
   alert("The task " + taskToBeDeleted.title + " has been deleted successfully.");
     //$scope.showModal.hide();
}
      }
function onDeleteUserTask_failure(result)
      {
      alert("This task could not be deletedd. Please try again.");
          
      }
        }

    }

    function getSelectedTask(idOfTaskToBeSelected)
        {
            var selectedTask;
             for (var i=0;i<$scope.tasks.length;i++){
    if($scope.tasks[i].count==idOfTaskToBeSelected){
        selectedTask=$scope.tasks[i];
        return selectedTask;
        
    }
    
        }
        
        };
     function getPositionOfTask(idOfTaskToBeSelected)
        {
                     for (var i=0;i<$scope.tasks.length;i++){
    if($scope.tasks[i].count==idOfTaskToBeSelected){
       return i;
        
    }
    
        }
        
        };
  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
   // var textDate=document.getElementById('txt_Date');
      //textDate.style.display= "none";
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
      $scope.showModal.hide();
  };
    $scope.showPopUp=function(valueOfTaskToBeSelected)
    {
       
 
        if(valueOfTaskToBeSelected!=undefined && valueOfTaskToBeSelected!=null)
        {
    $scope.selectedTask=getSelectedTask(valueOfTaskToBeSelected);
        if($scope.selectedTask!=null)
                   $scope.showModal.show();
        }
    };
       
        $scope.showNotification =function(taskId){ 
            if(taskId!=undefined && taskId!=null)
            $scope.selectedTask=getSelectedTask(taskId);
            $scope.notifyModal.show();
       };
         $scope.closeModal=function()
    {
       $scope.notifyModal.hide();
    };
    $ionicPlatform.ready(function() {
         $scope.getNotificationIds = function () {
			$cordovaLocalNotification.getScheduledIds().then(function (scheduledIds) {
				
				$scope.result = [];
				
				for(var key in scheduledIds) {
                    if(scheduledIds[key]!=null){
					var row = {'id': scheduledIds[key]};
                    $scope.result.push(row);
                    }
				}
			});
		};
$scope.getNotificationIds();
   $scope.addNotification = function (task) {
			var dateToBeSet=document.getElementById('txt_date').value.toString();
			var timeToSet=document.getElementById('txt_time').value.toString();
			var dateAndTimeToBeSet=dateToBeSet +" " + timeToSet + ":00"; //By default adding the milli seconds as 0.##
       dateAndTimeToBeSet =new Date(dateAndTimeToBeSet);
            var now = new Date().getTime(),
			_10_seconds_from_now = new Date(now + 10*1000);
			
			$cordovaLocalNotification.isScheduled(task.count).then(function(isScheduled) {
				if (isScheduled){
					$ionicPopup.alert({
						title: "Warning",
						template: "Notification with this ID is already scheduled"
					}).then(function(result) {
						//task.id = "";
					});
				}else{
					$cordovaLocalNotification.add({
						id:      task.count,
						title:   'Notification',
						message: task.descp,
						repeat:  'daily',
						date:    dateAndTimeToBeSet
					});
					
					$ionicPopup.alert({
						title: "Done",
						template: "Your notification set for " + dateAndTimeToBeSet+ " seconds from now."
					}).then(function(result) {
						$scope.notifyModal.hide();
						$scope.getNotificationIds();
						//task.id = "";
                     //  $scope.messagesStore[$scope.messagesStore.length]=task.msg;
						//task.msg = "";
					});
				}
			});
		};
    $scope.cancelNotification = function (id) {
			$cordovaLocalNotification.cancel(id).then(function () {
				alert('Callback for cancellation background notification'); // never get called
			});
			
			$ionicPopup.alert({
				title: "Done",
				template: "Notification " + id + " is cancelled"
			}).then(function(res) {
				$scope.getNotificationIds();
			});
			
		};

   
    });
     
})
app.controller('registrationCtrlr',function($scope,$state,$http){

    $scope.completeRegistration=function()
{
        var userRecord={};
         userRecord.name=document.getElementById('txt_name').value;
        userRecord.userName=document.getElementById('txt_uname').value;
        userRecord.pwd=document.getElementById('txt_pwd').value;
        userRecord.mobile=document.getElementById('txt_mobile').value;
        
        
$http( { url: "https://api.mongolab.com/api/1/databases/travelguide/collections/users?apiKey=1iwTCrjgXRLz-tbL9nznRtZRB5K9p_Zs",
		  data: JSON.stringify(userRecord),
		  method: "POST",
		  contentType: "application/json"}).then(function sucess(result){onUserRecord_sucess(result,userRecord);},function failure(result){onUserRecord_failure;});

}
    function onUserRecord_sucess(result,userRecord)
    {
    alert("Thank you " + userRecord.name +". You can now login to the system using the username " + userRecord.userName + " and the password you provided");
    $state.go('tabs.login');
    }
    function onUserRecord_failure(result)
    {
    alert("There was some issue signing you up. Please try again after some time.");
    }


})

app.controller('homeCtrlr',function($scope,$scope, UserService, $ionicActionSheet, $state, $ionicLoading,$log)
               {
$scope.openTasksToDo = function()
{
$state.go('tabs.task');
}
$scope.user = UserService.getUser();
    
$scope.userLogout = function()
{
     $log.info("The controller method 1 has been called");
    
    if(userLoginMode!=null)
    {
        $log.info(userLoginMode);
        if(userLoginMode=='fb'){
            $scope.showFBLogOutMenu();
            
        }
        else if(userLoginMode=='local')
        {
        $scope.showLogoutMenu();
        }
        else if(userLoginMode=='google')
        {
            $scope.showGoogleLogout();
        }
    }
}


	$scope.showFBLogOutMenu = function() {
        $log.info('The controller has been directed to');
		var hideSheet = $ionicActionSheet.show({
			destructiveText: 'Logout',
			titleText: 'Are you sure you want to logout?',
			cancelText: 'Cancel',
			cancel: function() {},
			buttonClicked: function(index) {
				return true;
			},
			destructiveButtonClicked: function(){
				$ionicLoading.show({
				  template: 'Logging out...'
				});

        // Facebook logout
        facebookConnectPlugin.logout(function(){
          $ionicLoading.hide();
            userLoginMode="";
          $state.go('tabs.login');
        },
        function(fail){
          $ionicLoading.hide();
        });
			}
		});
	}
    
    $scope.showLogoutMenu =function()
    {
        $log.info("The lgout method is being hit");	
        var hideSheet = $ionicActionSheet.show({
			destructiveText: 'Logout',
			titleText: 'Are you sure you want to logout?',
			cancelText: 'Cancel',
			cancel: function() {},
			buttonClicked: function(index) {
				return true;
			},
			destructiveButtonClicked: function(){
				$ionicLoading.show({
				  template: 'Logging out...'
				});

       userLoginMode="";
                 $ionicLoading.hide();
          $state.go('tabs.login');
			}
		})
    };

});