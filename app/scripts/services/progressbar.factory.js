'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.progressBarFactory
 * @description
 * # progressBarFactory
 * Factory in the send2CardApp.
 */
angular.module('send2CardApp')
    .factory('progressBarFactory', function () {
        // Service logic
        // ...

        var progressBarData = {};
        progressBarData.display = false;
        progressBarData.unactionedLength = 0;
        progressBarData.actionedLength = 0;
        progressBarData.progressBarValue = 0;

        // Public API here
        return {
            getServiceData: getServiceData,
            toggleProgressBarDisplay: toggleProgressBarDisplay,
            setUnactionedLength: setUnactionedLength,
            getUnactionedLength: getUnactionedLength,
            setActionedLength: setActionedLength,
            getActionedLength: getActionedLength,
            setProgressBarValue: setProgressBarValue,
            setActionedSavings: setActionedSavings,
            setUnactionedSavings: setUnactionedSavings
        };

        function getServiceData() {
            return progressBarData;
        }

        function toggleProgressBarDisplay(show) {
            progressBarData.display = show;
        }

        function setUnactionedLength(unactionedLength) {
            console.log("setUnactionedLength: " + progressBarData.actionedLength);            
            progressBarData.unactionedLength = unactionedLength;
        }

        function getUnactionedLength() {
            console.log("getUnactionedLength: " + progressBarData.unactionedLength);            
            return progressBarData.unactionedLength;
        }

        function setActionedLength(actionedLength) {
            console.log("setActionedLength: " + progressBarData.actionedLength);
            progressBarData.actionedLength = actionedLength;
        }

        function getActionedLength() {
            console.log("getActionedLength: " + progressBarData.actionedLength);
            return progressBarData.actionedLength;
        }

        function setProgressBarValue(progressBarValue) {
            progressBarData.progressBarValue = progressBarValue;
            console.log("setProgressBarValue: " + progressBarData.progressBarValue);
        }

        function setActionedSavings(actionedSavings) {
            progressBarData.actionedSavings = actionedSavings;
        }

        function setUnactionedSavings(unactionedSavings) {
            progressBarData.unactionedSavings = unactionedSavings;
        }

    });
