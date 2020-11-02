'use strict';

(() => {
  const initializeMainPage = () => {
    window.map.disableMapForm();
    window.form.initializeAdForm();
  };

  initializeMainPage();

  window.map.showPinCard();
})();
