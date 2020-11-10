'use strict';

(function () {
  const mapForm = window.map.mapForm;
  const pinsList = window.util.pinsList;
  const housingType = mapForm.querySelector(`#housing-type`);
  const filterValue = {};
  let ads = [];

  const fillAds = (arr) => {
    ads = arr;
  };

  const getAdRank = (pin) => {
    let rank = 0;

    if (pin.offer.type === filterValue[`housing-type`]) {
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

  const onSelectTypeChange = () => {
    changeFilterValue(housingType);
    updatePinsList();
    // housingType.removeEventListener(`change`, onSelectTypeChange);
  };

  const activateFilter = () => {
    housingType.addEventListener(`change`, onSelectTypeChange);
  };

  const deactivateFilter = () => {
    housingType.removeEventListener(`change`, onSelectTypeChange);
  };


  // const onSelectChange = (evt) => {
  //   const select = evt.target.closest(`select`);
  //   updatePinsList();
  // };

  window.filter = {
    fillAds,
    activateFilter,
    deactivateFilter
  };

})();
