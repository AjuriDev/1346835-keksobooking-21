'use strict';
const MAX_ROOMS_FOR_GUESTS = 99;
const PINS_NUMBER = 8;
const MAX_ROOMS = 10;
const GUESTS_PER_ROOM = 3;
const HABITATION_TYPES = [`palace`, `flat`, `house`, `bungalow`];
const CHECK_TIMES = [`12:00`, `13:00`, `14:00`];
const FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const PHOTOS = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
const PIN_SIZE = 65;
const PIN_PROTRUSION_HEIGHT = 10;
const POSITION_Y_MAX = 630;
const POSITION_Y_MIN = 130;
const MAX_PRICE = 200000;
const MIN_PRICE = 10000;
const HABITATION_TYPES_RU = {
  palace: {
    name: `Дворец`,
    minPrice: 10000
  },
  flat: {
    name: `Квартира`,
    minPrice: 1000
  },
  house: {
    name: `Дом`,
    minPrice: 5000
  },
  bungalow: {
    name: `Бунгало`,
    minPrice: 0
  }
};

const map = document.querySelector(`.map`);
const pinsList = map.querySelector(`.map__pins`);
const pinsFilter = map.querySelector(`.map__filters-container`);
const pinsListWidth = pinsList.scrollWidth;
const pinTemplate = document.querySelector(`#pin`).content;
const pinMark = pinTemplate.querySelector(`.map__pin`);
const cardTemplate = document.querySelector(`#card`).content;
const pinCard = cardTemplate.querySelector(`.map__card`);
const adForm = document.querySelector(`.ad-form`);
const adFormFieldsets = adForm.querySelectorAll(`fieldset`);
const mapFilterFieldsets = pinsFilter.querySelectorAll(`fieldset`);
const mainPin = map.querySelector(`.map__pin--main`);
const adAddressInput = adForm.querySelector(`#address`);
const adTypeInput = adForm.querySelector(`#type`);
const adPriceInput = adForm.querySelector(`#price`);
const adTimeInInput = adForm.querySelector(`#timein`);
const adTimeOutInput = adForm.querySelector(`#timeout`);
const adRoomsInput = adForm.querySelector(`#room_number`);
const adGuestsInput = adForm.querySelector(`#capacity`);

// ================================================================================
// Задание 3 часть 1
// ================================================================================

const getRandomValue = function (max, min = 0) {
  let rand = min + Math.random() * ((max + 1) - min);
  return Math.floor(rand);
};

const getAvatarFaker = () => {
  let count = 0;

  return () => {
    count++;
    const userNumberToString = count < 10 ? `0${count}` : `${count}`;
    return `img/avatars/user${userNumberToString}.png`;
  };
};

const getFakeAvatar = getAvatarFaker();

const getNumberGen = () => {
  let count = 0;
  return () => {
    count++;
    return count;
  };
};

const getAdvertisementNumber = getNumberGen();

const getRandomElement = (arr) => {
  return arr[getRandomValue(arr.length - 1)];
};

const getPartialArray = (arr) => {
  const array = [];
  for (let i = 0; i <= getRandomValue(arr.length - 1); i++) {
    array.push(arr[i]);
  }
  return array;
};

class PinAuthor {
  constructor() {
    this.avatar = getFakeAvatar();
  }
}

class PinLocation {
  constructor() {
    this.x = getRandomValue(pinsListWidth);
    this.y = getRandomValue(POSITION_Y_MAX, POSITION_Y_MIN);
  }
}

class Pin {
  constructor() {
    this.author = new PinAuthor();
    this.location = new PinLocation();
    this.offer = new PinOffer(this.location);
  }
}

class PinOffer {
  constructor(location) {
    this.title = `Метка объявления №${getAdvertisementNumber()}`;
    this.address = `${location.x}, ${location.y}`;
    this.price = getRandomValue(MAX_PRICE, MIN_PRICE);
    this.type = getRandomElement(HABITATION_TYPES);
    this.rooms = getRandomValue(MAX_ROOMS);
    this.guests = this.rooms * GUESTS_PER_ROOM;
    this.checkin = getRandomElement(CHECK_TIMES);
    this.checkout = getRandomElement(CHECK_TIMES);
    this.features = getPartialArray(FEATURES);
    this.description = `Тупо лучшее`;
    this.photos = getPartialArray(PHOTOS);
  }
}

