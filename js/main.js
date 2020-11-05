'use strict';

(() => {
  const initializeMainPage = () => {
    window.map.disableMapForm();
    window.form.initializeAdForm();
  };

  const activateMainPage = (arr) => {
    window.map.activateMapForm(arr);
    window.form.activateAdForm();
  };

  initializeMainPage();

  window.main = {
    activateMainPage
  };
})();
