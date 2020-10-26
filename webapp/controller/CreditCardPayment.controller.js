sap.ui.define([
	"./BaseController",
	"sap/m/MessagePopover",
	"sap/m/MessagePopoverItem",
], function(
	BaseController, MessagePopover, MessagePopoverItem
) {
	"use strict";

	return BaseController.extend("SAPUI_Flights.controller.CreditCardPayment", {
		onInit: function() {
			this._oRouter = this.getRouter();
            this._oRouter.getRoute("creditCard").attachPatternMatched(this._routePatternMatched, this);
		},
		_routePatternMatched: function (oEvent) {
			this.connid = oEvent.getParameter("arguments").connid;
			
			this._setLayout("Two");

			this.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");
		},
		saveData: function() {
			var paymentModel = this.getModel("userData");

			var validation = this.getModel("paymentModel")

			//::::::: TODO :::::.
			// if fileds validated write to model

			validation.setProperty("/validated", true)

			paymentModel.setProperty("/PaymentMethod", "Creditcard")
			
			this._oRouter.navTo("bookingProcess", {connid: this.connid})
		},
		validateField: function(oEvent) {
			var fieldID = (oEvent.getSource().sId).split('-')[2];

			var oInput = this.getView().byId(fieldID);
			var oBinding = oInput.getBinding("value")
			try {
				oBinding.getType().validateValue(oInput.getValue());
				oInput.setValueState("None");

			} catch {
				oInput.setValueState("Error");
				return true;
			}
		}
	});
});