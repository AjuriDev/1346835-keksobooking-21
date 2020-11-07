'use strict';

(() => {
  const ESC_KEYCODE = 27;
  const ENTER_KEYCODE = 13;

  const map = document.querySelector(`.map`);
  const pinsList = map.querySelector(`.map__pins`);

  const getRandomValue = (max, min = 0) => {
    let rand = min + Math.random() * ((max + 1) - min);
    return Math.floor(rand);
  };

  const isEscEvent = function (action) {
    return (evt) => {
      evt.preventDefault();
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    };
  };

  const isEnterEvent = function (action) {
    return (evt) => {
      evt.preventDefault();
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    };
  };

  const getNumberGen = () => {
    let count = 0;
    return () => {
      count++;
      return count;
    };
  };

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

  const createFragment = function (array, callback) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < array.length; i++) {
      fragment.appendChild(callback(array[i]));
    }
    return fragment;
  };

  window.util = {
    getRandomValue,
    isEscEvent,
    isEnterEvent,
    getNumberGen,
    getRandomElement,
    getPartialArray,
    createFragment,
    map,
    pinsList
  };
})();
