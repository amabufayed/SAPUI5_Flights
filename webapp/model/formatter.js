sap.ui.define([
	"sap/ui/base/ManagedObject"
], function(
	ManagedObject
) {
	"use strict";

        var formatter = {
            formatTime: function(sValue) {
                var date = new Date(sValue)
                var minutes = "0" + date.getMinutes();
                return date.getHours() + ":" + minutes.slice(-2);
            }
        };
        return formatter;
});