const getPins = () => {
  const pins = [];
  for (let i = 0; i < PINS_NUMBER; i++) {
    pins.push(new Pin());
  }
  return pins;
};

const renderPin = (pin) => {
  const newPin = pinMark.cloneNode(true);
  newPin.style.left = `${pin.location.x - (PIN_SIZE / 2)}px`;
  newPin.style.top = `${pin.location.y - (PIN_SIZE / 2 + PIN_PROTRUSION_HEIGHT)}px`;
  newPin.querySelector(`img`).src = pin.author.avatar;
  newPin.querySelector(`img`).alt = pin.offer.title;
  return newPin;
};

const createFragment = function (array, callback) {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < array.length; i++) {
    fragment.appendChild(callback(array[i]));
  }
  return fragment;
};

const pins = getPins();

const pinsFragment = createFragment(pins, renderPin);


// ================================================================================
// Задание 3 часть 2
// ================================================================================

const editNode = (parent, childClass, property, value) => {
  if (value) {
    switch (property) {
      case `textContent`:
        parent.querySelector(`.${childClass}`).textContent = value;
        break;

      case `src`:
        parent.querySelector(`.${childClass}`).src = value;
        break;

      default:
        break;
    }
  } else {
    parent.querySelector(`.${childClass}`).classList.add(`visually-hidden`);
  }
};

const editFeaturesList = (parent, features) => {
  if (features.length > 0) {
    const listItem = parent.querySelector(`li`);
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < features.length; i++) {
      const newListItem = listItem.cloneNode(true);
      newListItem.className = `popup__feature`;
      newListItem.classList.add(`popup__feature--${features[i]}`);
      fragment.appendChild(newListItem);
    }
    parent.innerHTML = ``;
    parent.appendChild(fragment);
  } else {
    parent.classList.add(`visually-hidden`);
  }
};

const editGallery = (parent, photos) => {
  if (photos.length > 0) {
    const photo = parent.querySelector(`img`);
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < photos.length; i++) {
      const newPhoto = photo.cloneNode(true);
      newPhoto.src = photos[i];
      fragment.appendChild(newPhoto);
    }
    parent.innerHTML = ``;
    parent.appendChild(fragment);
  } else {
    parent.classList.add(`visually-hidden`);
  }
};

const renderPinCard = (pin, card) => {
  // const newPinCard = pinCard.cloneNode(true);
  const featureList = card.querySelector(`.popup__features`);
  const gallery = card.querySelector(`.popup__photos`);
  editNode(card, `popup__title`, `textContent`, pin.offer.title);
  editNode(card, `popup__text--address`, `textContent`, pin.offer.address);
  editNode(card, `popup__text--price`, `textContent`, `${pin.offer.price}₽/ночь`);
  editNode(card, `popup__type`, `textContent`, `${HABITATION_TYPES_RU[pin.offer.type].name}`);
  editNode(card, `popup__text--capacity`, `textContent`, `${pin.offer.rooms} комнаты для ${pin.offer.guests} гостей`);
  editNode(card, `popup__text--time`, `textContent`, `Заезд после ${pin.offer.checkin}, выезд до ${pin.offer.checkout}`);
  editNode(card, `popup__description`, `textContent`, pin.offer.description);
  editNode(card, `popup__avatar`, `src`, pin.author.avatar);
  editFeaturesList(featureList, pin.offer.features);
  editGallery(gallery, pin.offer.photos);
};

// map.insertBefore(renderPinCard(pins[0]), pinsFilter);


// ================================================================================
// Задание 4 часть 1
// ================================================================================

const setInputsValues = () => {
  adTimeOutInput.value = adTimeInInput.value;
  adPriceInput.min = HABITATION_TYPES_RU[adTypeInput.value].minPrice;
  adPriceInput.placeholder = HABITATION_TYPES_RU[adTypeInput.value].minPrice;
  adGuestsInput.value = adRoomsInput.value < MAX_ROOMS_FOR_GUESTS ? adRoomsInput.value : 0;
};

