'use strict';

const PINS_NUMBER = 8;
const MAX_ROOMS = 10;
const GUESTS_PER_ROOM = 3;
const HABITATION_TYPES = [`palace`, `flat`, `house`, `bungalow`];
const CHECK_TIMES = [`12:00`, `13:00`, `14:00`];
const FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const PHOTOS = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
const PIN_WIDTH = 65;
const PIN_HEIGHT = 75;
const POSITION_Y_MAX = 630;
const POSITION_Y_MIN = 130;
const MAX_PRICE = 200000;
const MIN_PRICE = 10000;
const HABITATION_TYPES_RU = {
  palace: `Дворец`,
  flat: `Квартира`,
  house: `Дом`,
  bungalow: `Бунгало`
};

const map = document.querySelector(`.map`);
const pinsList = map.querySelector(`.map__pins`);
const pinsFilter = map.querySelector(`.map__filters-container`);
const pinsListWidth = pinsList.scrollWidth;
const pinTemplate = document.querySelector(`#pin`).content;
const pinMark = pinTemplate.querySelector(`.map__pin`);
const cardTemplate = document.querySelector(`#card`).content;
const pinCard = cardTemplate.querySelector(`.map__card`);

map.classList.remove(`map--faded`);

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

const pins = getPins();

const renderPin = (pin) => {
  const newPin = pinMark.cloneNode(true);
  newPin.style.left = `${pin.location.x - (PIN_WIDTH / 2)}px`;
  newPin.style.top = `${pin.location.y - (PIN_HEIGHT / 2)}px`;
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

const pinsFragment = createFragment(pins, renderPin);

pinsList.appendChild(pinsFragment);

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

const renderPinCard = (pin) => {
  const newPinCard = pinCard.cloneNode(true);
  const featureList = newPinCard.querySelector(`.popup__features`);
  const gallery = newPinCard.querySelector(`.popup__photos`);
  editNode(newPinCard, `popup__title`, `textContent`, pin.offer.title);
  editNode(newPinCard, `popup__text--address`, `textContent`, pin.offer.address);
  editNode(newPinCard, `popup__text--price`, `textContent`, `${pin.offer.price}₽/ночь`);
  editNode(newPinCard, `popup__type`, `textContent`, `${HABITATION_TYPES_RU[pin.offer.type]}`);
  editNode(newPinCard, `popup__text--capacity`, `textContent`, `${pin.offer.rooms} комнаты для ${pin.offer.guests} гостей`);
  editNode(newPinCard, `popup__text--time`, `textContent`, `Заезд после ${pin.offer.checkin}, выезд до ${pin.offer.checkout}`);
  editNode(newPinCard, `popup__description`, `textContent`, pin.offer.description);
  editNode(newPinCard, `popup__avatar`, `src`, pin.author.avatar);
  editFeaturesList(featureList, pin.offer.features);
  editGallery(gallery, pin.offer.photos);

  return newPinCard;
};

// console.log(renderPinCard(pins[0]));
map.insertBefore(renderPinCard(pins[0]), pinsFilter);
