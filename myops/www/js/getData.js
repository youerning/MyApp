angular.module('myops.getData', [])
.factory("getData", function() {


    var factory = {};

    factory.get = function(url, params) {
        $http.get(url)
    };

    factory.post = function(url, data) {
        
    };

})