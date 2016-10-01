"use strict";

require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/layers/FeatureLayer",

  "esri/renderers/SimpleRenderer",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/PolygonSymbol3D",
  "esri/symbols/ExtrudeSymbol3DLayer",

  "esri/widgets/Search",

  "dojo/domReady!"
], 
function(Map, 
        SceneView, FeatureLayer, 
        SimpleRenderer, SimpleFillSymbol, PolygonSymbol3D, ExtrudeSymbol3DLayer,
        Search
        ){


/*
  var defaultSym = new SimpleFillSymbol({
      outline: {
        color: "lightgray",
        width: 0.1
      }
  });
*/





  var renderer = new SimpleRenderer({
    symbol: new PolygonSymbol3D({
      symbolLayers: [new ExtrudeSymbol3DLayer()]
    }),
    label: "Precipitaciones mensuales en mm",
    visualVariables: [{
      type: "size",
      field:"ene",
      valueUnit: "kilometers"
    },{
      type: "color",
      field: "ene",
      maxDataValue: 100,
      minDataValue: 0,
      colors: ["#BED2FF","#0084A8"]
    }]
  });

  var precipitaciones_lyr = new FeatureLayer({
    url: "http://services6.arcgis.com/IKNzV87WiinOV4AF/arcgis/rest/services/Precipitaciones_provincia_mes/FeatureServer/0",
    renderer: renderer,
    outFields: ["*"],
    //opacity: 0.8,
    popupTemplate:  {
          title: "{Texto}, {CCAA}",
          content: "Prueba",
          fieldInfos: [
          {
            fieldName: "sep",
            format: {
              digitSeparator: false,
              places: 0
            }
          }]
        }
  });



  //Map and Scene
  // Code to create the map and view will go here
  var map = new Map({
    basemap: "dark-gray",
    ground: "world-elevation",
    layers: [precipitaciones_lyr]
  });//map

  var view = new SceneView({
    container: "viewDiv", //Dom reference
    map:map, // Map object above created
    center: [-3.7038, 40.4168],
    zoom: 4,
    padding: {top: 50}
  });


  //Search Widget

  // Search parameters
  var searchWidget = new Search({
      view: view
    }, "searchWidgetDiv");
  searchWidget.startup();



});//require