'use strict';

/**
 * @ngdoc overview
 * @name arcsplannerApp
 * @description
 * # arcsplanner
 *
 * Main module of the application.
 */
angular.module('wihbApp', ['ngRoute', 'ngAnimate', 'LocalStorageModule'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/kiesbokje.html',
                controller: 'KiesbokjeCtrl'
            })
            .when('/bokjesbeheer', {
                templateUrl: 'views/bokjesbeheer.html',
                controller: 'BokjesbeheerCtrl'
            })
            .when('/over', {
                templateUrl: 'views/about.html',
                controller: 'KiesbokjeCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .constant('config', {
        bokcolors: ['#F44336', '#9C27B0', '#3F51B5', '#2196F3', '#009688', '#4CAF50', '#CDDC39', '#FFEB3B', '#FF9800', '#795548', '#607D8B'],
        bokimages: ['bokjes/bokje1.png', 'bokjes/bokje2.png', 'bokjes/bokje3.png', 'bokjes/bokje4.png', 'bokjes/bokje5.png', 'bokjes/schaap1.png', 'bokjes/schaap2.png', 'bokjes/schaap3.png', 'bokjes/schaap4.png', 'bokjes/koe1.png', 'bokjes/koe2.png', 'bokjes/koe3.png', 'bokjes/koe4.png']
    })
    .config(function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('wihb');
    });