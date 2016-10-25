"use strict";

require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/layers/FeatureLayer",
  "esri/layers/GraphicsLayer",

  "esri/Graphic",
  "esri/renderers/SimpleRenderer",
  "esri/symbols/SimpleFillSymbol",
   "esri/symbols/ObjectSymbol3DLayer",
  "esri/symbols/PolygonSymbol3D",
  "esri/symbols/ExtrudeSymbol3DLayer",

  "esri/tasks/support/Query",

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
        Graphic, SimpleRenderer, SimpleFillSymbol, ObjectSymbol3DLayer, PolygonSymbol3D, ExtrudeSymbol3DLayer,
        Query,
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
  //Set this on a featureLayer.Load event
  precipitaciones_lyr.load().then(attributesReady);

  function attributesReady(){
    view.on("click", function(evt) {
        // get the returned screenPoint and use it
        // with hitTest to find if any graphics were clicked
        // (using promise chaining for cleaner code and error handling)
      view.hitTest(evt.screenPoint).then(function(response) {

        // we're only interested in the first result
        var result = response.results[0];
        if (result && result.graphic) {
          return result.graphic;
        }
      }).then(function(graphic){
        window.alert("Click event checked");
        var objectid = graphic.attributes.OBJECTID; //mind the capital letters in fields
        var query = new Query();
        query.where = "objectid = " + objectid;
        query.returnGeometry = false; 
        query.outFields = ["Texto","ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
        // query method of featureLayers
        return precipitaciones_lyr.queryFeatures(query);
        console.log(query.where);
      }).then(function(results){
        
        console.log("Proper events");
        console.log(results.features.length);
        console.log(results.features[0].attributes);
        if (results && results.features.length > 0) {
          //The first time this is done the chart2 will be empty.
          //here it is placed the chart2.dataset and update event
          //var dataset = fill with results.features.
          //set dataset in chart2 and update
        }
      }).otherwise(function(err){
        console.error(err);
      });
    });
  }; //function attributesReady


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
        "x": {"field":"ene","label":""},
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
    width:370,
    height:600
  }); //chart



  var chart2 = new Cedar({
    type:"bar",
    dataset: {
        data: {"features":[
      {
        "attributes": {
          "Mes": "Enero",
          "Precipitaciones": 652
        }
      },{
        "attributes": {
          "Mes": "Febrero",
          "Precipitaciones": 517
        }
      },{
        "attributes": {
          "Mes": "Marzo",
          "Precipitaciones": 652
        }
      },{
        "attributes": {
          "Mes": "Abril",
          "Precipitaciones": 325
        }
      },{
        "attributes": {
          "Mes": "Mayo",
          "Precipitaciones": 327
        }
      },{
        "attributes": {
          "Mes": "Junio",
          "Precipitaciones": 98
        }
      },{
        "attributes": {
          "Mes": "Julio",
          "Precipitaciones": 58
        }
      },{
        "attributes": {
          "Mes": "Agosto",
          "Precipitaciones": 658
        }
      },{
        "attributes": {
          "Mes": "Septiembre",
          "Precipitaciones": 198
        }
      },{
        "attributes": {
          "Mes": "Octubre",
          "Precipitaciones": 238
        }
      },{
        "attributes": {
          "Mes": "Noviembre",
          "Precipitaciones": 125
        }
      },{
        "attributes": {
          "Mes": "Diciembre",
          "Precipitaciones": 367
        }
      }
    ]},
      mappings: {
        "x": {"field":"Mes","label":""},
        "y": {"field":"Precipitaciones","label":"Precipitación mm"}
      }
    } //dataset
  });

  chart2.show({
    elementId: "#barChart2",
    height: 175
  }); //chart

});//require

