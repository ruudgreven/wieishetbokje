'use strict';

/**
 * @ngdoc function
 * @name wihbApp.service:BokService
 * @description
 */
angular.module('wihbApp')
    .service('BokService', function($rootScope, $log, localStorageService) {
        if (localStorageService.get('groups') == undefined) {
            this.groups = [{
                name: 'Standaard groep',
                bokjes: [],
                boklog: []
            }];
        } else {
            this.groups = localStorageService.get('groups');
        }

        this.currentGroup = this.groups[0];     //The data block for the currentgroup

        /**
         *
         * @param nwName The name of the new group
         * @returns {boolean} true when ok, false when the group already exists
         */
        this.addGroup = function(nwName) {
            //Check if the group already exists
            if (this.getGroupNames().indexOf(nwName) != -1) {
                $log.error('The groupname ' + nwName + ' already exists');
                return false;
            }

            this.groups.push({
                name: nwName,
                bokjes: [],
                bokjesToGo: [],
                boklog: []
            });

            this.currentGroup = this.groups[this.groups.length - 1];
            $log.info('The group with name ' + nwName+ ' was added');
            $rootScope.$broadcast('group.updatelist');

            localStorageService.set('groups', this.groups);
            return true;
        };

        /**
         *
         * @returns {boolean} true when ok, false when the group already exists
         */
        this.removeCurrentGroup = function() {
            if (this.getGroupNames().indexOf(this.currentGroup.name) == -1 || this.getGroupNames().indexOf(this.currentGroup.name) == 0) {
                return false;
            } else {
                this.groups.splice(this.getGroupNames().indexOf(this.currentGroup.name), 1);
                $log.error('The group has been removed');

                this.currentGroup = this.groups[0];
                $rootScope.$broadcast('group.updatelist');

                localStorageService.set('groups', this.groups);
                return true;
            }
        };

        /**
         * Set the current group
         * @param name The name of the group
         * @returns {boolean} If everything is ok, false if not
         */
        this.setCurrentGroup = function(name) {
            for (var i = 0; i < this.groups.length; i++) {
                var group = this.groups[i];
                if (group.name == name) {
                    this.currentGroup = group;
                    $rootScope.$broadcast('group.change');
                    $log.info('Group changed to ' + name);
                    return true;
                }
            }

            $log.error('Group name not found: ' + name);
            return false;
        };

        /**
         * Return the name of the current group
         * @returns {string} The name of the current group, undefined if there is no current group
         */
        this.getCurrentGroupName = function() {
            if (this.currentGroup == undefined) {
                return undefined;
            }
            return this.currentGroup.name;
        };

        /**
         * Returns an array of all groupnames
         * @returns {Array}
         */
        this.getGroupNames = function() {
            var names = [];
            for (var i = 0; i < this.groups.length; i++) {
                names.push(this.groups[i].name);
            }
            return names;
        };


        /**
         * Adds a bokje to the current group
         * @param nwName The name for the bokje
         * @param nwColor The color of the bokje
         * @param nwImage The image for the bokje
         */
        this.addBokje = function(nwName, nwColor, nwImage) {
            if (this.currentGroup == undefined) {
                $log.error('There is no current group. Could not add bokje');
                return false;
            }
            for (var i = 0; i < this.currentGroup.bokjes.length; i++) {
                var bokje = this.currentGroup.bokjes[i];
                if (bokje.name == nwName) {
                    $log.error('There is already a bokje with this name');
                    return false;
                }
            }
            this.currentGroup.bokjes.unshift({
                name: nwName,
                color: nwColor,
                image: nwImage,
                chooseCount: 0
            });

            $rootScope.$broadcast('bokje.add');

            this.addItemToBoklog(nwColor, nwImage, 'add', 'Bokje toegevoegd', nwName + ' is nu ook toegevoegd aan de bokkeschuur.');
            $log.info('Bokje with name ' + nwName + ' was added');

            localStorageService.set('groups', this.groups);
            return true;
        };

        this.removeBokje = function(nwName) {
            if (this.currentGroup == undefined) {
                $log.error('There is no current group. Could not add bokje');
                return false;
            }
            for (var i = 0; i < this.currentGroup.bokjes.length; i++) {
                var bokje = this.currentGroup.bokjes[i];
                if (bokje.name == nwName) {
                    this.currentGroup.bokjes.splice(i, 1);

                    $rootScope.$broadcast('bokje.remove');

                    this.addItemToBoklog(bokje.color, bokje.image, 'remove', 'Bokje verwijderd', bokje.name + ' is uit de bokkeschuur verwijderd.');
                    $log.info('Bokje with name ' + bokje.name + ' was removed');

                    localStorageService.set('groups', this.groups);

                    break;
                }
            }
        };

        /**
         * Returns a list of bokjes, or an empty list of there is no current group
         */
        this.getBokjes = function() {
            if (this.currentGroup == undefined) {
                $log.error('There is no current group. Could not return bokjes');
                return [];
            }
            return this.currentGroup.bokjes;
        }

        /**
         * Returns the number of bokjess to choose from
         * @returns The number of bokjes to choose from, -1 if there is no currengroup
         */
        this.getNumberOfBokjes = function() {
            if (this.currentGroup != undefined) {
                return this.currentGroup.bokjes.length;
            }
            return -1;
        };


        /**
         * Just gets a random bokje. Primarely used for the animation. Not for the definitve choice of a bokje!
         * @returns {*}
         */
        this.getRandomBokje = function() {
            if (this.currentGroup == undefined) {
                $log.error('There is no current group. Could not return bokjes');
                return false;
            }
            //Choose a bokje
            var chosenbokjeIndex = Math.floor(Math.random() * this.currentGroup.bokjes.length);
            var chosenbokje = this.currentGroup.bokjes[chosenbokjeIndex];
            return chosenbokje;
        };

        /**
         * Choose a bokje.
         * @param The bokje
         */
        this.chooseBokje = function() {
            if (this.currentGroup == undefined) {
                $log.error('There is no current group. Could not return bokjes');
                return false;
            }

            //Determine the lowest choicecount
            var lowestChooseCount = -1;
            var lastChooseCount = -1;
            var allTheSameChooseCount = true;
            for (var i = 0; i < this.currentGroup.bokjes.length; i++) {
                var bokje = this.currentGroup.bokjes[i];
                if (lastChooseCount == -1) {
                    lowestChooseCount = bokje.chooseCount;
                    lastChooseCount = bokje.chooseCount;
                }
                if (bokje.chooseCount < lowestChooseCount) {
                    lowestChooseCount = bokje.chooseCount;
                }
                if (bokje.chooseCount != lastChooseCount) {
                    allTheSameChooseCount = false;
                }
                lastChooseCount = bokje.chooseCount;
            };

            //Choose a bokje
            var chosenbokjeIndex = Math.floor(Math.random() * this.currentGroup.bokjes.length);
            var chosenbokje = this.currentGroup.bokjes[chosenbokjeIndex];

/**
            if (!allTheSameChooseCount) {
                console.log('not all the same count, lowest ' + lowestChooseCount + 'current: ' + chosenbokje.chooseCount);
                while (chosenbokje.chooseCount <= lowestChooseCount) {     //When it has a higher or equal choosecount than the lowest choose a new one
                    chosenbokjeIndex = Math.floor(Math.random() * this.currentGroup.bokjes.length);
                    chosenbokje = this.currentGroup.bokjes[chosenbokjeIndex];

                }
            };
 **/

            chosenbokje.chooseCount++;

            //Add an entry to the boklog
            this.addItemToBoklog(chosenbokje.color, chosenbokje.image, 'chosen', 'Bokje gekozen', chosenbokje.name + ' is voor de ' + chosenbokje.chooseCount + 'e keer het bokje.');

            return chosenbokje;
        };

        /**
         * Returns the current boklog
         * @returns An array with boklog items (icon, title, text)
         */
        this.getBoklog = function() {
            if (this.currentGroup == undefined) {
                $log.error('There is no current group. Could not add entry to boklog');
                return false;
            }
            return this.currentGroup.boklog;
        };

        /**
         * Add an item to the boklog
         * @param nwColor The color for the icon in the boklogitem
         * @param nwIcon The icon for the boklogitem
         * @param nwTitle The title for the boklogitem
         * @param nwText The text for the boklogitem
         * @returns {boolean} true when ok, else false
         */
        this.addItemToBoklog = function(nwColor, nwIcon, nwType, nwTitle, nwText) {
            if (this.currentGroup == undefined) {
                $log.error('There is no current group. Could not add entry to boklog');
                return false;
            }
            this.currentGroup.boklog.push({
                color: nwColor,
                icon: nwIcon,
                type: nwType,
                title: nwTitle,
                text: nwText
            });
            $rootScope.$broadcast('boklog.update');

            localStorageService.set('groups', this.groups);
            return true;
        };
    });