'use strict';

/**
 * @ngdoc function
 * @name wihbApp.controller:BoklogCtrl
 * @description
 */
angular.module('wihbApp')
    .controller('BoklogCtrl', function ($scope, BokService) {
        $scope.getBoklog = function() {
            var orgboklog = BokService.getBoklog();
            var boklog = [];
            var counter = 0;

            for (var i = orgboklog.length - 1; i >= 0 && counter<10; i--) {
                boklog.push(orgboklog[i]);
                counter++;
            }

            return boklog;
        }
    });