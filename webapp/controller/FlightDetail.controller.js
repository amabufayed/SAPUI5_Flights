sap.ui.define([
    "./BaseController",
    "../model/formatter"
], function(
	BaseController, formatter
) {
	"use strict";

	return BaseController.extend("SAPUI_Flights.controller.FlightDetail", {
        formatter: formatter,

        onInit: function () {
            this._oRouter = this.getRouter();
			this._oRouter.getRoute("flightDetail").attachPatternMatched(this._routePatternMatched, this);
        },
        //get connid from url
        _routePatternMatched: function (oEvent) {
            this.connid = oEvent.getParameter("arguments").connid;
            this.getView().bindElement("/FlightAvaliabilitySet('" + this.connid + "')");
            console.log("flightDetail")
        }
	});
});