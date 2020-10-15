sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter"
], function(
	BaseController, JSONModel, formatter
) {
	"use strict";

	return BaseController.extend("SAPUI_Flights.controller.BookingProcess", {
		formatter: formatter,

		onInit: function() {
			this._oRouter = this.getRouter();
            this._oRouter.getRoute("bookingProcess").attachPatternMatched(this._routePatternMatched, this);
		},
		_routePatternMatched: function (oEvent) {
			this._setLayout("One");

			this.connid = oEvent.getParameter("arguments").connid;

			this.oModel = this.getModel();

			console.log(this.connid)

			this.oModel.read("/FlightAvaliabilitySet('" + this.connid + "')", {
				success: function (oRetrievedResult) {
					var model = new JSONModel(oRetrievedResult);
					this.getView().setModel(model, "flightInfo");
				}.bind(this)
			});

			//get data for selected SPFLI table
            this.oModel.read("/FlightsSet('" + this.connid + "')", {
				success: function (oRetrievedResult) {
					var model = new JSONModel(oRetrievedResult);
					this.getView().setModel(model, "flights");
				}.bind(this)
            });
		 },
		 setPaymentMethod: function (oEvent) {
			var selectedPayment = this.getView().byId("paymentMethodSelection").getProperty("selectedKey");
			console.log(selectedPayment)

			if(this.connid === undefined)
				alert("Missing data. Please start again")
			else {
				this._oRouter.navTo(selectedPayment, {connid: this.connid});
			}
			
		},
	});
});