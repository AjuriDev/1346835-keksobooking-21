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

const map = document.querySelector(`.map`);
const pinsList = document.querySelector(`.map__pins`);
const pinsListWidth = pinsList.scrollWidth;
const pinTemplate = document.querySelector(`#pin`).content;
const pinMark = pinTemplate.querySelector(`.map__pin`);

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
};

class PinLocation {
  constructor() {
    this.x = getRandomValue(pinsListWidth);
    this.y = getRandomValue(POSITION_Y_MAX, POSITION_Y_MIN);
  }
};

class Pin {
  constructor() {
    this.author = new PinAuthor();
    this.location = new PinLocation();
    this.offer = new PinOffer(this.location);
  }
};

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
};

const getPins = () => {
  const pins = [];
  for (let i = 0; i < PINS_NUMBER; i++) {
    pins.push(new Pin());
  }
  return pins;
};

console.log(new Pin());

const renderPin = (pin) => {
  const newPin = pinMark.cloneNode(true);
  newPin.style.left = `${pin.location.x - (PIN_WIDTH / 2)}px`;
  newPin.style.top = `${pin.location.y - (PIN_HEIGHT / 2)}px`;
  newPin.querySelector(`img`).src = pin.author.avatar;
  newPin.querySelector(`img`).alt = pin.offer.title;
  return newPin;
};

const fragment = document.createDocumentFragment();
const pins = getPins();
for (let i = 0; i < pins.length; i++) {
  fragment.appendChild(renderPin(pins[i]));
}

pinsList.appendChild(fragment);
