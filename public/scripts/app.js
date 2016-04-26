'use strict';

angular.module('moviedash', [
    'moviedash.controllers',
    'moviedash.services',
    'ngRoute',
    'ui.bootstrap',
    'ngAnimate'
])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html'
            })
            .when('/results', {
                templateUrl: 'views/results.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

angular.module('moviedash.controllers', []);
angular.module('moviedash.services', [])
    .value('version', '0.0.1');
