sap.ui.define([
	"sap/ui/base/ManagedObject"
], function(
	ManagedObject
) {
	"use strict";

        var formatter = {
            seatsAvaliable: function(sValue) {
                console.log(typeof(sValue))
                if(sValue < 300)
                    return "Success";
                else
                    return "Error";
            }
        }
});