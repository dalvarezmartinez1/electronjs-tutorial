const {ipcRenderer} = require('electron');

const nextCityContainer = document.querySelector('.nextCityContainer');
const nextCitySpan = document.querySelector('.nextCity');

ipcRenderer.on('showMap:lastVisitedCity', (event, item) => {
  if (nextCityContainer.hasAttribute('hidden')) {
    nextCityContainer.removeAttribute('hidden');
  }
  nextCitySpan.textContent = item;
});
