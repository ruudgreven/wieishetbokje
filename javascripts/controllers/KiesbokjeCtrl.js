'use strict';

/**
 * @ngdoc function
 * @name wihbApp.controller:KiesBokjeCtrl
 * @description
 */
angular.module('wihbApp')
    .controller('KiesbokjeCtrl', function ($scope, $interval, BokService) {
        $scope.bokSwitcher1 = BokService.getRandomBokje();
        $scope.bokSwitcher2 = BokService.getRandomBokje();
        $scope.chosenBokje = undefined;
        $scope.animation = false;
        $scope.whichBokje = 1;

        $scope.animationcount = 0;
        $scope.animationdots = "";

        $scope.getNumberOfBokjes = function() {
            return BokService.getNumberOfBokjes();
        };

        $scope.chooseBokje = function() {
            $scope.chosenBokje = undefined;
            $scope.animation = true;

            var animationplayer = $interval(function() {
                $scope.animationcount++;
                $scope.animationdots = $scope.animationdots + ".";
                console.log($scope.animationcount);
                if ($scope.animationcount%2 == 0) {
                    $scope.whichbokje = 2;
                    $scope.bokSwitcher1 = BokService.getRandomBokje();
                } else {
                    $scope.whichbokje = 1;
                    $scope.bokSwitcher2 = BokService.getRandomBokje();
                }
                if ($scope.animationcount >= 10) {
                    $scope.animationcount = 0;
                    $scope.animationdots = "";
                    $scope.animation = false;
                    $interval.cancel(animationplayer);
                    animationplayer = undefined;
                    $scope.chosenBokje = BokService.chooseBokje();
                }
            }, 100);


        };
    });