var app = angular.module('starter', ['ionic',"angularMoment"])

app.controller("storyCtrl", function($http, $ionicPopup, $ionicScrollDelegate, $scope) {
  var keyword = "angularjs";
  var url = "https://www.reddit.com/r/" + keyword + "/new/.json";
  $scope.stories = [];

  function loadStories(params, callback) {
    $http.get(url, {params: params})
      .success(function (resp) {
        var stories = [];
        angular.forEach(resp.data.children, function(child) { 
          var story = child.data;
          if (!story.thumbnail || story.thumbnail == "self" || story.thumbnail == "default"){
              story.thumbnail = "https://www.redditstatic.com/icon.png"
          }
          stories.push(story);
        });
        callback(stories);
      })
      .error(function() {
        // console.log("faild")
        faildAlert()
      })
  };

  $scope.loadOlder = function() {
      var params = {};
      if ($scope.stories.length > 0 ) {
        params["after"] = $scope.stories[$scope.stories.length - 1].name;
      }
      loadStories(params, function(oldStories) {
        $scope.stories = $scope.stories.concat(oldStories);
        $scope.$broadcast("scroll.infiniteScrollComplete");
      });
  };

  $scope.loadNewer = function() {
      var params = {};
      params["before"] = $scope.stories[0].name
      loadStories(params, function(newStories) {
        $scope.stories = newStories.concat($scope.stories);
        $scope.$broadcast("scroll.refreshComplete");
      });
  };

  $scope.openLink = function (url) {
    window.open(url, "_blank");
  };

  $scope.search = function() {
    var searchVal = document.getElementById("search").value;
    keyword = searchVal?searchVal:keyword;
    url = "https://www.reddit.com/r/" + keyword + "/new/.json";
    console.log(keyword);
    $scope.stories = [];
    $scope.loadOlder()
  };

  $scope.clearBtn = function() {
    var searchVal = document.getElementById("search");
    searchVal.value = "";
  };

  faildAlert = function() {
   var alertPopup = $ionicPopup.alert({
     title: "Search Faild",
     template: keyword + " not in reddit"
   });

   alertPopup.then(function(res) {
     console.log('Faild Then');
   });
  };

  $scope.scrollTop = function() {//ng-click for back to top button
   $ionicScrollDelegate.scrollTop();
 };

});



app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.cordova && window.cordova.InAppBrowser) {
      window.open = window.cordova.InAppBrowser.open;
    }  

    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
