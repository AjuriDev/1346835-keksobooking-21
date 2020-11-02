'use strict';

(() => {
  const PINS_NUMBER = 8;
  const MAX_ROOMS = 10;
  const GUESTS_PER_ROOM = 3;
  const POSITION_Y_MAX = 630;
  const POSITION_Y_MIN = 130;
  const MAX_PRICE = 200000;
  const MIN_PRICE = 10000;
  const HABITATION_TYPES = [`palace`, `flat`, `house`, `bungalow`];
  const CHECK_TIMES = [`12:00`, `13:00`, `14:00`];
  const FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
  const PHOTOS = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];

  const map = document.querySelector(`.map`);
  const pinsList = map.querySelector(`.map__pins`);

  const pinsListWidth = pinsList.scrollWidth;

  const getAvatarFaker = () => {
    let count = 0;

    return () => {
      count++;
      const userNumberToString = count < 10 ? `0${count}` : `${count}`;
      return `img/avatars/user${userNumberToString}.png`;
    };
  };

  const getFakeAvatar = getAvatarFaker();

  const getAdvertisementNumber = window.util.getNumberGen();

  class PinAuthor {
    constructor() {
      this.avatar = getFakeAvatar();
    }
  }

  class PinLocation {
    constructor() {
      this.x = window.util.getRandomValue(pinsListWidth);
      this.y = window.util.getRandomValue(POSITION_Y_MAX, POSITION_Y_MIN);
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
      this.price = window.util.getRandomValue(MAX_PRICE, MIN_PRICE);
      this.type = window.util.getRandomElement(HABITATION_TYPES);
      this.rooms = window.util.getRandomValue(MAX_ROOMS);
      this.guests = this.rooms * GUESTS_PER_ROOM;
      this.checkin = window.util.getRandomElement(CHECK_TIMES);
      this.checkout = window.util.getRandomElement(CHECK_TIMES);
      this.features = window.util.getPartialArray(FEATURES);
      this.description = `Тупо лучшее`;
      this.photos = window.util.getPartialArray(PHOTOS);
    }
  }

  const getPins = () => {
    const pins = [];
    for (let i = 0; i < PINS_NUMBER; i++) {
      pins.push(new Pin());
    }
    return pins;
  };

  const generatedPins = getPins();

  window.data = {
    map: map,
    pinsList: pinsList,
    generatedPins: generatedPins
  };
})();
