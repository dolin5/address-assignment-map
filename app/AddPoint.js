/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/widgets/support/widget"], function (require, exports, __extends, __decorate, decorators_1, Widget, widget_1) {
    "use strict";
    var CSS = {
        base: "esri-component,esri-widget",
        button: "esri-widget--button",
        icon: "esri-icon-edit",
        enabled: "enabled"
    };
    var AddPoint = /** @class */ (function (_super) {
        __extends(AddPoint, _super);
        function AddPoint(params) {
            return _super.call(this) || this;
        }
        AddPoint.prototype.postInitialize = function () {
            this.enabled = false;
            //watchUtils.init(this, "view.center, view.interacting, view.scale", () => this._onViewChange());
            //this.otherBasemap = Basemap.fromId("satellite");
        };
        //-------------------------------------------------------------------
        //
        //  Public methods
        //
        //-------------------------------------------------------------------
        AddPoint.prototype.render = function () {
            return (widget_1.tsx("div", { bind: this, class: CSS.base, onclick: this.toggleListener },
                widget_1.tsx("div", { id: "add-button", class: CSS.button },
                    widget_1.tsx("span", { class: CSS.icon }))));
        };
        AddPoint.prototype.toggleListener = function () {
            var _this = this;
            //let temp = this.view.map.basemap;
            //this.view.map.basemap = this.otherBasemap;
            //this.otherBasemap = temp;
            if (!this.enabled) {
                this.view.container.classList.add("editor");
                this.enabled = true;
                document.getElementById("add-button").classList.add("enabled");
                this.handler = this.view.on("click", function (mapViewClickEvent) {
                    _this.handler.remove();
                    mapViewClickEvent.stopPropagation();
                    _this.view.container.classList.remove("editor");
                    _this.clickCallback(mapViewClickEvent.mapPoint);
                    _this.enabled = false;
                });
            }
            else {
                document.getElementById("add-button").classList.remove("enabled");
                this.view.container.classList.remove("editor");
                this.handler.remove();
                this.enabled = false;
            }
            //this.view.goTo(this.initialCenter);
        };
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], AddPoint.prototype, "view", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], AddPoint.prototype, "handler", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], AddPoint.prototype, "enabled", void 0);
        __decorate([
            decorators_1.property()
        ], AddPoint.prototype, "clickCallback", void 0);
        AddPoint = __decorate([
            decorators_1.subclass("esri.widgets.add-point")
        ], AddPoint);
        return AddPoint;
    }(decorators_1.declared(Widget)));
    return AddPoint;
});
//# sourceMappingURL=AddPoint.js.map