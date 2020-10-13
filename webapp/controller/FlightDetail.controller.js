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
                "econSeatsFree": 1,
                "businessSeatsFree": 2,
                "firstSeeatsFree": 3
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

            setTimeout(() => {  this.getSeatsSpots(); }, 200);
            //this.getSeatsSpots();
        },

        getSeatsSpots: function() {
            var freeSeatsModel = this.getModel("freeSeatsModel");
            var oDataModel = this.getModel("flightInfo");
            //freeSeatsModel.setProperty("/econSeatsFree", this.getModel("flightInfo").getProperty("/Seatsmax") - this.getModel("flightInfo").getProperty("/Seatsocc"))

            //console.log(oDataModel.getProperty("/Connid"));
            console.log(oDataModel.getProperty("/Seatsmax") - oDataModel.getProperty("/Seatsocc"));
            freeSeatsModel.setProperty("/econSeatsFree", (oDataModel.getProperty("/Seatsmax") - oDataModel.getProperty("/Seatsocc")))
            console.log(freeSeatsModel.getProperty("/econSeatsFree"));
        },

        bookFlight: function() {
            console.log("booked flight")
        }
	});
});