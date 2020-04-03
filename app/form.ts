import FeatureForm from "esri/widgets/FeatureForm";
import Graphic from "esri/Graphic";
import FeatureLayer from "esri/layers/FeatureLayer";
import * as promiseUtils from "esri/core/promiseUtils";
import * as watchUtils from "esri/core/watchUtils";
import { view, featureLayer } from "./main";
import AddPoint from "./AddPoint";
import FieldMappings from "./field-mappings";

import esri = __esri;

interface ApplyEditsParams {
  updateFeatures?: esri.Graphic[];
  addFeatures?: esri.Graphic[];
}

let highlight: esri.Handle;
let editFeature: esri.Graphic;
let form: esri.FeatureForm;

let parcelsLayer = new FeatureLayer({
  url:
    "https://gis.gallatin.mt.gov/arcgis/rest/services/MapServices/Planning/MapServer/7",
});

let sectionsLayer = new FeatureLayer({
  url:
    "https://gis.gallatin.mt.gov/arcgis/rest/services/MapServices/Planning/MapServer/25",
});

export function initForm() {
  // Add a new feature form with grouped fields
  form = new FeatureForm({
    container: "form",
    groupDisplay: "sequential", // only display one group at a time
    layer: featureLayer,
    fieldConfig: [
      {
        label: "Assignment info",
        description: "",
        fieldConfig: [
          {
            name: "ASSIGNMENT_DATE",
            label: "Date",
          },
          {
            name: "PIRF_NUMBER",
            label: "PIRF#",
          },
        ],
      },
      {
        label: "Address info",
        description: "",
        fieldConfig: [
          {
            name: "ADDRESS_NUMBER",
            label: "Number",
          },
          {
            name: "DIRPRE",
            label: "Prefix",
          },
          {
            name: "ROADNAME",
            label: "Road name",
          },
          {
            name: "ROADTYPE",
            label: "Road type",
          },
          {
            name: "DIRSUF",
            label: "Suffix",
          },
          {
            name: "Unit",
            label: "Unit",
          },
        ],
      },
      {
        label: "Applicant",
        description: "",
        fieldConfig: [
          {
            name: "CONTACT_INDIVIDUAL",
            label: "Name",
          },
          {
            name: "CONTACT_PHONE",
            label: "Phone",
          },
          {
            name: "CONTACT_EMAIL",
            label: "Email",
          },
        ],
      },
      {
        label: "Property info",
        description: "",
        fieldConfig: [
          {
            name: "TOWNSHIP_RANGE",
            label: "Township",
          },
          {
            name: "PLSS_SECTION",
            label: "Section",
          },
          {
            name: "SUBDIVISION",
            label: "Subdivision",
          },
          {
            name: "BLOCK",
            label: "Block",
          },
          {
            name: "LOT_TRACT",
            label: "Lot/Tract",
          },
          {
            name: "COS",
            label: "COS",
          },
          {
            name: "DEED_REF",
            label: "Deed Ref",
          },
        ],
      },
      {
        label: "Structure",
        description: "",
        fieldConfig: [
          {
            name: "STRUCTURE_TYPE",
            label: "Structure type",
          },
          {
            name: "COMMENTS",
            label: "Comments",
          },
        ],
      },
    ],
    // fieldConfig: [
    //   {
    //     label: "Address Information",
    //     description: "address info",
    //     fieldConfig: [
    //       {
    //         name: "ADDRESS_NUMBER",
    //       },
    //       {
    //         name: "DIRPRE",
    //       },
    //       {
    //         name: "ROADNAME",
    //       },
    //       {
    //         name: "ROADTYPE",
    //       },
    //       {
    //         name: "DIRSUF",
    //       },
    //       {
    //         name: "UNIT",
    //       },
    //     ],
    //   },
    //   {
    //     label: "Contact Information",
    //     description: "who wants an address?",
    //     fieldConfig: [
    //       {
    //         name: "CONTACT_INDIVIDUAL",
    //       },
    //     ],
    //   },
    // ],
  });

  // Disable popup
  view.popup.autoOpenEnabled = false;

  // // Listen to the feature form's submit event.
  form.on("submit", function () {
    if (editFeature) {
      // Grab updated attributes from the form.
      const updated = form.getValues();

      // Loop through updated attributes and assign
      // the updated values to feature attributes.
      Object.keys(updated).forEach(function (name) {
        editFeature.attributes[name] = updated[name];
      });

      // Setup the applyEdits parameter with updates.
      const edits = {
        updateFeatures: [editFeature],
      };
      applyAttributeUpdates(edits);
    }
  });
  view.ui.add("update", "top-right");
  view.ui.add("info", {
    position: "top-left",
    index: 1,
  });
  document.getElementById("info").classList.remove("esri-hidden");

  let addPoint = new AddPoint({ view, clickCallback: mapClick });
  view.ui.add(addPoint, "top-left");

  view.on("click", function (event) {
    if (!addPoint.enabled) {
      // Unselect any currently selected features
      unselectFeature();
      // Listen for when the user clicks on the view
      view.hitTest(event).then(function (response) {
        // If user selects a feature, select it
        const results = response.results;
        if (
          results.length > 0 &&
          results[0].graphic &&
          results[0].graphic.layer === featureLayer
        ) {
          selectFeature(
            results[0].graphic.attributes[featureLayer.objectIdField]
          );
        } else {
          // Hide the form and show the info div
          document.getElementById("update").classList.add("esri-hidden");
        }
      });
    }
  });
}

