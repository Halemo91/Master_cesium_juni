// this file loads the geojson files that are created after creating kml from geoserver
var array = [];
var count = 0 ;
var dataSources = [];
// Get the modal
var modal = document.getElementById('myModal');
var qa = document.getElementById('QA_buttons');
var back = document.getElementById('backtoqa');
var locationMessage = document.getElementById('locationMessage');
var drawMessage = document.getElementById('drawMessage');

var btn = document.getElementById("falseBtn");
var span = document.getElementsByClassName("close")[0];


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
  dataSources.push(dataSource)
  viewer.dataSources.add(dataSource);



  var entities = dataSource.entities.values;
  array = entities;
  console.log(array);

  for (var i = 0; i < entities.length; i++) {
    var entity = entities[i];
    twoDView.zoomTo(entities[entities.length-1]);
    viewer.zoomTo(entities[entities.length-1]);

    //Extrude the polygon based on any attribute you desire
    entity.polygon.extrudedHeight = 100000.0;
  }
  if (twoDView.dataSources.contains(dataSource)) {
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
  var alert = document.getElementById("successAlert");
    alert.style.display = "block";
}
function draw(drawElement) {
//TODO: try to get the right positon of an selected enitity,
//and see this for moving entitiy: https://groups.google.com/forum/#!topic/cesium-dev/3OM1_FIChS0
// https://cesium.com/blog/2016/03/21/drawing-on-the-globe-and-3d-models/
drawMessage.style.display = "block";
if(drawElement){


viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
function createPoint(worldPosition) {
    var point = viewer.entities.add({
        position : worldPosition,
        point : {
            color : Cesium.Color.WHITE,
            pixelSize : 5,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
    });
    return point;
}
var drawingMode = 'line';
function drawShape(positionData) {
    var shape;

        shape = viewer.entities.add({
            polygon: {
                hierarchy: positionData,
                material: new Cesium.ColorMaterialProperty(Cesium.Color.WHITE.withAlpha(0.7))
            }
        });

    return shape;
}
var activeShapePoints = [];
var activeShape;
var floatingPoint;
var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
handler.setInputAction(function(event) {
    if (!Cesium.Entity.supportsPolylinesOnTerrain(viewer.scene)) {
        console.log('This browser does not support polylines on terrain.');
        return;
    }
    // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
    // we get the correct point when mousing over terrain.
    var earthPosition = viewer.scene.pickPosition(event.position);
    // `earthPosition` will be undefined if our mouse is not over the globe.
    if (Cesium.defined(earthPosition)) {
        if (activeShapePoints.length === 0) {
            floatingPoint = createPoint(earthPosition);
            activeShapePoints.push(earthPosition);
            var dynamicPositions = new Cesium.CallbackProperty(function () {
                return activeShapePoints;
            }, false);
            activeShape = drawShape(dynamicPositions);
        }
        activeShapePoints.push(earthPosition);
        createPoint(earthPosition);
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

handler.setInputAction(function(event) {
    if (Cesium.defined(floatingPoint)) {
        var newPosition = viewer.scene.pickPosition(event.endPosition);
        if (Cesium.defined(newPosition)) {
            floatingPoint.position.setValue(newPosition);
            activeShapePoints.pop();
            activeShapePoints.push(newPosition);
        }
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
// Redraw the shape so it's not dynamic and remove the dynamic shape.
function terminateShape() {
    activeShapePoints.pop();
    drawShape(activeShapePoints);
    viewer.entities.remove(floatingPoint);
    viewer.entities.remove(activeShape);
    floatingPoint = undefined;
    activeShape = undefined;
    activeShapePoints = [];
}
handler.setInputAction(function(event) {
    terminateShape();
}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
drawElement = false;

}

} //****

var scene = viewer.scene;
viewer.selectedEntityChanged.addEventListener(function(entity) {
    // Check if an entity with a point color was selected.
    console.log('selected',entity)
    var buttons = document.getElementById("leftToolbar");
    if (entity){
      buttons.style.display = "block";
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
  viewer.zoomTo(array[count]);
  twoDView.zoomTo(array[count]);
}

// When the user clicks the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}
hideModel = function(hideQA) {
  modal.style.display = "none";
  if (hideQA){
     qa.style.display = "none";
     back.style.display = "block";
  }
}
showqa = function() {
     qa.style.display = "block";
     back.style.display = "none";
     locationMessage.style.display = "none";
     drawMessage.style.display = "none";
     modal.style.display = "block";


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
function getLoc(element) {
  locationMessage.style.display = "block";

viewer.canvas.addEventListener('click', function(e){
  console.log('aaaaaaaaaaaaaa',element)
    if(element){
    var mousePosition = new Cesium.Cartesian2(e.clientX, e.clientY);

    var ellipsoid = viewer.scene.globe.ellipsoid;
    var cartesian = viewer.camera.pickEllipsoid(mousePosition, ellipsoid);
    if (cartesian) {
        var cartographic = ellipsoid.cartesianToCartographic(cartesian);
        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5);
        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5);
          document.getElementById("long").value = longitudeString;
            document.getElementById("lat").value =latitudeString;
        showqa();
    } else {
        alert('Globe was not picked');
    }
element = false;

}
}, false);

}
function clearForm(){
    document.getElementById("height").checked = false;
    document.getElementById("location").checked = false;
    document.getElementById("class").checked = false;
    document.getElementById("long").value = "";
    document.getElementById("lat").value ="";
    document.getElementById("textother").value ="";

}
