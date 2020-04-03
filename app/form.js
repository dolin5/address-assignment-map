var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define(["require", "exports", "esri/widgets/FeatureForm", "esri/Graphic", "esri/layers/FeatureLayer", "esri/core/promiseUtils", "./main", "./AddPoint", "./field-mappings"], function (require, exports, FeatureForm_1, Graphic_1, FeatureLayer_1, promiseUtils, main_1, AddPoint_1, field_mappings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    FeatureForm_1 = __importDefault(FeatureForm_1);
    Graphic_1 = __importDefault(Graphic_1);
    FeatureLayer_1 = __importDefault(FeatureLayer_1);
    promiseUtils = __importStar(promiseUtils);
    AddPoint_1 = __importDefault(AddPoint_1);
    field_mappings_1 = __importDefault(field_mappings_1);
    var highlight;
    var editFeature;
    var form;
    var parcelsLayer = new FeatureLayer_1.default({
        url: "https://gis.gallatin.mt.gov/arcgis/rest/services/MapServices/Planning/MapServer/7",
    });
    var sectionsLayer = new FeatureLayer_1.default({
        url: "https://gis.gallatin.mt.gov/arcgis/rest/services/MapServices/Planning/MapServer/25",
    });
    function initForm() {
        // Add a new feature form with grouped fields
        form = new FeatureForm_1.default({
            container: "form",
            groupDisplay: "sequential",
            layer: main_1.featureLayer,
        });
        // Disable popup
        main_1.view.popup.autoOpenEnabled = false;
        // // Listen to the feature form's submit event.
        form.on("submit", function () {
            if (editFeature) {
                // Grab updated attributes from the form.
                var updated_1 = form.getValues();
                // Loop through updated attributes and assign
                // the updated values to feature attributes.
                Object.keys(updated_1).forEach(function (name) {
                    editFeature.attributes[name] = updated_1[name];
                });
                // Setup the applyEdits parameter with updates.
                var edits = {
                    updateFeatures: [editFeature],
                };
                applyAttributeUpdates(edits);
            }
        });
        main_1.view.ui.add("update", "top-right");
        main_1.view.ui.add("info", {
            position: "top-left",
            index: 1,
        });
        document.getElementById("info").classList.remove("esri-hidden");
        var addPoint = new AddPoint_1.default({ view: main_1.view, clickCallback: mapClick });
        main_1.view.ui.add(addPoint, "top-left");
        main_1.view.on("click", function (event) {
            if (!addPoint.enabled) {
                // Unselect any currently selected features
                unselectFeature();
                // Listen for when the user clicks on the view
                main_1.view.hitTest(event).then(function (response) {
                    // If user selects a feature, select it
                    var results = response.results;
                    if (results.length > 0 &&
                        results[0].graphic &&
                        results[0].graphic.layer === main_1.featureLayer) {
                        selectFeature(results[0].graphic.attributes[main_1.featureLayer.objectIdField]);
                    }
                    else {
                        // Hide the form and show the info div
                        document.getElementById("update").classList.add("esri-hidden");
                    }
                });
            }
        });
    }
    exports.initForm = initForm;
    // Call FeatureLayer.applyEdits() with specified params.
    function applyAttributeUpdates(params) {
        document.getElementById("btnUpdate").style.cursor = "progress";
        main_1.featureLayer
            .applyEdits(params)
            .then(function (editsResult) {
            // Get the objectId of the newly added feature.
            // Call selectFeature function to highlight the new feature.
            if (editsResult.addFeatureResults.length > 0) {
                var objectId = editsResult.addFeatureResults[0].objectId;
                selectFeature(objectId);
            }
            else if (editsResult.updateFeatureResults.length > 0) {
                var objectId = editsResult.updateFeatureResults[0].objectId;
                selectFeature(objectId);
            }
            document.getElementById("btnUpdate").style.cursor = "pointer";
        })
            .catch(function (error) {
            console.log("===============================================");
            console.error("[ applyEdits ] FAILURE: ", error.code, error.name, error.message);
            console.log("error = ", error);
            document.getElementById("btnUpdate").style.cursor = "pointer";
        });
    }
    function mapClick(mapPoint) {
        return __awaiter(this, void 0, void 0, function () {
            var point;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        unselectFeature();
                        form.feature = null;
                        point = mapPoint.clone();
                        point.z = undefined;
                        point.hasZ = false;
                        editFeature = new Graphic_1.default({
                            geometry: point,
                            attributes: {
                                ASSIGNMENT_DATE: new Date()
                            },
                        });
                        return [4 /*yield*/, getParcelInfo(point)];
                    case 1:
                        _a.sent();
                        // Setup the applyEdits parameter with adds.
                        applyAttributeUpdates({
                            addFeatures: [editFeature],
                        });
                        return [2 /*return*/];
                }
            });
        });
    }
    function getParcelInfo(point) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var queryResults, parcel, section;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, promiseUtils.eachAlways([parcelsLayer, sectionsLayer].map(function (l) {
                            return l.queryFeatures({ geometry: point, outFields: ["*"] });
                        }))];
                    case 1:
                        queryResults = _c.sent();
                        parcel = (_a = queryResults[0].value.features) === null || _a === void 0 ? void 0 : _a[0].attributes;
                        section = (_b = queryResults[1].value.features) === null || _b === void 0 ? void 0 : _b[0].attributes;
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
                        return [2 /*return*/];
                }
            });
        });
    }
    // Function to unselect features
    function unselectFeature() {
        if (highlight) {
            highlight.remove();
        }
    }
    // Highlight the clicked feature and display
    // its attributes in the featureform.
    function selectFeature(objectId) {
        // query feature from the server
        main_1.featureLayer
            .queryFeatures({
            objectIds: [objectId],
            outFields: ["*"],
            returnGeometry: true,
        })
            .then(function (results) {
            if (results.features.length > 0) {
                editFeature = results.features[0];
                // display the attributes of selected feature in the form
                form.feature = editFeature;
                // highlight the feature on the view
                main_1.view
                    .whenLayerView(editFeature.layer)
                    .then(function (layerView) {
                    highlight = layerView.highlight(editFeature);
                });
                if (document.getElementById("update").classList.contains("esri-hidden")) {
                    document.getElementById("info").classList.add("esri-hidden");
                    document.getElementById("update").classList.remove("esri-hidden");
                }
            }
        });
    }
    function getAddressAssignment() {
        return __awaiter(this, void 0, void 0, function () {
            var updated, pdfData, _i, _a, _b, k, v, date, url;
            return __generator(this, function (_c) {
                updated = form.getValues();
                // Loop through updated attributes and assign
                // the updated values to feature attributes.
                Object.keys(updated).forEach(function (name) {
                    editFeature.attributes[name] = updated[name];
                });
                pdfData = {};
                for (_i = 0, _a = Object.entries(field_mappings_1.default); _i < _a.length; _i++) {
                    _b = _a[_i], k = _b[0], v = _b[1];
                    pdfData[k] = "";
                    if (v === "ASSIGNMENT_DATE") {
                        date = new Date(updated[v]);
                        pdfData[k] = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
                        continue;
                    }
                    if (v instanceof Array) {
                        pdfData[k] = v.reduce(function (accumulator, currentValue) {
                            if (updated[currentValue] === null || updated[currentValue] === " ") {
                                updated[currentValue] = "";
                            }
                            return accumulator + updated[currentValue] + " ";
                        }, "");
                        pdfData[k] = pdfData[k].trim();
                    }
                    else {
                        pdfData[k] = updated[v];
                    }
                    if (pdfData[k] === undefined || pdfData[k] === null || pdfData[k] === " ") {
                        pdfData[k] = "";
                    }
                }
                url = new URL("https://address-form-filler.herokuapp.com/get-form");
                Object.keys(pdfData).forEach(function (k) {
                    url.searchParams.append(k, pdfData[k]);
                });
                fetch(url)
                    .then(function (response) {
                    return response.blob();
                })
                    .then(function (blob) {
                    var fileURL = URL.createObjectURL(blob);
                    window.open(fileURL, "_blank");
                });
                return [2 /*return*/];
            });
        });
    }
    document.getElementById("btnUpdate").onclick = function () {
        // Fires feature form's submit event.
        form.submit();
    };
    document.getElementById("btnCreate").onclick = getAddressAssignment;
});
//# sourceMappingURL=form.js.map