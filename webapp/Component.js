sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"SAPUI_Flights/model/models",
	"sap/ui/model/json/JSONModel"
], function(UIComponent, Device, models, JSONModel) {
	"use strict";

	return UIComponent.extend("SAPUI_Flights.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			var freeSeatsModel = new JSONModel({
                "econSeatsFree": 0,
                "businessSeatsFree": 0,
                "firstSeeatsFree": 0
            });

			this.setModel(freeSeatsModel, "freeSeatsModel");

			var bookingModel = new JSONModel({
				"bookingForSeatClass" : "",
				"connid": ""
            });

			this.setModel(bookingModel, "bookingModel");
			
			var validation = new JSONModel({
				"validated": false,
				"billing" : "",
				"currency": ""
			})
			this.setModel(validation, "paymentModel")

			var oData = new JSONModel({
				"Ticketnumber" : "",
				"Price" : "",
				"Seatclass" : "",
				"FlightDate" : "",
				"Connid" : "",
				"PaymentMethod" : "",
				"CreditCardHolderName" : "",
				"CreditCardNumber" : "",
				"CreditCardSecurityNumber" : "",
				"CreditCardExpirationDate" : "",
				"Currency" : "",
				"PassengerName" :"",
				"PassengerSurname" : "",
				"DateOfBirth" : "",
				"DocumentNumber" : "",
			});
			this.setModel(oData, "userData")

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// initialize the router
			this.getRouter().initialize();

			
		}
	});
});