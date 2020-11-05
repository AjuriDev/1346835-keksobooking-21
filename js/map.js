'use strict';

(() => {
  const map = window.util.map;
  const pinsList = window.util.pinsList;
  const pinsFilter = map.querySelector(`.map__filters-container`);
  const mapFilterFieldsets = pinsFilter.querySelectorAll(`fieldset`);
  const cardTemplate = document.querySelector(`#card`).content;
  const pinCard = cardTemplate.querySelector(`.map__card`);
  const mainPin = map.querySelector(`.map__pin--main`);

  const fillInPinsList = (arr) => {
    pinsList.appendChild(window.util.createFragment(arr, window.pin.renderPin));
  };

  const disableMapForm = () => {
    for (let i = 0; i < mapFilterFieldsets.length; i++) {
      mapFilterFieldsets[i].setAttribute(`disabled`, ``);
    }
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
    showPinCard(arr);
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

  mainPin.addEventListener(`mousedown`, function (evt) {
    evt.preventDefault();
    if (evt.button === 0) {
      window.download.downloadAdsInfo(window.main.activateMainPage, errorHandler);
    }
  });

  mainPin.addEventListener(`keydown`, function (evt) {
    evt.preventDefault();
    if (evt.key === `Enter`) {
      window.download.downloadAdsInfo(window.main.activateMainPage, errorHandler);
    }
  });

  const showPinCard = (arr) => {
    map.addEventListener(`click`, (evt) => {
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
        map.insertBefore(pinCard, pinsFilter);
      }
    });
  };

  window.map = {
    mainPin,
    pinsList,
    disableMapForm,
    activateMapForm,
    showPinCard,
    fillInPinsList
  };
})();
