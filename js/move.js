'use strict';
(() => {

  const POSITION_Y_MAX = 630;
  const POSITION_Y_MIN = 130;

  const pinsListWidth = window.util.pinsList.scrollWidth;

  const onMainPinMove = (evt) => {

    const mainPin = window.map.mainPin;

    evt.preventDefault();

    const startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    const onMouseMove = (moveEvt) => {
      moveEvt.preventDefault();

      const shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords.x = moveEvt.clientX;
      startCoords.y = moveEvt.clientY;

      if (mainPin.offsetTop + window.pin.PIN_SIZE + window.pin.PIN_PROTRUSION_HEIGHT < POSITION_Y_MIN) {
        mainPin.style.top = `${POSITION_Y_MIN - window.pin.PIN_SIZE - window.pin.PIN_PROTRUSION_HEIGHT}px`;
      } else if (mainPin.offsetTop + window.pin.PIN_SIZE + window.pin.PIN_PROTRUSION_HEIGHT > POSITION_Y_MAX) {
        mainPin.style.top = `${POSITION_Y_MAX - window.pin.PIN_SIZE - window.pin.PIN_PROTRUSION_HEIGHT}px`;
      } else {
        mainPin.style.top = `${mainPin.offsetTop - shift.y}px`;
      }

      if (mainPin.offsetLeft + Math.ceil(window.pin.PIN_SIZE / 2) < 0) {
        mainPin.style.left = `${0 - Math.ceil(window.pin.PIN_SIZE / 2)}px`;
      } else if (mainPin.offsetLeft + Math.ceil(window.pin.PIN_SIZE / 2) > pinsListWidth) {
        mainPin.style.left = `${pinsListWidth - Math.ceil(window.pin.PIN_SIZE / 2)}px`;
      } else {
        mainPin.style.left = `${mainPin.offsetLeft - shift.x}px`;
      }

      window.form.setAdAddress(true);

    };

    const onMouseUp = (upEvt) => {
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
