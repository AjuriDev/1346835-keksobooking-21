'use strict';
(function () {

  const onMainPinMove = (evt) => {

    const mainPin = window.map.mainPin;

    evt.preventDefault();

    const startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    const onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      const shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords.x = moveEvt.clientX;
      startCoords.y = moveEvt.clientY;

      if (mainPin.offsetTop + window.pin.pinSize + window.pin.pinProtrusionHeight < window.data.positionYMin) {
        mainPin.style.top = `${window.data.positionYMin - window.pin.pinSize - window.pin.pinProtrusionHeight}px`;
      } else if (mainPin.offsetTop + window.pin.pinSize + window.pin.pinProtrusionHeight > window.data.positionYMax) {
        mainPin.style.top = `${window.data.positionYMax - window.pin.pinSize - window.pin.pinProtrusionHeight}px`;
      } else {
        mainPin.style.top = `${mainPin.offsetTop - shift.y}px`;
      }

      if (mainPin.offsetLeft + Math.ceil(window.pin.pinSize / 2) < 0) {
        mainPin.style.left = `${0 - Math.ceil(window.pin.pinSize / 2)}px`;
      } else if (mainPin.offsetLeft + Math.ceil(window.pin.pinSize / 2) > window.data.pinsListWidth) {
        mainPin.style.left = `${window.data.pinsListWidth - Math.ceil(window.pin.pinSize / 2)}px`;
      } else {
        mainPin.style.left = `${mainPin.offsetLeft - shift.x}px`;
      }

      window.form.setAdAddress();

    };

    const onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener(`mousemove`, onMouseMove);
      document.removeEventListener(`mouseup`, onMouseUp);

      window.form.setAdAddress();
    };

    document.addEventListener(`mousemove`, onMouseMove);
    document.addEventListener(`mouseup`, onMouseUp);
  };

  window.move = {
    onMainPinMove
  };
})();
