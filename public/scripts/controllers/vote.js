'use strict';

angular.module('moviedash.controllers')
    .controller('VoteController',
    ['$scope', 
    'voteService',
    '$http',
    '$rootScope',
    '$routeParams',
    '$location', 
        function (
            $scope, 
            voteService,
            $http,
            $rootScope,
            $routeParams, 
            $location) {   

           $scope.getOMDBinfo = function(){         
                 angular.forEach($scope.movies, function(m){
                if ($scope.voteMessage.movieid == m.movieid)                    
                   $http.get("http://www.omdbapi.com/?t=" + m.title)
                        .then(function(response){                                 
                                $scope.details = response.data
                                console.log(response.data) });
                            })
                }

            $scope.pagename = function() { return $location.path(); };           

            $scope.formatLabel = function($model) {

            var inputLabel = '';
            angular.forEach($scope.movies, function(m){
                if ($model == m.movieid)                    
                    inputLabel = m.title
                })


            return inputLabel
            
              } 


             // console.log($scope.movies[1].title)

            $http.get('movies.json')
               .then(function(res){
                  $scope.movies = res.data;                                
                });

            $scope.result = [];

            $scope.sendVote = function () {
                if ($scope.voteMessage) {

                    var message = {
                        movieid: $scope.voteMessage.movieid,
                        rating: $scope.voteMessage.rating
                    };

                    voteService.emit('message', message);
                    $scope.voteMessage = '';
                }
            };

            voteService.on('message', function (message) {
                                
                //$scope.messages.push(message);
            if ($scope.result.length == 9) $scope.result = [];
                $http.get("http://www.omdbapi.com/?t=" + message.title)
                        .then(function(response){   
                        if(response.data.Response=="True")                              
                                $scope.result.push(response.data)
                                 //console.log(response.data) 
                            });
                            })
            

        }]);