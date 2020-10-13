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

            var freeSeatsModel = new JSONModel({
                "econSeatsFree": 0,
                "businessSeatsFree": 0,
                "firstSeeatsFree": 0
            });

            this.setModel(freeSeatsModel, "freeSeatsModel");
        },
        //get connid from url
        _routePatternMatched: function (oEvent) {

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
            //this.getSeatsSpots();
        },

        //runs after .5 second timeout so models are refreshed
        getSeatsSpots: function() {
            var freeSeatsModel = this.getModel("freeSeatsModel");
            var oDataModel = this.getModel("flightInfo");

            freeSeatsModel.setProperty("/econSeatsFree", (oDataModel.getProperty("/Seatsmax") - oDataModel.getProperty("/Seatsocc")))
            freeSeatsModel.setProperty("/businessSeatsFree", (oDataModel.getProperty("/SeatsmaxB") - oDataModel.getProperty("/SeatsoccB")))
            freeSeatsModel.setProperty("/firstSeeatsFree", (oDataModel.getProperty("/SeatsmaxF") - oDataModel.getProperty("/SeatsoccF")))
        },

        bookFlight: function() {
            console.log("booked flight")
        }
	});
});