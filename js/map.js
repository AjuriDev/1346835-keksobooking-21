'use strict';

(() => {
  const map = window.data.map;
  const pinsList = window.data.pinsList;
  const pinsFilter = map.querySelector(`.map__filters-container`);
  const mapFilterFieldsets = pinsFilter.querySelectorAll(`fieldset`);
  const cardTemplate = document.querySelector(`#card`).content;
  const pinCard = cardTemplate.querySelector(`.map__card`);
  const mainPin = map.querySelector(`.map__pin--main`);

  const pinsFragment = window.util.createFragment(window.data.generatedPins, window.pin.renderPin);

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

  const activateMapForm = () => {
    pinsList.appendChild(pinsFragment);
    map.classList.remove(`map--faded`);
    turnOnMapForm();
  };

  mainPin.addEventListener(`mousedown`, function (evt) {
    evt.preventDefault();
    if (evt.button === 0) {
      window.map.activateMapForm();
      window.form.activateAdForm();
    }
  });

  mainPin.addEventListener(`keydown`, function (evt) {
    evt.preventDefault();
    if (evt.key === `Enter`) {
      window.map.activateMapForm();
      window.form.activateAdForm();
    }
  });

  const showPinCard = () => {
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
        window.card.renderPinCard(window.data.generatedPins.find((pin) => pin.offer.title === markAvatarAlt), pinCard);
        map.insertBefore(pinCard, pinsFilter);
      }
    });
  };

  window.map = {
    mainPin,
    disableMapForm,
    activateMapForm,
    showPinCard
  };
})();
