sap.ui.define([
	"./BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(
	BaseController, Filter, FilterOperator
) {
	"use strict";

	return BaseController.extend("SAPUI_Flights.controller.Home", {
		onInit: function() {
			this._oRouter = this.getRouter();
			this._oRouter.getRoute("home").attachPatternMatched(this._routePatternMatched, this);
			
		},
		_routePatternMatched: function (oEvent) {
			this._setLayout("Two");
		},
		onListItemPress: function(oEvent) {
			var connid = oEvent.getSource().getBindingContext().getProperty("Connid");
			this.getRouter().navTo("flightDetail", {connid: connid})
		},

		/**
		 * search function for searching of cities (from)
		 * @param {} oEvent 
		 */
		onSearch: function(oEvent) {

			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
	
			if (sQuery) {
				aFilter.push(new Filter("Cityfrom", FilterOperator.EQ, sQuery.toUpperCase()));
			}

			// filter binding
			var oList = this.getView().byId("flightList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		}
	});
});