// this file loads the geojson files that are created after creating kml from geoserver thne using online convertor
// to convert kml to geojson.
var array = [];
var count = 0 ;
var dataSources = [];
var viewer = new Cesium.Viewer("cesiumContainer", {
  navigationHelpButton: false,
  animation: false,
  timeline: false,
  sceneModePicker: false,
  baseLayerPicker: false



});
var twoDView = new Cesium.Viewer("insetCesiumContainer", {
  navigationHelpButton: false,
  animation: false,
  timeline: false,
  navigationInstructionsInitiallyVisible: false,
  selectionIndicator: false,
  sceneModePicker: false,
  infoBox:false,
  homeButton: false,
  geocoder: false,
  fullscreenButton: false,
  baseLayerPicker: false
});

// Make the inset window display in 2D, to show it's different.
//twoDView.scene.morphTo2D(0);

var initialPosition = Cesium.Cartesian3.fromDegrees(
  -73.897766864199923,
  40.733945631808005,
  101.24
);
var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(
  21.27879878293835,
  -21.34390550872461,
  0.0716951918898415
);
var camerView = twoDView.scene.camera.setView({
  destination: initialPosition,
  orientation: initialOrientation,
  endTransform: Cesium.Matrix4.IDENTITY
});

var promise = Cesium.GeoJsonDataSource.load(
"sattawat-myBuildings_polygon.geojson", {
  stroke: Cesium.Color.YELLOW.withAlpha(1.5),
  strokeWidth: 33,
  markerSize: 10,
  markerColor: Cesium.Color.YELLOW
}
);
promise.then(function(dataSource) {
  twoDView.dataSources.add(dataSource);
  console.log('aaaaaaaaaaaaaaaa',dataSource)
  dataSources.push(dataSource)
  viewer.dataSources.add(dataSource);



  var entities = dataSource.entities.values;
  array = entities;
  console.log(array);

  for (var i = 0; i < entities.length; i++) {
    var entity = entities[i];
    console.log(entity);
    twoDView.zoomTo(entities[entities.length-1]);
    viewer.zoomTo(entities[entities.length-1]);

    //Extrude the polygon based on any attribute you desire
    entity.polygon.extrudedHeight = 100000.0;
  }
  if (twoDView.dataSources.contains(dataSource)) {
console.log('1111111111111')
    twoDView.dataSources.remove(dataSource);
  }
});
function showPointsCloud() {
  viewer.dataSources.add(
    Cesium.GeoJsonDataSource.load("point_cloud.geojson", {
      stroke: Cesium.Color.BLACK.withAlpha(1.5),
      markerSize: 10,
      markerColor: Cesium.Color.BLACK
    })
  );

}


