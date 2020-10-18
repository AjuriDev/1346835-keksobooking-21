'use strict'

const PINS_NUMBER = 8;
const MAX_ROOMS = 10;
const GUESTS_PER_ROOM = 3;
const HABITATION_TYPES = [`palace`, `flat`, `house`, `bungalow`];
const CHECK_TIMES = [`12:00`, `13:00`, `14:00`];
const FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const PHOTOS = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
const PIN_WIDTH = 65;
const PIN_HEIGHT = 75;

const map = document.querySelector(`.map`);
const pinsList = document.querySelector(`.map__pins`);
const pinTemplate = document.querySelector(`#pin`).content;
const pinMark = pinTemplate.querySelector(`.map__pin`);
const PINS_LIST_WIDTH = pinsList.scrollWidth;

map.classList.remove(`map--faded`)

const getRandomValue = function (max, min = 0) {
  let rand = min + Math.random() * ((max + 1) - min);
  return Math.floor(rand);
};

const getAvatarFaker = () => {
  let count = 0;

  return () => {
    count++;
    const userNumberToString = count < 10 ? `0${count}` : `${count}`;
    const avatar = `img/avatars/user${userNumberToString}.png`;
    return avatar;
  };
};

const getFakeAvatar = getAvatarFaker();

const getNumberGen = () => {
  let count = 0;
  return () => {
    count++;
    return count;
  }
};

const getAdvertisementNumber = getNumberGen();

const getRandomElement = (arr) => {
  const element = arr[getRandomValue(arr.length - 1)];
  return element;
};

const getPartialArray = (arr) => {
  const array = [];
  for (let i = 0; i <= getRandomValue(arr.length - 1); i++) {
    array.push(arr[i]);
  }
  return array;
};

const Author = class {
  constructor() {
    this.avatar = getFakeAvatar();
  }
};

const Location = class {
  constructor() {
    this.x = getRandomValue(PINS_LIST_WIDTH);
    this.y = getRandomValue(630, 130);
  }
};

const Offer = class {
  constructor() {
    this.title = `Метка объявления №${getAdvertisementNumber()}`;
    this.address = `${location.x}, ${location.y}`;
    this.price =  getRandomValue(1000, 100);
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

const Pin = class {
  constructor() {
    this.author = new Author();
    this.offer = new Offer();
    this.location = new Location();
  }
}

const getPins = () => {
  const pins = [];
  for (let i = 0; i < PINS_NUMBER; i++) {
    pins.push(new Pin());
  }
  return pins;
}

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