const mainPinAddress = {
  x: Math.round(Number(mainPin.style.left.slice(0, -2)) + PIN_SIZE / 2), // метод slice вызван чтобы удалить "px" из конца строки
  y: Math.round(Number(mainPin.style.top.slice(0, -2)) + PIN_SIZE / 2)
};

const onAdPriceInputChangeValue = () => {
  const habitationType = adTypeInput.value;
  const adPrice = adPriceInput.value;

  if (adPrice < HABITATION_TYPES_RU[habitationType].minPrice) {
    adPriceInput.setCustomValidity(`Минимальная цена за ночь ${HABITATION_TYPES_RU[habitationType].minPrice}р`);
  } else {
    adPriceInput.setCustomValidity(``);
  }

  adPriceInput.reportValidity();
};

const onAdTypeInputChangeValue = () => {
  const habitationType = adTypeInput.value;

  adPriceInput.min = HABITATION_TYPES_RU[habitationType].minPrice;
  adPriceInput.placeholder = HABITATION_TYPES_RU[habitationType].minPrice;
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
    } else if (room < MAX_ROOMS_FOR_GUESTS && guest === 0) {
      guestInput.setCustomValidity(`Выбранное помещение предусмотрено для гостей`);
    } else if (room < guest) {
      guestInput.setCustomValidity(`Максимальное число гостей ${room}`);
    } else {
      guestInput.setCustomValidity(``);
    }

    guestInput.reportValidity();
  };

  guestInput.addEventListener(`input`, onGuestInputChangeValue);
};

synchronizeGuestsToRooms(adGuestsInput, adRoomsInput);

const blockEditadAddress = () => {
  adAddressInput.setAttribute(`readonly`, ``);
};

const disableAdFormFieldsets = () => {
  for (let i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].setAttribute(`disabled`, ``);
  }
};

const disableMapFilterFieldsets = () => {
  for (let i = 0; i < mapFilterFieldsets.length; i++) {
    mapFilterFieldsets[i].setAttribute(`disabled`, ``);
  }
};

const turnOnAdFormFieldsets = () => {
  for (let i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].removeAttribute(`disabled`);
  }
};

const turnOnMapFilterFieldsets = () => {
  for (let i = 0; i < mapFilterFieldsets.length; i++) {
    mapFilterFieldsets[i].removeAttribute(`disabled`);
  }
};

const setAdAddress = (obj) => {
  adAddressInput.value = `${obj.x}, ${obj.y}`;
};

const initializeMainPage = () => {
  disableMapFilterFieldsets();
  disableAdFormFieldsets();
  blockEditadAddress();
  setAdAddress(mainPinAddress);
};

const activateMainPage = () => {
  setInputsValues();
  pinsList.appendChild(pinsFragment);
  map.classList.remove(`map--faded`);
  adForm.classList.remove(`ad-form--disabled`);
  turnOnAdFormFieldsets();
  turnOnMapFilterFieldsets();
  synchronizeTimeInputs(adTimeInInput, adTimeOutInput);
};

initializeMainPage();

adPriceInput.addEventListener(`input`, onAdPriceInputChangeValue);
adTypeInput.addEventListener(`input`, onAdTypeInputChangeValue);

mainPin.addEventListener(`mousedown`, function (evt) {
  evt.preventDefault();
  if (evt.button === 0) {
    activateMainPage();
  }
});

mainPin.addEventListener(`keydown`, function (evt) {
  evt.preventDefault();
  if (evt.key === `Enter`) {
    activateMainPage();
  }
});

// ================================================================================
// Задание 4 часть 2
// ================================================================================

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

      const onClosePinCardEscPress = () => {
        if (evt.key === `Escape`) {
          evt.preventDefault();
          removePinCard();
        }
      };

      closePinCard.removeEventListener(`click`, onClosePinCardClick);
      document.removeEventListener(`keydown`, onClosePinCardEscPress);

      closePinCard.addEventListener(`click`, onClosePinCardClick);
      document.addEventListener(`keydown`, onClosePinCardEscPress);

      const markAvatarAlt = mark.querySelector(`img`).alt;
      renderPinCard(pins.find((pin) => pin.offer.title === markAvatarAlt), pinCard);
      map.insertBefore(pinCard, pinsFilter);
    }
  });
};


showPinCard();