// Call FeatureLayer.applyEdits() with specified params.
function applyAttributeUpdates(params: ApplyEditsParams) {
  document.getElementById("btnUpdate").style.cursor = "progress";
  featureLayer
    .applyEdits(params)
    .then(function (editsResult) {
      // Get the objectId of the newly added feature.
      // Call selectFeature function to highlight the new feature.
      if (editsResult.addFeatureResults.length > 0) {
        const objectId = editsResult.addFeatureResults[0].objectId;
        selectFeature(objectId);
      } else if (editsResult.updateFeatureResults.length > 0) {
        const objectId = editsResult.updateFeatureResults[0].objectId;
        selectFeature(objectId);
      }
      document.getElementById("btnUpdate").style.cursor = "pointer";
    })
    .catch(function (error) {
      console.log("===============================================");
      console.error(
        "[ applyEdits ] FAILURE: ",
        error.code,
        error.name,
        error.message
      );
      console.log("error = ", error);
      document.getElementById("btnUpdate").style.cursor = "pointer";
    });
}

async function mapClick(mapPoint: esri.Point) {
  unselectFeature();
  form.feature = null;
  let point = mapPoint.clone();
  point.z = undefined;
  point.hasZ = false;

  editFeature = new Graphic({
    geometry: point,
    attributes: {
      ASSIGNMENT_DATE: new Date(),
    },
  });
  await getParcelInfo(point);
  // Setup the applyEdits parameter with adds.
  applyAttributeUpdates({
    addFeatures: [editFeature],
  });
}

async function getParcelInfo(point: esri.Point) {
  const queryResults = await promiseUtils.eachAlways(
    [parcelsLayer, sectionsLayer].map((l) => {
      return l.queryFeatures({ geometry: point, outFields: ["*"] });
    })
  );
  const parcel = queryResults[0].value.features?.[0].attributes;
  const section = queryResults[1].value.features?.[0].attributes;
  if (parcel) {
    editFeature.attributes.BLOCK = parcel.BLOCK;
    editFeature.attributes.LOT_TRACT = parcel.LOT;
    editFeature.attributes.SUBDIVISION = parcel.SUB_NAME;
    if (parcel.CLASS === "COS") {
      editFeature.attributes.COS = "COS " + parcel.RECORD.replace("COS ", "");
    }
    editFeature.attributes.DEED_REF = parcel.RECORD;
  }
  if (section) {
    editFeature.attributes.PLSS_SECTION = section.SECTION;
    editFeature.attributes.TOWNSHIP_RANGE =
      section.TOWN + section.N_S + " " + section.RANGE + section.E_W;
  }
}

// Function to unselect features
function unselectFeature() {
  if (highlight) {
    highlight.remove();
  }
}

// Highlight the clicked feature and display
// its attributes in the featureform.
function selectFeature(objectId: number) {
  // query feature from the server
  featureLayer
    .queryFeatures({
      objectIds: [objectId],
      outFields: ["*"],
      returnGeometry: true,
    })
    .then(function (results: esri.FeatureSet) {
      if (results.features.length > 0) {
        editFeature = results.features[0];

        // display the attributes of selected feature in the form
        form.feature = editFeature;

        // highlight the feature on the view
        view
          .whenLayerView(editFeature.layer)
          .then(function (layerView: esri.FeatureLayerView) {
            highlight = layerView.highlight(editFeature);
          });

        if (
          document.getElementById("update").classList.contains("esri-hidden")
        ) {
          document.getElementById("info").classList.add("esri-hidden");
          document.getElementById("update").classList.remove("esri-hidden");
        }
      }
    });
}
async function getAddressAssignment() {
  const updated = form.getValues();

  // Loop through updated attributes and assign
  // the updated values to feature attributes.
  Object.keys(updated).forEach(function (name) {
    editFeature.attributes[name] = updated[name];
  });

  //const attributes = view.popup.selectedFeature.attributes;
  let pdfData = {};
  for (let [k, v] of Object.entries(FieldMappings)) {
    pdfData[k] = "";
    if (v === "ASSIGNMENT_DATE") {
      let date = new Date(updated[v]);
      pdfData[k] =
        date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
      continue;
    }
    if (v instanceof Array) {
      pdfData[k] = v.reduce((accumulator, currentValue) => {
        if (updated[currentValue] === null || updated[currentValue] === " ") {
          updated[currentValue] = "";
        }
        return accumulator + updated[currentValue] + " ";
      }, "");
      pdfData[k] = pdfData[k].trim();
    } else {
      pdfData[k] = updated[v];
    }
    if (pdfData[k] === undefined || pdfData[k] === null || pdfData[k] === " ") {
      pdfData[k] = "";
    }
  }
  const url = new URL("https://address-form-filler.herokuapp.com/get-form");
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

document.getElementById("btnUpdate").onclick = function () {
  // Fires feature form's submit event.
  form.submit();
};

document.getElementById("btnCreate").onclick = getAddressAssignment;
