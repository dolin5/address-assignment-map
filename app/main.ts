import WebMap from "esri/WebMap";
import MapView from "esri/views/MapView";
import FieldMappings from "./field-mappings";

const map = new WebMap({
  portalItem: {
    id: "7e05c274552f4c339441b26ee5101e2b",
  },
});

const view = new MapView({
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
  let assignedAddressLayer = view.map.layers
    .filter(function (l) {
      if (l.title === "Assigned Addresses") {
        return true;
      }
      l.visible = false;
    })
    .getItemAt(0);
  (assignedAddressLayer as __esri.FeatureLayer).popupTemplate.actions = [makeFormAction] as unknown as __esri.Collection<__esri.ActionButton>;
});

view.popup.on("trigger-action", function (event) {
  // Execute the measureThis() function if the measure-this action is clicked
  if (event.action.id === "address-assignment") {
    getAddressAssignment();
  }
});

async function getAddressAssignment() {
  const attributes = view.popup.selectedFeature.attributes;
  let date = new Date(attributes.MAPPING_DATE);
  attributes.DATE =
    date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
  let pdfData = {};
  for (let [k, v] of Object.entries(FieldMappings)) {
    pdfData[k] = "";
    if (v instanceof Array) {
      pdfData[k] = v.reduce((accumulator, currentValue) => {
        return accumulator + attributes[currentValue] + " ";
      }, "");
      pdfData[k] = pdfData[k].trim();
    } else {
      pdfData[k] = attributes[v];
    }
    if (pdfData[k] === undefined) {
      pdfData[k] = "";
    }
  }
  console.log(pdfData);
  const url = new URL("http://address-form-filler.herokuapp.com/get-form");
  Object.keys(pdfData).forEach((k) => {
    url.searchParams.append(k, pdfData[k]);
  });
  fetch(url)
    .then((response) => {
      return response.blob();
    })
    .then((blob: Blob) => {
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, "_blank");
    });
}
