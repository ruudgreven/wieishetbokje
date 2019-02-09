'use strict';

/**
 * @ngdoc function
 * @name wihbApp.controller:BokjesbeheerCtrl
 * @description
 */
angular.module('wihbApp')
    .controller('BokjesbeheerCtrl', function ($scope, $timeout, BokService, config) {
        $scope.newgroupname = '';
        $scope.newgroupnamealert = false;
        $scope.newbokjename = '';

        $scope.bokjeidselectedforremoval = -1;
        $scope.showdoublewarning = false;

        this.lastColorIndex = -1;
        this.lastImageIndex = -1;

        $scope.getCurrentGroupName = function() {
            return BokService.getCurrentGroupName();
        };

        $scope.getGroupNames = function() {
            var groupnames = BokService.getGroupNames();
            return groupnames;
        };

        $scope.addNewGroup = function() {
            if ($scope.newgroupname != '') {
                if (BokService.addGroup($scope.newgroupname)) {
                    $('#newGroupModal').modal('hide');
                    $scope.newgroupname = '';
                } else {
                    $scope.newgroupnamealert = true;
                }
            }
        };

        $scope.removeCurrentGroup = function() {
            BokService.removeCurrentGroup();
            $('#removeGroupModal').modal('hide');
        };

        $scope.addNewBokje = function() {
            $scope.showdoublewarning = false;
            if ($scope.newbokjename == '') {
                return;
            }
            //Choose a random color
            var bokcolorIndex = this.lastColorIndex;
            while (bokcolorIndex == this.lastColorIndex) {
                bokcolorIndex = Math.floor((Math.random() * config.bokcolors.length));
            }

            //Choose a random image
            var bokimageIndex = this.lastImageIndex;
            while (bokimageIndex == this.lastImageIndex) {
                bokimageIndex = Math.floor((Math.random() * config.bokimages.length));
            }

            //Adding bokje
            if (BokService.addBokje($scope.newbokjename, config.bokcolors[bokcolorIndex], config.bokimages[bokimageIndex])) {
                this.lastColorIndex = bokcolorIndex;
                this.lastImageIndex = bokimageIndex;
                $scope.newbokjename = '';
                return true;
            } else {
                $scope.showdoublewarning = true;
                return false;
            }
        };

        /**
         * Remove the given bokje. The first time when called the bokje will be selected for removed
         * @param i
         * @param bokje
         */
        $scope.removeBokje = function(i, bokje) {
            if ($scope.bokjeidselectedforremoval != i) {
                $scope.bokjeidselectedforremoval = i;
                $timeout(function() {
                    $scope.bokjeidselectedforremoval = -1;
                }, 2000);
            } else {
                $scope.bokjeidselectedforremoval = -1;
                BokService.removeBokje(bokje.name);
            }
        };

        $scope.getBokjes = function() {
            return BokService.getBokjes();
        }

        $scope.removeDoubleWarning = function() {
            $scope.showdoublewarning = false;
        }
    });