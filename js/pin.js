'use strict';

(() => {
  const PIN_SIZE = 65;
  const PIN_PROTRUSION_HEIGHT = 10;

  const pinTemplate = document.querySelector(`#pin`).content;
  const pinMark = pinTemplate.querySelector(`.map__pin`);

  const renderPin = (pin) => {
    const newPin = pinMark.cloneNode(true);
    newPin.style.left = `${pin.location.x - (PIN_SIZE / 2)}px`;
    newPin.style.top = `${pin.location.y - (PIN_SIZE / 2 + PIN_PROTRUSION_HEIGHT)}px`;
    newPin.querySelector(`img`).src = pin.author.avatar;
    newPin.querySelector(`img`).alt = pin.offer.title;
    return newPin;
  };

  window.pin = {
    pinSize: PIN_SIZE,
    // pinProtrusionHeight: PIN_PROTRUSION_HEIGHT,
    renderPin: renderPin
  };
})();
