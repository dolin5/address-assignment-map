var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/WebMap", "esri/views/MapView", "./form"], function (require, exports, WebMap_1, MapView_1, form_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    WebMap_1 = __importDefault(WebMap_1);
    MapView_1 = __importDefault(MapView_1);
    var map = new WebMap_1.default({
        portalItem: {
            id: "7e05c274552f4c339441b26ee5101e2b",
        },
    });
    exports.view = new MapView_1.default({
        map: map,
        container: "viewDiv",
        center: [-111.144, 45.7052],
        zoom: 12,
    });
    var makeFormAction = {
        title: "Assignment",
        id: "address-assignment",
        className: "esri-icon-documentation",
    };
    exports.view.when(function () {
        // Watch for when features are selected
        exports.featureLayer = exports.view.map.layers
            .filter(function (l) {
            if (l.title === "Assigned Addresses") {
                return true;
            }
            l.visible = false;
        })
            .getItemAt(0);
        exports.featureLayer.popupTemplate.actions = [
            makeFormAction,
        ];
        exports.featureLayer.when(form_1.initForm);
    });
    exports.view.popup.on("trigger-action", function (event) {
        // Execute the measureThis() function if the measure-this action is clicked
        if (event.action.id === "address-assignment") {
            //getAddressAssignment();
            //highlightAddress(view.popup.selectedFeature);
        }
    });
});
//# sourceMappingURL=main.js.map