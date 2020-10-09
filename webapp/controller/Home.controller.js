sap.ui.define([
	"./BaseController"
], function(
	BaseController
) {
	"use strict";

	return BaseController.extend("SAPUI_Flights.controller.Home", {
		onInit: function() {
			this._oRouter = this.getRouter();
			this._oRouter.getRoute("home").attachPatternMatched(this._routePatternMatched, this);
			
		},
		_routePatternMatched: function (oEvent) {
			this._setLayout("Two");
		},
		onListItemPress: function(oEvent) {
			var connid = oEvent.getSource().getBindingContext().getProperty("Connid");
			this.getRouter().navTo("flightDetail", {connid: connid})
		}
	});
});