sap.ui.define([
    "./BaseController",
    "../model/formatter",
    "sap/ui/model/json/JSONModel"
], function(
	BaseController, formatter, JSONModel
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
            this._setLayout("Two");

            //get data for selected SFLIGHTS table
            this.connid = oEvent.getParameter("arguments").connid;
            //this.getView().bindElement("/FlightAvaliabilitySet('" + this.connid + "')");

            this.oModel = this.getModel();

            this.oModel.read("/FlightAvaliabilitySet('" + this.connid + "')", {
				success: function (oRetrievedResult) {
					var model = new JSONModel(oRetrievedResult);
					this.getView().setModel(model, "flightInfo");
				}.bind(this)
            })

            //get data for selected SPFLI table
            this.oModel.read("/FlightsSet('" + this.connid + "')", {
				success: function (oRetrievedResult) {
					var model = new JSONModel(oRetrievedResult);
					this.getView().setModel(model, "flights");
				}.bind(this)
            });

            setTimeout(() => {  this.getSeatsSpots(); }, 500);
        },

        //runs after .5 second timeout so models are refreshed
        getSeatsSpots: function() {
            var freeSeatsModel = this.getModel("freeSeatsModel");
            var oDataModel = this.getModel("flightInfo");

            freeSeatsModel.setProperty("/econSeatsFree", (oDataModel.getProperty("/Seatsmax") - oDataModel.getProperty("/Seatsocc")))
            freeSeatsModel.setProperty("/businessSeatsFree", (oDataModel.getProperty("/SeatsmaxB") - oDataModel.getProperty("/SeatsoccB")))
            freeSeatsModel.setProperty("/firstSeeatsFree", (oDataModel.getProperty("/SeatsmaxF") - oDataModel.getProperty("/SeatsoccF")))

            if(freeSeatsModel.getProperty("/econSeatsFree") == 0)
                this.getView().byId("economyButton").setEnabled(false);
            else
                this.getView().byId("economyButton").setEnabled(true);
                
            if(freeSeatsModel.getProperty("/businessSeatsFree") < 1) 
                this.getView().byId("businessButton").setEnabled(false);
            else
                this.getView().byId("businessButton").setEnabled(true);

            if(freeSeatsModel.getProperty("/firstSeeatsFree") < 1)
                this.getView().byId("firstClassButton").setEnabled(false);
            else
                this.getView().byId("firstClassButton").setEnabled(true);

        },

        /* 
        get button id to select correct seat for correct billing process.
        */
        bookflight: function(oEvent) {
            var buttonId = oEvent.getSource().sId;
            if(buttonId.includes("business"))
                this.getModel("bookingModel").setProperty("/bookingForSeatClass", "Business Class")
            else if(buttonId.includes("economy"))
                this.getModel("bookingModel").setProperty("/bookingForSeatClass", "Economy Class")
            else if(buttonId.includes("firstClass"))
                this.getModel("bookingModel").setProperty("/bookingForSeatClass", "First Class")


            console.log(this.getModel("bookingModel").getProperty("/bookingForSeatClass"))

            this._oRouter.navTo("bookingProcess")
            this._setLayout("One")
        }
	});
});