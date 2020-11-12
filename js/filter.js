'use strict';

(() => {
  const mapForm = window.map.mapForm;
  const pinsList = window.util.pinsList;
  const housingType = mapForm.querySelector(`#housing-type`);
  const housingPrice = mapForm.querySelector(`#housing-price`);
  const housingRooms = mapForm.querySelector(`#housing-rooms`);
  const housingGuests = mapForm.querySelector(`#housing-guests`);
  const housingFeatures = mapForm.querySelector(`#housing-features`);
  const filterValue = {
    'housing-type': `any`,
    'housing-price': `any`,
    'housing-rooms': `any`,
    'housing-guest': `any`
  };
  let ads = [];
  const features = [];
  const PriceMap = {
    ANY: {
      MIN: ``,
      MAX: ``
    },

    LOW: {
      MIN: 0,
      MAX: 9999
    },

    MIDDLE: {
      MIN: 10000,
      MAX: 49999
    },

    HIGH: {
      MIN: 50000,
      MAX: 1000000
    }
  };
  const RankMap = {
    TYPE: 1,
    PRICE: 1,
    ROOMS: 1,
    GUESTS: 1,
    FEATURES: 1
  };

  const fillAds = (arr) => {
    ads = arr;
  };

  const getFeatureRank = (pin) => {
    let rank = 0;

    features.forEach((feature) => {
      if (pin.offer.features.includes(feature)) {
        rank += RankMap.FEATURES;
      }
    });

    return rank;
  };

  const getAdRank = (pin) => {
    let rank = 0;

    if (pin.offer.type === filterValue[`housing-type`]) {
      rank += RankMap.TYPE;
    }

    if (pin.offer.rooms === Number.parseInt(filterValue[`housing-rooms`], 10)) {
      rank += RankMap.ROOMS;
    }

    if (pin.offer.guests === Number.parseInt(filterValue[`housing-guests`], 10)) {
      rank += RankMap.GUESTS;
    }

    if (pin.offer.price > PriceMap[filterValue[`housing-price`].toUpperCase()].MIN && pin.offer.price < PriceMap[filterValue[`housing-price`].toUpperCase()].MAX) {
      rank += RankMap.PRICE;
    }

    rank += getFeatureRank(pin);

    return rank;
  };

  const compareAdPrice = (left, right) => {
    if (left > right) {
      return 1;
    } else if (left < right) {
      return -1;
    } else {
      return 0;
    }
  };

  const getFilteredAds = () => {
    return ads.sort((left, right) => {
      let rankDiff = getAdRank(right) - getAdRank(left);
      if (rankDiff === 0) {
        rankDiff = compareAdPrice(left.offer.price, right.offer.price);
      }
      return rankDiff;
    });
  };

  const updatePinsList = () => {
    window.card.removePinCard();
    window.map.resetPinsList();
    pinsList.appendChild(window.util.createFragment(getFilteredAds(), window.map.PINS_NUMBER, window.pin.renderPin));
  };

  const changeFilterValue = (input) => {
    filterValue[input.name] = input.value;
  };

  const onSelectTypeChange = window.util.debounce(() => {
    changeFilterValue(housingType);
    updatePinsList();
  });

  const onSelectPriceChange = window.util.debounce(() => {
    changeFilterValue(housingPrice);
    updatePinsList();
  });

  const onSelectRoomsChange = window.util.debounce(() => {
    changeFilterValue(housingRooms);
    updatePinsList();
  });

  const onSelectGuestsChange = window.util.debounce(() => {
    changeFilterValue(housingGuests);
    updatePinsList();
  });

  const onFieldsetFeaturesChange = window.util.debounce((evt) => {
    let feature = 0;
    let inputFeature = 0;

    if (evt.target.classList.contains(`map__feature`)) {
      feature = evt.target;
    }

    if (feature) {
      inputFeature = housingFeatures.querySelector(`#${feature.getAttribute(`for`)}`);

      if (features.includes(inputFeature.value)) {
        features.splice(features.indexOf(inputFeature.value), 1);
        inputFeature.removeAttribute(`checked`, `checked`);
      } else {
        features.push(inputFeature.value);
        inputFeature.setAttribute(`checked`, `checked`);
      }

      updatePinsList();
    }
  });

  const activateFilter = () => {
    housingType.addEventListener(`change`, onSelectTypeChange);
    housingPrice.addEventListener(`change`, onSelectPriceChange);
    housingRooms.addEventListener(`change`, onSelectRoomsChange);
    housingGuests.addEventListener(`change`, onSelectGuestsChange);
    housingFeatures.addEventListener(`mousedown`, onFieldsetFeaturesChange);
  };

  const deactivateFilter = () => {
    housingType.removeEventListener(`change`, onSelectTypeChange);
    housingPrice.removeEventListener(`change`, onSelectPriceChange);
    housingRooms.removeEventListener(`change`, onSelectRoomsChange);
    housingGuests.removeEventListener(`change`, onSelectGuestsChange);
    housingFeatures.removeEventListener(`mousedown`, onFieldsetFeaturesChange);
  };


  window.filter = {
    fillAds,
    activateFilter,
    deactivateFilter
  };

})();