function correct() {
  //alert("The selected building class saved as correct!");
  console.log(array);
  var alert = document.getElementById("successAlert");
    alert.style.display = "block";
}
function falsee() {
//TODO: try to get the right positon of an selected enitity,
//and see this for moving entitiy: https://groups.google.com/forum/#!topic/cesium-dev/3OM1_FIChS0
// https://cesium.com/blog/2016/03/21/drawing-on-the-globe-and-3d-models/


var dragging;
var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
var aha = [];
handler.setInputAction(function(click) {
    var pickedObject = viewer.scene.pick(click.position);
    var cartesian = scene.pickPosition(click.position);

    console.log('pickedObject',cartesian,viewer.scene.pickPositionSupported && Cesium.defined(cartesian) )

    if (viewer.scene.pickPositionSupported && Cesium.defined(cartesian)) {
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        var longitude = Cesium.Math.toDegrees(cartographic.longitude);
        var latitude = Cesium.Math.toDegrees(cartographic.latitude);
        var altitude = cartographic.height;
        var altitudeString = Math.round(altitude).toString();
        // var redCone = viewer.entities.add({
        //     name : 'Red cone',
        //     position: Cesium.Cartesian3.fromDegrees( longitude, latitude,altitude),
        //     cylinder : {
        //         length : 4.0,
        //         topRadius : 0.0,
        //         bottomRadius : 2.0,
        //         extrudedHeight: 10.0,
        //         material : Cesium.Color.BLACK
        //     }
        // });
        var redCone = viewer.entities.add({
            name : 'Roof transparent',
            position: Cesium.Cartesian3.fromDegrees( longitude, latitude,altitude),
            polygon : {
                hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights([

                  -73.890889084760289, 40.723731841678337, 36.880915 ,  -73.890846244945777, 40.723722567378317, 35.869406 ,  -73.890844332925084, 40.72372337756233, 35.799116 ,  -73.89087309625296, 40.723762667713579, 35.799116 ,  -73.890878394969249, 40.723760422467429, 35.993908 ,  -73.890889084760289, 40.723731841678337, 36.880915   ,    -73.89087309625296, 40.723762667713579, 35.799116 ,  -73.890844332925084, 40.72372337756233, 35.799116 ,  -73.890844332925084, 40.72372337756233, 0.0 ,  -73.89087309625296, 40.723762667713579, 0.0 ,  -73.89087309625296, 40.723762667713579, 35.799116   ,    -73.890844332925084, 40.72372337756233, 35.799116 ,  -73.890846244945777, 40.723722567378317, 35.869406 ,  -73.890901274974127, 40.723699249228211, 35.869406 ,  -73.890902202710507, 40.723698856115483, 35.8353 ,  -73.890902202710507, 40.723698856115483, 0.0 ,  -73.890844332925084, 40.72372337756233, 0.0 ,  -73.890844332925084, 40.72372337756233, 35.799116   ,    -73.890846244945777, 40.723722567378317, 35.869406 ,  -73.890889084760289, 40.723731841678337, 36.880915 ,  -73.890901274974127, 40.723699249228211, 35.869406 ,  -73.890846244945777, 40.723722567378317, 35.869406   ,    -73.890930966062527, 40.723738146252785, 35.8353 ,  -73.890902202710507, 40.723698856115483, 35.8353 ,  -73.890901274974127, 40.723699249228211, 35.869406 ,  -73.890889084760289, 40.723731841678337, 36.880915 ,  -73.89092665163318, 40.723739974428966, 35.993908 ,  -73.890930966062527, 40.723738146252785, 35.8353   ,    -73.890902202710507, 40.723698856115483, 35.8353 ,  -73.890930966062527, 40.723738146252785, 35.8353 ,  -73.890930966062527, 40.723738146252785, 0.0 ,  -73.890902202710507, 40.723698856115483, 0.0 ,  -73.890902202710507, 40.723698856115483, 35.8353   ,    -73.890889084760289, 40.723731841678337, 36.880915 ,  -73.890878394969249, 40.723760422467429, 35.993908 ,  -73.89092665163318, 40.723739974428966, 35.993908 ,  -73.890889084760289, 40.723731841678337, 36.880915   ,    -73.890878394969249, 40.723760422467429, 35.993908 ,  -73.89087309625296, 40.723762667713579, 35.799116 ,  -73.89087309625296, 40.723762667713579, 0.0 ,  -73.890930966062527, 40.723738146252785, 0.0 ,  -73.890930966062527, 40.723738146252785, 35.8353 ,  -73.89092665163318, 40.723739974428966, 35.993908 ,  -73.890878394969249, 40.723760422467429, 35.993908   ,    -73.89087309625296, 40.723762667713579, 0.0 ,  -73.890844332925084, 40.72372337756233, 0.0 ,  -73.890902202710507, 40.723698856115483, 0.0 ,  -73.890930966062527, 40.723738146252785, 0.0 ,  -73.89087309625296, 40.723762667713579, 0.0

                ]),
                extrudedHeight: 50.0,
                material : Cesium.Color.ORANGE.withAlpha(0.5),
                outline : true,
                outlineColor : Cesium.Color.BLACK
            }
        });
      }
    console.log('pickedObject',cartesian,latitude )
    aha.push(latitude)
    if (Cesium.defined(pickedObject.id) && pickedObject.id._id === "d361c147-151b-49eb-bfe3-4a3f0139df2d") {
      console.log('aaaaaaaaaaaaaaaa')
        dragging = pickedObject;
        viewer.scene.screenSpaceCameraController.enableRotate = false;
    }
}, Cesium.ScreenSpaceEventType.LEFT_DOWN);
console.log('ahaaaaaaaaaaa',aha)

// var redCone = viewer.entities.add({
//     name : 'Red cone',
//     position: Cesium.Cartesian3.fromDegrees( -73.897766917624068, 40.733944901952768, 23.474543),
//     cylinder : {
//         length : 4.0,
//         topRadius : 0.0,
//         bottomRadius : 2.0,
//         extrudedHeight: 10.0,
//         material : Cesium.Color.RED
//     }
// });
var orangePolygon = viewer.entities.add({
    name : 'Roof transparent',
    polygon : {
        hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights([

          -73.890889084760289, 40.723731841678337, 36.880915 ,  -73.890846244945777, 40.723722567378317, 35.869406 ,  -73.890844332925084, 40.72372337756233, 35.799116 ,  -73.89087309625296, 40.723762667713579, 35.799116 ,  -73.890878394969249, 40.723760422467429, 35.993908 ,  -73.890889084760289, 40.723731841678337, 36.880915   ,    -73.89087309625296, 40.723762667713579, 35.799116 ,  -73.890844332925084, 40.72372337756233, 35.799116 ,  -73.890844332925084, 40.72372337756233, 0.0 ,  -73.89087309625296, 40.723762667713579, 0.0 ,  -73.89087309625296, 40.723762667713579, 35.799116   ,    -73.890844332925084, 40.72372337756233, 35.799116 ,  -73.890846244945777, 40.723722567378317, 35.869406 ,  -73.890901274974127, 40.723699249228211, 35.869406 ,  -73.890902202710507, 40.723698856115483, 35.8353 ,  -73.890902202710507, 40.723698856115483, 0.0 ,  -73.890844332925084, 40.72372337756233, 0.0 ,  -73.890844332925084, 40.72372337756233, 35.799116   ,    -73.890846244945777, 40.723722567378317, 35.869406 ,  -73.890889084760289, 40.723731841678337, 36.880915 ,  -73.890901274974127, 40.723699249228211, 35.869406 ,  -73.890846244945777, 40.723722567378317, 35.869406   ,    -73.890930966062527, 40.723738146252785, 35.8353 ,  -73.890902202710507, 40.723698856115483, 35.8353 ,  -73.890901274974127, 40.723699249228211, 35.869406 ,  -73.890889084760289, 40.723731841678337, 36.880915 ,  -73.89092665163318, 40.723739974428966, 35.993908 ,  -73.890930966062527, 40.723738146252785, 35.8353   ,    -73.890902202710507, 40.723698856115483, 35.8353 ,  -73.890930966062527, 40.723738146252785, 35.8353 ,  -73.890930966062527, 40.723738146252785, 0.0 ,  -73.890902202710507, 40.723698856115483, 0.0 ,  -73.890902202710507, 40.723698856115483, 35.8353   ,    -73.890889084760289, 40.723731841678337, 36.880915 ,  -73.890878394969249, 40.723760422467429, 35.993908 ,  -73.89092665163318, 40.723739974428966, 35.993908 ,  -73.890889084760289, 40.723731841678337, 36.880915   ,    -73.890878394969249, 40.723760422467429, 35.993908 ,  -73.89087309625296, 40.723762667713579, 35.799116 ,  -73.89087309625296, 40.723762667713579, 0.0 ,  -73.890930966062527, 40.723738146252785, 0.0 ,  -73.890930966062527, 40.723738146252785, 35.8353 ,  -73.89092665163318, 40.723739974428966, 35.993908 ,  -73.890878394969249, 40.723760422467429, 35.993908   ,    -73.89087309625296, 40.723762667713579, 0.0 ,  -73.890844332925084, 40.72372337756233, 0.0 ,  -73.890902202710507, 40.723698856115483, 0.0 ,  -73.890930966062527, 40.723738146252785, 0.0 ,  -73.89087309625296, 40.723762667713579, 0.0

        ]),
        extrudedHeight: 70.0,
        material : Cesium.Color.ORANGE.withAlpha(0.5),
        outline : true,
        outlineColor : Cesium.Color.BLACK
    }
});
handler.setInputAction(function() {
    if (Cesium.defined(dragging)) {
        dragging = undefined;
        viewer.scene.screenSpaceCameraController.enableRotate = true;
    }
}, Cesium.ScreenSpaceEventType.LEFT_UP);

handler.setInputAction(function(movement) {
    var position = viewer.camera.pickEllipsoid(movement.endPosition);
    if (!Cesium.defined(position) || !dragging) {
        return;
    }

    var positionCartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);

    west = Cesium.Math.toDegrees(positionCartographic.longitude);
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

 viewer.zoomTo(orangePolygon);
} //***************************** end of false

var scene = viewer.scene;
viewer.selectedEntityChanged.addEventListener(function(entity) {
    // Check if an entity with a point color was selected.
    console.log('sssssssssss',entity)
    var buttons = document.getElementById("leftToolbar");
    if (entity){
      buttons.style.display = "block";
    } else {
       buttons.style.display = "none";
    }
    if (Cesium.defined(entity) &&
        Cesium.defined(entity.point) &&
        Cesium.defined(entity.point.color)) {

        // Get the current color
        var color = entity.point.color.getValue(viewer.clock.currentTime);

        // Test for blue
        if (Cesium.Color.equals(color, Cesium.Color.STEELBLUE)) {
            // Set to red
            entity.point.color = Cesium.Color.RED;
        }

        // Test for red
        else if (Cesium.Color.equals(color, Cesium.Color.RED)) {
            // Set to red
            entity.point.color = Cesium.Color.STEELBLUE;
        }
    }
});

function next() {
  count += 100;
  console.log(array);
  //TODO (count % 10)
  viewer.zoomTo(array[count]);
  twoDView.zoomTo(array[count]);
}
// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("falseBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}
hideModel = function() {
  modal.style.display = "none";

}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
function ShowInput(checkBox,inputToShow) {
  var checkBox = document.getElementById(checkBox);
  var text = document.getElementById(inputToShow);
  if (checkBox.checked == true){
    text.style.display = "block";
  } else {
     text.style.display = "none";
  }
}
function closealert(element) {
document.getElementById(element).style.display = "none";
}
