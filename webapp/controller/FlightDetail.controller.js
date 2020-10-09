sap.ui.define([
	"./BaseController"
], function(
	BaseController
) {
	"use strict";

	return BaseController.extend("SAPUI_Flights.controller.FlightDetail", {
        onInit: function () {
            this._oRouter = this.getRouter();
			this._oRouter.getRoute("flightDetail").attachPatternMatched(this._routePatternMatched, this);
        },
        _routePatternMatched: function (oEvent) {
            this.connid = oEvent.getParameter("arguments").connid;
            this.getView().bindElement("/FlightAvaliabilitySet('" + this.connid + "')");
            console.log("flightDetail")
        }
	});
});