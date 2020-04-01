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
define(["require", "exports", "esri/WebMap", "esri/views/MapView", "./field-mappings"], function (require, exports, WebMap_1, MapView_1, field_mappings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    WebMap_1 = __importDefault(WebMap_1);
    MapView_1 = __importDefault(MapView_1);
    field_mappings_1 = __importDefault(field_mappings_1);
    var map = new WebMap_1.default({
        portalItem: {
            id: "7e05c274552f4c339441b26ee5101e2b",
        },
    });
    var view = new MapView_1.default({
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
    view.when(function () {
        // Watch for when features are selected
        var assignedAddressLayer = view.map.layers
            .filter(function (l) {
            if (l.title === "Assigned Addresses") {
                return true;
            }
            l.visible = false;
        })
            .getItemAt(0);
        assignedAddressLayer.popupTemplate.actions = [makeFormAction];
    });
    view.popup.on("trigger-action", function (event) {
        // Execute the measureThis() function if the measure-this action is clicked
        if (event.action.id === "address-assignment") {
            getAddressAssignment();
        }
    });
    function getAddressAssignment() {
        return __awaiter(this, void 0, void 0, function () {
            var attributes, date, pdfData, _i, _a, _b, k, v, url;
            return __generator(this, function (_c) {
                attributes = view.popup.selectedFeature.attributes;
                date = new Date(attributes.MAPPING_DATE);
                attributes.DATE =
                    date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
                pdfData = {};
                for (_i = 0, _a = Object.entries(field_mappings_1.default); _i < _a.length; _i++) {
                    _b = _a[_i], k = _b[0], v = _b[1];
                    pdfData[k] = "";
                    if (v instanceof Array) {
                        pdfData[k] = v.reduce(function (accumulator, currentValue) {
                            return accumulator + attributes[currentValue] + " ";
                        }, "");
                        pdfData[k] = pdfData[k].trim();
                    }
                    else {
                        pdfData[k] = attributes[v];
                    }
                    if (pdfData[k] === undefined) {
                        pdfData[k] = "";
                    }
                }
                console.log(pdfData);
                url = new URL("http://address-form-filler.herokuapp.com/get-form");
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
});
//# sourceMappingURL=main.js.map