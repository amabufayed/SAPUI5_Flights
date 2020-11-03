sap.ui.define([
	"./BaseController"
], function(
	BaseController
) {
	"use strict";

	return BaseController.extend("SAPUI_Flights.controller.BankTransfer", {
		onInit: function() {
			this._oRouter = this.getRouter();
            this._oRouter.getRoute("bankTransfer").attachPatternMatched(this._routePatternMatched, this);
		},
		_routePatternMatched: function (oEvent) {
			this._setLayout("Two");
		},
		bankTransfer: function() {
			this.getModel("paymentModel").setProperty("/validated", true);
			this._oRouter.navTo("bookinProcess");
			this.getModel("userData").setProperty("/BillingData/PaymentMethod", "BankTransfer")
			this._setLayout("One");
		}
	});
});