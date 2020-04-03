/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import { subclass, declared, property } from "esri/core/accessorSupport/decorators";
import Widget = require("esri/widgets/Widget");
import watchUtils = require("esri/core/watchUtils");

import { renderable, tsx } from "esri/widgets/support/widget";

import Point = require("esri/geometry/Point");
import MapView = require("esri/views/MapView");
import { featureLayer } from "./main";


interface Params {
  view:MapView,
  clickCallback:(arg:Point)=>void;
}

const CSS = {
  base: "esri-component,esri-widget",
  button:"esri-widget--button",
  icon:"esri-icon-edit",
  enabled:"enabled"
};



@subclass("esri.widgets.add-point")
class AddPoint extends declared(Widget) {

  constructor(params:Params) {
    super();
  }

  postInitialize() {
    this.enabled = false;
    //watchUtils.init(this, "view.center, view.interacting, view.scale", () => this._onViewChange());
    //this.otherBasemap = Basemap.fromId("satellite");
  }

  //--------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------

  //@property()
  //otherBasemap: Basemap;
 

  @property()
  @renderable()
  view: MapView;

  @property()
  @renderable()
  handler: __esri.MapViewClickEventHandler;

  @property()
  @renderable()
  enabled: boolean;
  @property()
  clickCallback:(arg:Point)=>void;

  //-------------------------------------------------------------------
  //
  //  Public methods
  //
  //-------------------------------------------------------------------

  render() {
    return (
      <div
        bind={this}
        class={CSS.base}
        onclick={this.toggleListener}>
        <div id="add-button" class={CSS.button}>
          <span class={CSS.icon}></span>
        </div>
      </div>
    );
  }

  private toggleListener() {
    //let temp = this.view.map.basemap;
    //this.view.map.basemap = this.otherBasemap;
    //this.otherBasemap = temp;
    if (!this.enabled){
      this.view.container.classList.add("editor");
      this.enabled = true;
      document.getElementById("add-button").classList.add("enabled");
  
      this.handler = this.view.on("click",(mapViewClickEvent)=>{
        this.handler.remove();
        mapViewClickEvent.stopPropagation();
        this.view.container.classList.remove("editor");
        this.clickCallback(mapViewClickEvent.mapPoint);
        this.enabled = false;

      });

    }
    else{
      document.getElementById("add-button").classList.remove("enabled");
      this.view.container.classList.remove("editor");
      this.handler.remove();
      this.enabled = false;
    }
    //this.view.goTo(this.initialCenter);
  }
}

export =AddPoint;