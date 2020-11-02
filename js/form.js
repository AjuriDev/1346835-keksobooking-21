'use strict';

(() => {
  const MAX_ROOMS_FOR_GUESTS = 99;

  const adForm = document.querySelector(`.ad-form`);
  const adFormFieldsets = adForm.querySelectorAll(`fieldset`);
  const adAddressInput = adForm.querySelector(`#address`);
  const adTypeInput = adForm.querySelector(`#type`);
  const adPriceInput = adForm.querySelector(`#price`);
  const adTimeInInput = adForm.querySelector(`#timein`);
  const adTimeOutInput = adForm.querySelector(`#timeout`);
  const adRoomsInput = adForm.querySelector(`#room_number`);
  const adGuestsInput = adForm.querySelector(`#capacity`);
  const mainPin = window.map.mainPin;

  const mainPinAddress = {
    x: Math.round(Number(mainPin.style.left.slice(0, -2)) + window.pin.pinSize / 2), // метод slice вызван чтобы удалить "px" из конца строки
    y: Math.round(Number(mainPin.style.top.slice(0, -2)) + window.pin.pinSize / 2)
  };

  const disableAdFormFieldsets = () => {
    for (let i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].setAttribute(`disabled`, ``);
    }
  };

  const blockEditadAddress = () => {
    adAddressInput.setAttribute(`readonly`, ``);
  };

  const setAdAddress = (obj) => {
    adAddressInput.value = `${obj.x}, ${obj.y}`;
  };

  const initializeAdForm = () => {
    disableAdFormFieldsets();
    blockEditadAddress();
    setAdAddress(mainPinAddress);
  };

  const turnOnAdFormFieldsets = () => {
    for (let i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].removeAttribute(`disabled`);
    }
  };

  const setInputsValues = () => {
    adTimeOutInput.value = adTimeInInput.value;
    adPriceInput.min = window.card.habitationTypesRu[adTypeInput.value].minPrice;
    adPriceInput.placeholder = window.card.habitationTypesRu[adTypeInput.value].minPrice;
    adGuestsInput.value = adRoomsInput.value < MAX_ROOMS_FOR_GUESTS ? adRoomsInput.value : 0;
  };

  const onAdPriceInputChangeValue = () => {
    const habitationType = adTypeInput.value;
    const adPrice = adPriceInput.value;

    if (adPrice < window.card.habitationTypesRu[habitationType].minPrice) {
      adPriceInput.setCustomValidity(`Минимальная цена за ночь ${window.card.habitationTypesRu[habitationType].minPrice}р`);
    } else {
      adPriceInput.setCustomValidity(``);
    }

    adPriceInput.reportValidity();
  };

  const onAdTypeInputChangeValue = () => {
    const habitationType = adTypeInput.value;

    adPriceInput.min = window.card.habitationTypesRu[habitationType].minPrice;
    adPriceInput.placeholder = window.card.habitationTypesRu[habitationType].minPrice;
  };

  const synchronizeTimeInputs = function (firstInput, secondInput) {
    firstInput.addEventListener(`change`, function () {
      secondInput.selectedIndex = firstInput.selectedIndex;
    });

    secondInput.addEventListener(`change`, function () {
      firstInput.selectedIndex = secondInput.selectedIndex;
    });
  };

  const synchronizeGuestsToRooms = function (guestInput, roomInput) {

    const onGuestInputChangeValue = () => {
      const room = Number(roomInput.value);
      const guest = Number(guestInput.value);
      if (room > MAX_ROOMS_FOR_GUESTS && guest !== 0) {
        guestInput.setCustomValidity(`Выбранное помещение не для гостей`);
      } else if (room <= MAX_ROOMS_FOR_GUESTS && guest === 0) {
        guestInput.setCustomValidity(`Выбранное помещение предусмотрено для гостей`);
      } else if (room < guest) {
        guestInput.setCustomValidity(`Максимальное число гостей ${room}`);
      } else {
        guestInput.setCustomValidity(``);
      }

      guestInput.reportValidity();
    };

    const onRoomsInputChangeValue = () => {
      const room = Number(roomInput.value);
      const guest = Number(guestInput.value);
      const guestInputOptions = guestInput.querySelectorAll(`option`);

      if (room < guest && room <= MAX_ROOMS_FOR_GUESTS) {
        guestInput.setCustomValidity(`Максимальное число гостей ${room}`);
      } else if (room <= MAX_ROOMS_FOR_GUESTS && guest === 0) {
        guestInput.setCustomValidity(`Выбранное помещение предусмотрено для гостей`);
      } else if (room > MAX_ROOMS_FOR_GUESTS && guest !== 0) {
        guestInput.setCustomValidity(`Выбранное помещение не для гостей`);
      } else {
        guestInput.setCustomValidity(``);
      }

      guestInputOptions.forEach((option) => {
        option.removeAttribute(`disabled`);
      });

      if (room <= MAX_ROOMS_FOR_GUESTS) {
        guestInputOptions.forEach((option) => {
          if (option.value > room || Number(option.value) === 0) {
            option.setAttribute(`disabled`, `disabled`);
          }
        });
      } else {
        guestInputOptions.forEach((option) => {
          if (Number(option.value) !== 0) {
            option.setAttribute(`disabled`, `disabled`);
          }
        });
      }
    };

    guestInput.addEventListener(`change`, onGuestInputChangeValue);
    roomInput.addEventListener(`change`, onRoomsInputChangeValue);
  };

  const activateAdForm = () => {
    setInputsValues();
    adForm.classList.remove(`ad-form--disabled`);
    turnOnAdFormFieldsets();
    synchronizeTimeInputs(adTimeInInput, adTimeOutInput);
    synchronizeGuestsToRooms(adGuestsInput, adRoomsInput);
    adPriceInput.addEventListener(`input`, onAdPriceInputChangeValue);
    adTypeInput.addEventListener(`input`, onAdTypeInputChangeValue);
  };

  window.form = {
    initializeAdForm: initializeAdForm,
    activateAdForm: activateAdForm
  };
})();
