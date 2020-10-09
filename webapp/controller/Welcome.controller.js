sap.ui.define([
	"./BaseController"
], function(
	BaseController
) {
	"use strict";

	return BaseController.extend("SAPUI_Flights.controller.Welcome", {
		onInit: function() {
			this._oRouter = this.getRouter();
		}
	});
});