// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('myops', ['ionic',"chart.js"]);
var esUrl = "http://192.168.31.154/es";
var zabUrl = "http://192.168.31.154/zab";
var serLis = [
  {
    url: esUrl,
    name:"Elasticsearch",
    params: {api:"_cat/health"},
    status: "pending",
    alias:"es"
  },
  {
    url:zabUrl,
    name: "Zabbix",
    params: {},
    status: "pending",
    alias:"zab"
  }
];

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
  $stateProvider
  .state("home", {
    url:"/home",
    views:{
      "tab-home":{
        controller:"homeCtrl",
        templateUrl: "tpls/home.html"
      }
    }
  });

  $stateProvider
  .state("detail", {
    url:"/detail/:name",
    views:{
      "tab-es":{
        controller:"detailCtrl",
        templateUrl: "tpls/detail.html"
      }
    }
  });

  $stateProvider
  .state("perf", {
    url:"/perf/:name",
    views:{
      "tab-home":{
        controller:"perfCtrl",
        templateUrl: "tpls/perf.html"
      }
    }
  });

  $stateProvider
  .state("es", {
    url:"/es",
    views:{
      "tab-es":{
        controller:"esCtrl",
        templateUrl: "tpls/es.html"
      }
    }
  });

  $stateProvider
  .state("zabbix", {
    url:"/zabbix",
    views:{
      "tab-zabbix":{
        controller:"zabbixCtrl",
        templateUrl: "tpls/zabbix.html"
      }
    }
  });

  $urlRouterProvider.otherwise("/home");

})

app.controller("homeCtrl", function($scope, $http) {
  $scope.serLis = serLis;
  for (var i=0;i<serLis.length;i++){
    $http.get(serLis[i].url, {params: serLis[i].params, index:i}).then(function(resp) {
      index = resp.config.index;
      $scope.serLis[index].status = resp.data.data[0].status;
    },function(resp) {
      $scope.serLis[i].status = "connect fails";
    })
  }

});



app.controller("detailCtrl", function($scope, $http, $state) {
  $scope.name = $state.params.name;
  var data = {
    "aggs": {
        "top_tags": {
            "terms": {
                "field": "response",
                "size": 10
            }
        }
    }
  };

  function setData(field) {
    var postdata = angular.copy(data);
    postdata.aggs.top_tags.terms.field = field;
    return postdata
  }


  $http.post(esUrl, setData($scope.name), {params:{api:"_search"}}).then(function(resp) {
    var ret = resp.data.data.aggregations.top_tags.buckets;
    console.log(ret);

    $scope.labels = [];
    $scope.series = [$scope.name];
    $scope.data = [];

    for (var i=0;i<ret.length;i++){
      $scope.labels.push(ret[i]["key"]);
      $scope.data.push(ret[i]["doc_count"]);
    }

    // console.log($scope.labels);
    // console.log($scope.data);

  },function(resp) {
    // console.log(resp.config);
  })



});


app.controller("perfCtrl", function($scope, $http, $state) {
  $scope.name = $state.params.name;
  var data = {};
  data.nodes = "pending";
  data.shards = "pending";
  data.status = "pending";
  data.indices = "pending";
  data.counts = "pending";

  $scope.data = data;
  $http.get(esUrl, {params:{api: "_cat/nodes"}}).then(function(resp){
    $scope.data.nodes = resp.data.data.length;
  }, function(resp) {
    $scope.data.nodes = "something wrong";
  });

  $http.get(esUrl, {params:{api: "_cat/shards"}}).then(function(resp){
    $scope.data.shards = resp.data.data.length;
  }, function(resp) {
    $scope.data.shards = "something wrong";
  });

  $http.get(esUrl, {params:{api: "_cat/health"}}).then(function(resp){
    $scope.data.status = resp.data.data[0].status;
  }, function(resp) {
    $scope.data.status = "something wrong";
  });

  $http.get(esUrl, {params:{api: "_cat/indices"}}).then(function(resp){
    $scope.data.indices = resp.data.data.length;
  }, function(resp) {
    $scope.data.indices = "something wrong";
  });

  $http.get(esUrl, {params:{api: "_cat/count"}}).then(function(resp){
    $scope.data.counts = resp.data.data[0].count;
  }, function(resp) {
    $scope.data.counts = "something wrong";
  });

});


app.controller("esCtrl", function($http) {
  
});

app.controller("zabbixCtrl", function($http) {
  
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
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
