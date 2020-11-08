'use strict';

(() => {
  const map = window.util.map;
  const pinsList = window.util.pinsList;
  const mapFormContainer = map.querySelector(`.map__filters-container`);
  const mapForm = mapFormContainer.querySelector(`.map__filters`);
  const mapFilterFieldsets = mapForm.querySelectorAll(`fieldset`);
  const cardTemplate = document.querySelector(`#card`).content;
  const pinCard = cardTemplate.querySelector(`.map__card`);
  const mainPin = map.querySelector(`.map__pin--main`);
  const pinsListContent = pinsList.children;

  const fillInPinsList = (arr) => {
    pinsList.appendChild(window.util.createFragment(arr, window.pin.renderPin));
  };

  const disableMapForm = () => {
    for (let i = 0; i < mapFilterFieldsets.length; i++) {
      mapFilterFieldsets[i].setAttribute(`disabled`, ``);
    }
  };

  const resetPinsList = () => {
    for (let i = pinsListContent.length - 1; i > 1; i--) {
      pinsListContent[i].remove();
    }
  };

  const resetMainPin = () => {
    mainPin.style = `left: 570px; top: 375px;`;
    mainPin.removeEventListener(`mousedown`, window.move.onMainPinMove);
  };

  const initializeMap = () => {
    mapForm.reset();
    disableMapForm();
    pinCard.remove();
    map.classList.add(`map--faded`);
    map.removeEventListener(`click`, onMapShowPinCard());
    resetPinsList();
    resetMainPin();
  };

  const turnOnMapForm = () => {
    for (let i = 0; i < mapFilterFieldsets.length; i++) {
      mapFilterFieldsets[i].removeAttribute(`disabled`);
    }
  };

  const activateMapForm = (arr) => {
    fillInPinsList(arr);
    map.classList.remove(`map--faded`);
    turnOnMapForm();
    map.addEventListener(`click`, onMapShowPinCard(arr));
    mainPin.addEventListener(`mousedown`, window.move.onMainPinMove);
    window.form.setAdAddress(true);
  };

  const errorHandler = function (errorMessage) {
    const node = document.createElement(`div`);
    node.style = `z-index: 100; margin: 0 auto; text-align: center; background-color: red;`;
    node.style.position = `absolute`;
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = `30px`;

    node.textContent = errorMessage;
    document.body.insertAdjacentElement(`afterbegin`, node);
  };

  mainPin.addEventListener(`mousedown`, (evt) => {
    evt.preventDefault();
    if (evt.button === 0) {
      window.load.getData(window.main.activateMainPage, errorHandler);
    }
  });

  mainPin.addEventListener(`keydown`, (evt) => {
    evt.preventDefault();
    if (evt.key === `Enter`) {
      window.load.getData(window.main.activateMainPage, errorHandler);
    }
  });

  const onMapShowPinCard = (arr) => {
    return (evt) => {
      evt.preventDefault();
      const mark = evt.target.closest(`.map__pin`);
      if (mark && !mark.classList.contains(`map__pin--main`)) {
        const closePinCard = pinCard.querySelector(`.popup__close`);
        const removePinCard = () => {
          pinCard.remove();
          closePinCard.removeEventListener(`click`, onClosePinCardClick);
          document.removeEventListener(`keydown`, onClosePinCardEscPress);
        };

        const onClosePinCardClick = () => {
          evt.preventDefault();
          removePinCard();
        };

        const onClosePinCardEscPress = (e) => {
          if (e.key === `Escape`) {
            evt.preventDefault();
            removePinCard();
          }
        };

        closePinCard.addEventListener(`click`, onClosePinCardClick);
        document.addEventListener(`keydown`, onClosePinCardEscPress);

        const markAvatarAlt = mark.querySelector(`img`).alt;
        window.card.renderPinCard(arr.find((pin) => pin.offer.title === markAvatarAlt), pinCard);
        map.insertBefore(pinCard, mapFormContainer);
      }
    };
  };

  window.map = {
    mainPin,
    pinsList,
    initializeMap,
    activateMapForm,
    fillInPinsList
  };
})();
