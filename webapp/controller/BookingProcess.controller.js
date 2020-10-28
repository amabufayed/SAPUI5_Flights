sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/m/MessagePopover",
	"sap/m/MessagePopoverItem"
], function(
	BaseController, JSONModel, formatter, MessagePopover, MessagePopoverItem
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
			this.getModel("bookingModel").setProperty("/connid", this.connid);
			this.oModel = this.getModel();
			
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

			this.getModel("userData").setProperty("/connid", this.connid)

			setTimeout(() => { this.userModelDataFill() }, 2000);
		 },

		 userModelDataFill: function() {
			var flightModel = this.getModel("flightInfo");
			this.getModel("userData").setProperty("/Connid", this.conid);
			this.getModel("userData").setProperty("/Price", flightModel.getProperty("/Price"));
			this.getModel("userData").setProperty("/FlightDate", flightModel.getProperty("/Fldate"));
			this.getModel("userData").setProperty("/Currency", flightModel.getProperty("/Currency"));
			this.getModel("userData").setProperty("/Seatclass", this.getModel("bookingModel").getProperty("/bookingForSeatClass"));
		 },
		 setPaymentMethod: function (oEvent) {
			var selectedPayment = this.getView().byId("paymentMethodSelection").getProperty("selectedKey");
			if(this.connid === undefined) {
				alert("Missing data. Please start again, returning to home page");
				this._oRouter.navTo("home");
			}
			else {
				this._oRouter.navTo(selectedPayment, {connid: this.connid});
			}
		},

		/*

				::::::::::: TO DO ::::::::::::
				Implement data deletion when payment changes

		*/
		deletePaymentModel: function() {

		},

		/*

				:::::::::::::: TO DO :::::::::::::
				Implement wizzard step resseting when you move back.

		*/
		/**
		 * navigates to WizardStep
		 * @private
		 * @param {Object} oStep WizardStep DOM element
		 */
		_navToWizardStep: function (oStep) {
			var oNavContainer = this.byId("wizardNavContainer");
			var _fnAfterNavigate = function () {
				this.byId("ShoppingCartWizard").goToStep(oStep);
				// detaches itself after navigaton
				oNavContainer.detachAfterNavigate(_fnAfterNavigate);
			}.bind(this);

			oNavContainer.attachAfterNavigate(_fnAfterNavigate);
			oNavContainer.to(this.byId("wizardContentPage"));
		},

		backToHomePage: function() {
			this._oRouter.navTo("home")
			var oWizard = this.getView().byId("ShoppingCartWizard");
			this._navToWizardStep(this.byId("paymentSelectionStep"));
			oWizard.discardProgress(oWizard.getSteps()[0]);
			this.getModel("paymentModel").setProperty("/validated", true);
		},

		checkCompleted:  function() {
				this.byId("wizardNavContainer").to(this.getView().byId("summaryPage"));
		},

		confirmOrder: function () {

			var id = (new Date().getTime()).toString() + this.getModel("bookingModel").getProperty("/connid");
			

			var oReservation = this.getModel("userData");

			var date = Date.parse(oReservation.getProperty("/DateOfBirth"))


			var write = {};
			write.Ticketnumber = id.substr(id.length-10);
			write.Price = oReservation.getProperty("/Price");
			write.Seatclass = oReservation.getProperty("/Seatclass");
			write.FlightDate = oReservation.getProperty("/FlightDate");
			write.Connid = this.connid;
			write.Paymentmethod = oReservation.getProperty("/PaymentMethod");
			write.Ccholdername = oReservation.getProperty("/CreditCardHolderName");
			write.Ccnumber = oReservation.getProperty("/CreditCardNumber");
			write.Ccsecnumber = parseInt(oReservation.getProperty("/CreditCardSecurityNumber"));
			write.Ccexdate = oReservation.getProperty("/CreditCardExpirationDate");
			write.Currency = oReservation.getProperty("/Currency");
			write.Passengername = oReservation.getProperty("/PassengerName");
			write.Passengersurname = oReservation.getProperty("/PassengerSurname");
			write.Passengerdob = "\/Date(" + date + ")\/";
			write.Documentnumber = oReservation.getProperty("/DocumentNumber");

	
			this.oModel.create('/ReservationsSet', write, null, function(){
				alert("Create successful");
			},function(){
				alert("Create failed");
			});
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