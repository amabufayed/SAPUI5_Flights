sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/m/MessagePopover",
	"sap/m/MessagePopoverItem",
	"sap/m/MessageBox"
], function(
	BaseController, JSONModel, formatter, MessagePopover, MessagePopoverItem, MessageBox
) {
	"use strict";
	return BaseController.extend("SAPUI_Flights.controller.BookingProcess", {
		formatter: formatter,

		onInit: function() {
			this._oRouter = this.getRouter();
			this._oRouter.getRoute("bookingProcess").attachPatternMatched(this._routePatternMatched, this);

			// https://sapyard.com/advance-sapui5-20-how-to-handling-input-validations-using-messagemanager-and-messagepopover/
			// create a message manager and register the message model
			this._oMessageManager = sap.ui.getCore().getMessageManager();
			this._oMessageManager.registerObject(this.getView(), true);
			this.setModel(this._oMessageManager.getMessageModel(), "message");
 
			this.oMessageTemplate = new MessagePopoverItem({
				type: "{message>type}",
				title: "{message>message}",
				subtitle: "{message>additionalText}",
				description: "{message>description}"
			});
 
			this.oMessagePopover = new MessagePopover({
				items: {
					path: "message>/",
					template: this.oMessageTemplate
				}
			});
			this.byId("showPopoverButton").addDependent(this.oMessagePopover);
		},
		/**
		 * Oppening booking wizzard, setting page layotu to one column and setting values to date selection.
		 * setting two odata models and timeout to two seconds because if timeout is not there wrong data will be filled to final model
		 * @param {} oEvent 
		 */
		_routePatternMatched: function (oEvent) {
			this._setLayout("One");
			this.connid = oEvent.getParameter("arguments").connid;
			this.getModel("bookingModel").setProperty("/connid", this.connid);
			this.oModel = this.getModel();

			this.getView().byId("dateOfBirth").setMinDate(new Date(1900, 0, 1))
			this.getView().byId("dateOfBirth").setMaxDate(new Date())
		
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

			this.getModel("userData").setProperty("/FlightData/connid", this.connid)
			
			setTimeout(() => { this.userModelDataFill() }, 2000);
		 },
		 /**
		  * Filling userData model with data taht will be needed for sending to the service
		  */
		 userModelDataFill: function() {
			var flightModel = this.getModel("flightInfo");
			this.getModel("userData").setProperty("/FlightData/Connid", this.conid);
			this.getModel("userData").setProperty("/FlightData/Price", flightModel.getProperty("/Price"));
			this.getModel("userData").setProperty("/FlightData/FlightDate", flightModel.getProperty("/Fldate"));
			this.getModel("userData").setProperty("/BillingData/Currency", flightModel.getProperty("/Currency"));
			this.getModel("userData").setProperty("/FlightData/Seatclass", this.getModel("bookingModel").getProperty("/bookingForSeatClass"));
		 },
		 /**
		  * If page is refreshed we and we dont have connid data need to set new payment method.
		  * 
		  */
		 setPaymentMethod: function () {
			var selectedPayment = this.getView().byId("paymentMethodSelection").getProperty("selectedKey");
			if(this.connid === undefined) {
				alert("Missing data. Please start again, returning to home page");
				this._oRouter.navTo("home");
			}
			else {
				this._oRouter.navTo(selectedPayment, {connid: this.connid});
			}
		},

		/**
		 * clearing main models and discarding wizzard progress
		 */
		clearModel: function() {
			var oDataModel = this.getModel("userData");
			var data = oDataModel.getData();
			data.FlightData =  {};
			data.BillingData = {};
			data.PassengerData = {};
			
			this.setModel(oDataModel, "userData");

			var oWizard = this.getView().byId("ShoppingCartWizard");
			this._navToWizardStep(this.byId("ContentsStep"));
			oWizard.discardProgress(oWizard.getSteps()[0]);
			this.getModel("paymentModel").setProperty("/validated", false);
			this.getModel("paymentModel").setProperty("/validatedPerson", false);
		},
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
		/**
		 * returning to home view and clearing models
		 */
		backToHomePage: function() {
			this._oRouter.navTo("home")
			this.clearModel();
		},

		checkCompleted:  function() {
			this.byId("wizardNavContainer").to(this.getView().byId("summaryPage"));
		},
		/**
		 * creating ticket number
		 * Parsing correct value of date of birth
		 * setting values to write object for sending to ODATA service
		 */
		confirmOrder: function () {

			var id = (new Date().getTime()).toString() + this.getModel("bookingModel").getProperty("/connid");
			var oReservation = this.getModel("userData");
			var date = Date.parse(oReservation.getProperty("/PassengerData/DateOfBirth"))

			var write = {};
			write.Ticketnumber = id.substr(id.length-10);
			write.Price = oReservation.getProperty("/FlightData/Price");
			write.Seatclass = oReservation.getProperty("/FlightData/Seatclass");
			write.FlightDate = oReservation.getProperty("/FlightData/FlightDate");
			write.Connid = this.connid;
			write.Paymentmethod = oReservation.getProperty("/BillingData/PaymentMethod");
			write.Ccholdername = oReservation.getProperty("/BillingData/CreditCardHolderName");
			write.Ccnumber = oReservation.getProperty("/BillingData/CreditCardNumber");
			write.Ccsecnumber = parseInt(oReservation.getProperty("/BillingData/CreditCardSecurityNumber"));
			write.Ccexdate = oReservation.getProperty("/BillingData/CreditCardExpirationDate");
			write.Currency = oReservation.getProperty("/BillingData/Currency");
			write.Passengername = oReservation.getProperty("/PassengerData/PassengerName");
			write.Passengersurname = oReservation.getProperty("/PassengerData/PassengerSurname");
			write.Passengerdob = "\/Date(" + date + ")\/";
			write.Documentnumber = oReservation.getProperty("/PassengerData/DocumentNumber");

			this.oModel.create('/ReservationsSet', write, null, function(){
				alert("Create successful");
			},function(){
				alert("Create failed");
			});

			this.backToHomePage();
		},
		/**
		 * validation for input boxes
		 */
		validateField: function() {
			this.oMessageTemplate = new MessagePopoverItem({
				type: "{message>type}",
				title: "{message>message}",
				subtitle: "{message>additionalText}",
				description: "{message>description}"
			});
 
			this.oMessagePopover = new MessagePopover({
				items: {
					path: "message>/",
					template: this.oMessageTemplate
				}
			});
			this.byId("showPopoverButton").addDependent(this.oMessagePopover);
		},
		/**
		 * Only validation on client side, does not involve a back-end server.
		 * @param {sap.ui.base.Event} oEvent Press event of the button to display the MessagePopover
		 */
		onShowMessagePopoverPress: function (oEvent) {
			this.oMessagePopover.openBy(oEvent.getSource());
		},
		/** 
		 * final check on data in credit card information wizard step
		 */
		saveData: function() {
			var creditCardHolderName = this.getView().byId("creditCardHolderName").getValue(),
				creditCardNumber = this.getView().byId("creditCardNumber").getValue(),
				creditCardSecurityNumber = this.getView().byId("creditCardSecurityNumber").getValue(),
				creditCardExpirationDate = this.getView().byId("creditCardExpirationDate").getValue();

			if (this.getModel("message").getProperty("/").length === 0 && creditCardHolderName.length != 0 && creditCardNumber.length != 0 
				&& creditCardSecurityNumber.length != 0 && creditCardExpirationDate.length != 0) {
				var paymentModel = this.getModel("userData");
				var validation = this.getModel("paymentModel")
				validation.setProperty("/validated", true)
				paymentModel.setProperty("/BillingData/PaymentMethod", "Creditcard")
				//this._oRouter.navTo("bookingProcess", {connid: this.connid})
			}
			else {
				MessageBox.alert("Not all fields are filled or are filled incorectly");
			}
		},
		/**
		 * final check on data in passenger wizard step
		 */
		savePassengerData: function() {
			var passengerName = this.getView().byId("passengerName").getValue(),
				passengerSurname = this.getView().byId("passengerSurname").getValue(),
				passengerDob = this.getView().byId("dateOfBirth").getValue(),
				passengerDocumentNumber = this.getView().byId("documentNumber").getValue();

				if (this.getModel("message").getProperty("/").length === 0 && passengerName.length != 0 && passengerSurname.length != 0 && passengerDob.length != 0 
					&& passengerDocumentNumber.length != 0) {
						this.getModel("paymentModel").setProperty("/validatedPerson", true);
				}
				else {
					MessageBox.alert("Not all fields are filled or are filled incorectly");
				}
		}
	});
});