// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('myNotes', ['ionic', 'myNotes.noteStore'])

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state("list", {
    url: "/list",
    templateUrl: "tpls/list.html",
    controller: "listCtrl"
  });

  $stateProvider.state("edit", {
    url: "/edit/:noteId",
    templateUrl: "tpls/edit.html",
    controller: "editCtrl"
  });

    $stateProvider.state("add", {
    url: "/add",
    templateUrl: "tpls/add.html",
    controller: "addCtrl"
  });

  $urlRouterProvider.otherwise("/list");

});

app.controller("listCtrl", function($scope, noteStore) {
  $scope.reodering = false;
  $scope.notes = noteStore.list;
  $scope.remove = noteStore.remove;
  $scope.move = noteStore.move;

  $scope.toggleRestore = function() {
    $scope.reodering = !$scope.reodering;
  };

});

app.controller("editCtrl", function($scope, $state, noteStore) {
  $scope.note = angular.copy(noteStore.getNote($state.params.noteId));

  $scope.save = function() {
    noteStore.updateNote($scope.note);
    $state.go("list");
  };


});

app.controller("addCtrl", function($scope, $state, noteStore) {
  $scope.note = {
    id: new Date().getTime().toString(),
    title: "",
    desc: ""
  };

  $scope.save = function() {
    noteStore.createNote($scope.note);
    $state.go("list");
  }

})


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
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
