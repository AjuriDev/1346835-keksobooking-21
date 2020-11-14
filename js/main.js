'use strict';

const initializeMainPage = () => {
  window.map.initializeMap();
  window.form.initializeAdForm();
};

const activateMainPage = (arr) => {
  window.map.activateMap(arr);
  window.form.activateAdForm();
};

initializeMainPage();

window.main = {
  initializeMainPage,
  activateMainPage
};
