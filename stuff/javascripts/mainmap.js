  //FileReader that reads GeoJSON to display onto map
  //
  var loadFile = function(event) {
  // Init
  var input = event.target;
  var reader = new FileReader();

  // Read the file
  reader.readAsText(input.files[0]);

  // Invoked when file is loading.
  reader.onload = function(){

      // parse file to JSON object
      var jsonObject = reader.result;
      var json = JSON.parse(jsonObject);
      jsonlayer = L.geoJson(json, {
  onEachFeature: function (feature, layer) {
    layer.bindPopup(feature.properties.name);
  }}).addTo(map);
      console.log(jsonObject);

  };
  };
  	// For image reading
  	//
  	//reader.onload = function(){
  	//var dataURL = reader.result;
  	//var output = document.getElementById('output');
  	//output.src = dataURL;
  	//};
  	//reader.readAsDataURL(input.files[0]);
  	//};

  //Basemap initialization
  var mapboxAttribution = 'Using Mapbox'
  var myurl = 'https://api.mapbox.com/styles/v1/towwell/ciugfz4qs00ix2is1aej7h4mh/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidG93d2VsbCIsImEiOiJjaXVnZndjdnkwMDRsMnRveWR4OGdibmdqIn0.053ocWE7UF4hdJuc1PN9ew';
  var myurl2 = 'https://api.mapbox.com/styles/v1/towwell/ciughc16p002p2jqwv4nxojej/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidG93d2VsbCIsImEiOiJjaXVnZndjdnkwMDRsMnRveWR4OGdibmdqIn0.053ocWE7UF4hdJuc1PN9ew'
  var grayscale = L.tileLayer(myurl, {id: 'mapbox://styles/towwell/ciugfz4qs00ix2is1aej7h4mh', attribution: mapboxAttribution}),
      streets   = L.tileLayer(myurl2, {id: 'mapbox://styles/towwell/ciughc16p002p2jqwv4nxojej', attribution: mapboxAttribution});

  	var map = L.map('map', {
      center: [1.352648, 103.810827],
      zoom: 12,
      layers: [grayscale]
  });
  //Drawn items layer init
  var drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  var drawControl = new L.Control.Draw({
      edit: {
          featureGroup: drawnItems
      }
  });
  map.addControl(drawControl);

  //What happens when custom point created
  map.on('draw:created', function (e) {
      var type = e.layerType,
          layer = e.layer;

      if (type === 'marker') {
  	layer.addTo(drawnItems)
          // Do marker specific actions
      }

      // Do whatever else you need to. (save to db, add to map etc)
      map.addLayer(layer);
  });

  //What happens when custom point edited
  map.on('draw:edited', function (e) {
      var layers = e.layers;
      layers.eachLayer(function (layer) {
          //do whatever you want, most likely save back to db
      });
  });

  //Basemap configs
  var baseMaps = {
      "Grayscale": grayscale,
      "Streets": streets
  };

  //Overlay map configs
  var overlayMaps = {
  	"Drawn Markers": drawnItems
  };
  //First load of layer control
  lcontrol = L.control.layers(baseMaps, overlayMaps).addTo(map);