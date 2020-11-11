'use strict';

(function () {
  const mapForm = window.map.mapForm;
  const pinsList = window.util.pinsList;
  const housingType = mapForm.querySelector(`#housing-type`);
  const housingPrice = mapForm.querySelector(`#housing-price`);
  const housingRooms = mapForm.querySelector(`#housing-rooms`);
  const housingGuests = mapForm.querySelector(`#housing-guests`);
  const filterValue = {
    'housing-type': `any`,
    'housing-price': `any`,
    'housing-rooms': `any`,
    'housing-guest': `any`
  };
  let ads = [];
  const priceMap = {
    any: {
      min: ``,
      max: ``
    },

    low: {
      min: 0,
      max: 9999
    },

    middle: {
      min: 10000,
      max: 49999
    },

    high: {
      min: 50000,
      max: 1000000
    }
  };

  const fillAds = (arr) => {
    ads = arr;
  };

  const getAdRank = (pin) => {
    let rank = 0;

    if (pin.offer.type === filterValue[`housing-type`]) {
      rank += 1;
    }

    if (pin.offer.rooms === Number(filterValue[`housing-rooms`])) {
      rank += 1;
    }

    if (pin.offer.guests === Number(filterValue[`housing-guests`])) {
      rank += 1;
    }

    if (pin.offer.price > priceMap[filterValue[`housing-price`]].min && pin.offer.price < priceMap[filterValue[`housing-price`]].max) {
      rank += 1;
    }

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

  const activateFilter = () => {
    housingType.addEventListener(`change`, onSelectTypeChange);
    housingPrice.addEventListener(`change`, onSelectPriceChange);
    housingRooms.addEventListener(`change`, onSelectRoomsChange);
    housingGuests.addEventListener(`change`, onSelectGuestsChange);
  };

  const deactivateFilter = () => {
    housingType.removeEventListener(`change`, onSelectTypeChange);
    housingPrice.removeEventListener(`change`, onSelectPriceChange);
    housingRooms.removeEventListener(`change`, onSelectRoomsChange);
    housingGuests.removeEventListener(`change`, onSelectGuestsChange);
  };


  window.filter = {
    fillAds,
    activateFilter,
    deactivateFilter
  };

})();
