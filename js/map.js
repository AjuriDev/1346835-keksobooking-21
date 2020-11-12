'use strict';

(() => {
  const PINS_NUMBER = 5;
  const map = window.util.map;
  const pinsList = window.util.pinsList;
  const mapFormContainer = window.card.mapFormContainer;
  const mapForm = mapFormContainer.querySelector(`.map__filters`);
  const mapFilterFieldsets = mapForm.querySelectorAll(`fieldset`);
  const pinCard = window.card.pinCard;
  const mainPin = map.querySelector(`.map__pin--main`);
  const pinsListContent = pinsList.children;

  const fillInPinsList = (arr) => {
    pinsList.appendChild(window.util.createFragment(arr, PINS_NUMBER, window.pin.renderPin));
  };

  const disableMapForm = () => {
    for (let i = 0; i < mapFilterFieldsets.length; i++) {
      mapFilterFieldsets[i].setAttribute(`disabled`, ``);
    }
    window.filter.deactivateFilter();
  };

  const turnOnMapForm = () => {
    for (let i = 0; i < mapFilterFieldsets.length; i++) {
      mapFilterFieldsets[i].removeAttribute(`disabled`);
    }
    window.filter.activateFilter();
  };

  const resetPinsList = () => {
    for (let i = pinsListContent.length - 1; i > 1; i--) {
      pinsListContent[i].remove();
    }
  };

  const onMainPinClick = (evt) => {
    evt.preventDefault();
    if (evt.button === 0) {
      window.load.getData(window.main.activateMainPage, errorHandler);
      mainPin.removeEventListener(`mousedown`, onMainPinClick);
    }
  };

  const resetMainPin = () => {
    mainPin.style = `left: 570px; top: 375px;`;
    mainPin.removeEventListener(`mousedown`, window.move.onMainPinMove);
    mainPin.addEventListener(`mousedown`, onMainPinClick);
  };

  const initializeMap = () => {
    mapForm.reset();
    disableMapForm();
    pinCard.remove();
    map.classList.add(`map--faded`);
    resetPinsList();
    resetMainPin();
  };

  const activateMap = (arr) => {
    window.filter.fillAds(arr);
    fillInPinsList(arr);
    map.classList.remove(`map--faded`);
    turnOnMapForm();
    map.addEventListener(`click`, window.card.onMapShowPinCard(arr));
    mainPin.addEventListener(`mousedown`, window.move.onMainPinMove);
    window.form.setAdAddress(true);
  };

  const errorHandler = (errorMessage) => {
    const node = document.createElement(`div`);
    node.style = `z-index: 100; margin: 0 auto; text-align: center; background-color: red;`;
    node.style.position = `absolute`;
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = `30px`;

    node.textContent = errorMessage;
    document.body.insertAdjacentElement(`afterbegin`, node);
  };

  mainPin.addEventListener(`mousedown`, onMainPinClick);

  mainPin.addEventListener(`keydown`, (evt) => {
    evt.preventDefault();
    if (evt.key === `Enter`) {
      window.load.getData(window.main.activateMainPage, errorHandler);
    }
  });

  window.map = {
    PINS_NUMBER,
    mainPin,
    pinsList,
    mapForm,
    initializeMap,
    activateMap,
    fillInPinsList,
    resetPinsList
  };
})();
