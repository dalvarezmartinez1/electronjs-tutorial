// inspired by: https://openlayers.org/en/latest/examples/animation.html

const {ipcRenderer} = require('electron');

const london = ol.proj.fromLonLat([-0.12755, 51.507222]);
const moscow = ol.proj.fromLonLat([37.6178, 55.7517]);
const istanbul = ol.proj.fromLonLat([28.9744, 41.0128]);
const rome = ol.proj.fromLonLat([12.5, 41.9]);
const bern = ol.proj.fromLonLat([7.4458, 46.95]);

const view = new ol.View({
  center: ol.proj.fromLonLat([37.41, 8.82]),
  zoom: 4
});

const map = new ol.Map({
  target: document.querySelector('.map'),
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  loadTilesWhileAnimating: true,
  view: view
});

function flyTo(location, done) {
  var duration = 2000;
  var zoom = view.getZoom();
  var parts = 2;
  var called = false;

  function callback(complete) {
    --parts;
    if (called) {
      return;
    }
    if (parts === 0 || !complete) {
      called = true;
      done(complete);
    }
  }

  view.animate({
    center: location,
    duration: duration
  }, callback);
  view.animate({
    zoom: zoom - 1,
    duration: duration / 2
  }, {
    zoom: zoom,
    duration: duration / 2
  }, callback);
}

function tour() {
  var locations = [{name: 'London', position: london}, {name: 'Bern', position: bern}, {name: 'Rome', position: rome},
    {name: 'Moscow', position: moscow}, {name: 'Istanbul', position: istanbul}];
  var index = -1;

  function next(more) {
    if (more) {
      ++index;
      if (index < locations.length) {
        var delay = index === 0 ? 0 : 1000;
        setTimeout(function () {
          notifyCity(locations[index].name);
          flyTo(locations[index].position, next);
        }, delay);
      } else {
        alert('Tour complete');
      }
    } else {
      alert('Tour cancelled');
    }
  }

  next(true);
}

function notifyCity(cityName) {
  ipcRenderer.send('showMap:lastVisitedCity', cityName);
}

document.querySelector('.tour').addEventListener('click', tour);
