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
  const successMessage = document.querySelector(`#success`).content.querySelector(`.success`);
  const errorMessage = document.querySelector(`#error`).content.querySelector(`.error`);
  const btnResetForm = adForm.querySelector(`.ad-form__reset`);

  const onBtnResetFormResetPage = (evt) => {
    evt.preventDefault();
    window.main.initializeMainPage();
    btnResetForm.removeEventListener(`click`, onBtnResetFormResetPage);
  };

  const disableAdFormFieldsets = () => {
    for (let i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].setAttribute(`disabled`, ``);
    }
  };

  const blockEditadAddress = () => {
    adAddressInput.setAttribute(`readonly`, ``);
  };

  const setAdAddress = (active = true) => {
    if (active) {
      adAddressInput.value = `${Math.round(Number.parseInt(mainPin.style.left.slice(0, -2), 10) + window.pin.PIN_SIZE / 2)}, ${Math.round(Number.parseInt(mainPin.style.top.slice(0, -2), 10) + window.pin.PIN_SIZE + window.pin.PIN_PROTRUSION_HEIGHT)}`;
    } else {
      adAddressInput.value = `${Math.round(Number.parseInt(mainPin.style.left.slice(0, -2), 10) + window.pin.PIN_SIZE / 2)}, ${Math.round(Number.parseInt(mainPin.style.top.slice(0, -2), 10) + window.pin.PIN_SIZE / 2)}`;
    }
  };

  const initializeAdForm = () => {
    adForm.reset();
    adForm.classList.add(`ad-form--disabled`);
    disableAdFormFieldsets();
    blockEditadAddress();
    setAdAddress(false);
  };

  const turnOnAdFormFieldsets = () => {
    for (let i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].removeAttribute(`disabled`);
    }
  };

  const setInputsValues = () => {
    adTimeOutInput.value = adTimeInInput.value;
    adPriceInput.min = window.card.HousingTypesRu[adTypeInput.value.toUpperCase()].MIN_PRICE;
    adPriceInput.placeholder = window.card.HousingTypesRu[adTypeInput.value.toUpperCase()].MIN_PRICE;
    adGuestsInput.value = adRoomsInput.value < MAX_ROOMS_FOR_GUESTS ? adRoomsInput.value : 0;
  };

  const onAdPriceInputChangeValue = () => {
    const habitationType = adTypeInput.value;
    const adPrice = adPriceInput.value;

    if (adPrice < window.card.HousingTypesRu[habitationType.toUpperCase()].MIN_PRICE) {
      adPriceInput.setCustomValidity(`Минимальная цена за ночь ${window.card.HousingTypesRu[habitationType.toUpperCase()].MIN_PRICE}р`);
    } else {
      adPriceInput.setCustomValidity(``);
    }

    adPriceInput.reportValidity();
  };

  const onAdTypeInputChangeValue = () => {
    const habitationType = adTypeInput.value;

    adPriceInput.min = window.card.HousingTypesRu[habitationType.toUpperCase()].MIN_PRICE;
    adPriceInput.placeholder = window.card.HousingTypesRu[habitationType.toUpperCase()].MIN_PRICE;
  };

  const synchronizeTimeInputs = (firstInput, secondInput) => {
    firstInput.addEventListener(`change`, () => {
      secondInput.selectedIndex = firstInput.selectedIndex;
    });

    secondInput.addEventListener(`change`, () => {
      firstInput.selectedIndex = secondInput.selectedIndex;
    });
  };

  const synchronizeGuestsToRooms = (guestInput, roomInput) => {

    const onGuestInputChangeValue = () => {
      const room = Number.parseInt(roomInput.value, 10);
      const guest = Number.parseInt(guestInput.value, 10);
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
      const room = Number.parseInt(roomInput.value, 10);
      const guest = Number.parseInt(guestInput.value, 10);
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
          if (option.value > room || Number.parseInt(option.value, 10) === 0) {
            option.setAttribute(`disabled`, `disabled`);
          }
        });
      } else {
        guestInputOptions.forEach((option) => {
          if (Number.parseInt(option.value, 10) !== 0) {
            option.setAttribute(`disabled`, `disabled`);
          }
        });
      }
    };

    guestInput.addEventListener(`change`, onGuestInputChangeValue);
    roomInput.addEventListener(`change`, onRoomsInputChangeValue);
  };

  const removeMessage = (message, onMessageClick, onMessageEscClose) => {
    message.remove();
    document.removeEventListener(`click`, onMessageClick);
    document.removeEventListener(`keydown`, onMessageEscClose);
  };

  const onSuccessMessageClick = (evt) => {
    evt.preventDefault();
    removeMessage(successMessage, onSuccessMessageClick, onSuccessMessageEscClose);
  };

  const onSuccessMessageEscClose = () => {
    window.util.isEscEvent(removeMessage(successMessage, onSuccessMessageClick, onSuccessMessageEscClose));
  };

  const onErrorMessageClick = (evt) => {
    evt.preventDefault();
    removeMessage(errorMessage, onErrorMessageClick, onErrorMessageEscClose);
  };

  const onErrorMessageEscClose = () => {
    window.util.isEscEvent(removeMessage(errorMessage, onErrorMessageClick, onErrorMessageEscClose));
  };

  const showSuccessMessage = () => {
    document.querySelector(`main`).insertAdjacentElement(`afterbegin`, successMessage);
    document.addEventListener(`click`, onSuccessMessageClick);
    document.addEventListener(`keydown`, onSuccessMessageEscClose);
  };

  const showErrorMessage = () => {
    document.querySelector(`main`).insertAdjacentElement(`afterbegin`, errorMessage);
    document.addEventListener(`click`, onErrorMessageClick);
    document.addEventListener(`keydown`, onErrorMessageEscClose);
  };

  const successHandler = () => {
    window.main.initializeMainPage();
    showSuccessMessage();
  };

  const errorHandler = () => {
    showErrorMessage();
  };

  const onAdFormSubmit = (evt) => {
    evt.preventDefault();
    const form = evt.target.closest(`.ad-form`);
    window.load.sendFormData(new FormData(form), successHandler, errorHandler);
  };

  const activateAdForm = () => {
    setInputsValues();
    adForm.classList.remove(`ad-form--disabled`);
    adForm.addEventListener(`submit`, onAdFormSubmit);
    turnOnAdFormFieldsets();
    synchronizeTimeInputs(adTimeInInput, adTimeOutInput);
    synchronizeGuestsToRooms(adGuestsInput, adRoomsInput);
    adPriceInput.addEventListener(`input`, onAdPriceInputChangeValue);
    adTypeInput.addEventListener(`input`, onAdTypeInputChangeValue);
    btnResetForm.addEventListener(`click`, onBtnResetFormResetPage);
  };

  window.form = {
    initializeAdForm,
    activateAdForm,
    setAdAddress
  };
})();
