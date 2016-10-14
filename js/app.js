"use strict";

require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/layers/FeatureLayer",
  "esri/layers/GraphicsLayer",

  "esri/Graphic",
  "esri/renderers/SimpleRenderer",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/PolygonSymbol3D",
  "esri/symbols/ExtrudeSymbol3DLayer",

  "esri/widgets/Search",

  // Bootstrap
  "bootstrap/Collapse", 
  "bootstrap/Modal",
  "bootstrap/Dropdown",
  "bootstrap/Tab",
  
  // Calcite-maps
  "calcite-maps/calcitemaps-v0.2",

  "dojo/domReady!"
], 
function(Map, 
        SceneView, FeatureLayer, GraphicsLayer,
        Graphic, SimpleRenderer, SimpleFillSymbol, PolygonSymbol3D, ExtrudeSymbol3DLayer,
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

  var graphicsLayer = new GraphicsLayer();

  //Map and Scene
  // Code to create the map and view will go here
  var map = new Map({
    basemap: "dark-gray",
    ground: "world-elevation",
    layers: [precipitaciones_lyr, graphicsLayer]
  });//map

  var view = new SceneView({
    container: "viewDiv", //Dom reference
    map:map, // Map object above created
    center: [-3.7038, 40.4168],
    zoom: 4,
    padding: {top: 50}
  });

  //Map and view events
  // Set up a click event handler and retrieve the screen point
  view.on("click", function(evt) {
    var screenPoint = evt.screenPoint;

    // the hitTest() checks to see if any graphics in the view
    // intersect the given screen point
    view.hitTest(screenPoint)
      .then(getGraphics);
  });

  function getGraphics(response) {
    // the topmost graphic from the click location
    // and display select attribute values from the
    // graphic to the user
    var graphic = response.results[0].graphic;
    var attributes = graphic.attributes;
    var provincia = attributes.Texto;
    var month = attributes.ene;

    // symbolize all line segments with the given
    // storm name with the same symbol
    var renderer = new UniqueValueRenderer({
      field: "NAME",
      defaultSymbol: layer.renderer.symbol || layer.renderer.defaultSymbol,
      uniqueValueInfos: [{
        value: name,
        symbol: new SimpleLineSymbol({
          color: "orange",
          width: 5
        })
      }]
    });
    layer.renderer = renderer;
  }

  //Search Widget

  // Search parameters
  var searchWidget = new Search({
      view: view
    }, "searchWidgetDiv");
  searchWidget.startup();


  
  //Charts
  var chart = new Cedar({
    type:"bar-horizontal",
    dataset: {
      url:"http://services6.arcgis.com/IKNzV87WiinOV4AF/arcgis/rest/services/Precipitaciones_provincia_mes/FeatureServer/0",
      query: {
        orderByFields: "ene DESC"
      },
      mappings: {
        "x": {"field":"ene","label":"Precipitaciones (mm)"},
        "y": {"field":"Texto","label":""}
      }
    } //dataset
  });


  // Text mouse over chart
  chart.tooltip = {
    "title": "{Texto}",
    "content": "{ene} mm en el mes de Enero"
  }

  chart.show({
    elementId: "#barChart",
    width:300,
    height:600
  }); //chart



  var chart2 = new Cedar({
    type:"bar",
    dataset: {
      url:"http://services6.arcgis.com/IKNzV87WiinOV4AF/arcgis/rest/services/Precipitaciones_provincia_mes/FeatureServer/0",
      query: {
        orderByFields: "ene DESC"
      },
      mappings: {
        "x": {"field":"Texto","label":"provincia"},
        "y": {"field":"ene","label":"Precipitaciones (mm)"}
      }
    } //dataset
  });


  // Text mouse over chart
  chart2.tooltip = {
    "title": "{Texto}",
    "content": "{ene} mm en el mes de Enero"
  }

  chart2.show({
    elementId: "#barChart2",
    height:200
  }); //chart

});//require

