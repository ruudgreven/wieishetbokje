'use strict';

/**
 * @ngdoc function
 * @name wihbApp.controller:KiesBokjeCtrl
 * @description
 */
angular.module('wihbApp')
    .controller('HeaderCtrl', function ($scope, $location, BokService) {
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };


        $scope.setCurrentGroup = function(name) {
            BokService.setCurrentGroup(name);
        };

        $scope.getCurrentGroupName = function() {
            return BokService.getCurrentGroupName();
        };

        $scope.getGroupNames = function() {
            return BokService.getGroupNames();
        };
    });