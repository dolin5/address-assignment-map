import WebMap from "esri/WebMap";
import MapView from "esri/views/MapView";
import { initForm } from "./form";
import esri = __esri;
export let featureLayer: esri.FeatureLayer;

const map = new WebMap({
  portalItem: {
    id: "7e05c274552f4c339441b26ee5101e2b",
  },
});

export const view = new MapView({
  map: map,
  container: "viewDiv",
  center: [-111.144, 45.7052],
  zoom: 12,
});

let makeFormAction = {
  title: "Assignment",
  id: "address-assignment",
  className: "esri-icon-documentation",
};

view.when(function () {
  // Watch for when features are selected
  featureLayer = view.map.layers
    .filter(function (l) {
      if (l.title === "Assigned Addresses") {
        return true;
      }
      l.visible = false;
    })
    .getItemAt(0) as esri.FeatureLayer;
  featureLayer.popupTemplate.actions = ([
    makeFormAction,
  ] as unknown) as __esri.Collection<__esri.ActionButton>;
  featureLayer.when(initForm);
});

view.popup.on("trigger-action", function (event) {
  // Execute the measureThis() function if the measure-this action is clicked
  if (event.action.id === "address-assignment") {
    //getAddressAssignment();
    //highlightAddress(view.popup.selectedFeature);
  }
});
