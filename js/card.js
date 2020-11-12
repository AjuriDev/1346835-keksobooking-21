'use strict';

(() => {
  const HousingTypesRu = {
    PALACE: {
      NAME: `Дворец`,
      MIN_PRICE: 10000
    },
    FLAT: {
      NAME: `Квартира`,
      MIN_PRICE: 1000
    },
    HOUSE: {
      NAME: `Дом`,
      MIN_PRICE: 5000
    },
    BUNGALOW: {
      NAME: `Бунгало`,
      MIN_PRICE: 0
    }
  };

  const map = window.util.map;
  const cardTemplate = document.querySelector(`#card`).content;
  const pinCard = cardTemplate.querySelector(`.map__card`);
  const closePinCard = pinCard.querySelector(`.popup__close`);
  const mapFormContainer = map.querySelector(`.map__filters-container`);

  const editNode = (parent, childClass, property, value) => {
    if (value) {
      parent.querySelector(`.${childClass}`).classList.remove(`visually-hidden`);

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
    if (features.length) {
      parent.classList.remove(`visually-hidden`);
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
    if (photos.length) {
      parent.classList.remove(`visually-hidden`);
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
    const featureList = card.querySelector(`.popup__features`);
    const gallery = card.querySelector(`.popup__photos`);
    editNode(card, `popup__title`, `textContent`, pin.offer.title);
    editNode(card, `popup__text--address`, `textContent`, pin.offer.address);
    editNode(card, `popup__text--price`, `textContent`, `${pin.offer.price}₽/ночь`);
    editNode(card, `popup__type`, `textContent`, `${HousingTypesRu[pin.offer.type.toUpperCase()].NAME}`);
    editNode(card, `popup__text--capacity`, `textContent`, `${pin.offer.rooms} комнаты для ${pin.offer.guests} гостей`);
    editNode(card, `popup__text--time`, `textContent`, `Заезд после ${pin.offer.checkin}, выезд до ${pin.offer.checkout}`);
    editNode(card, `popup__description`, `textContent`, pin.offer.description);
    editNode(card, `popup__avatar`, `src`, pin.author.avatar);
    editFeaturesList(featureList, pin.offer.features);
    editGallery(gallery, pin.offer.photos);
  };

  const removePinCard = () => {
    pinCard.remove();
    closePinCard.removeEventListener(`click`, onClosePinCardClick);
    document.removeEventListener(`keydown`, onClosePinCardEscPress);
  };

  const onClosePinCardClick = (evt) => {
    evt.preventDefault();
    removePinCard();
  };

  const onClosePinCardEscPress = (evt) => {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      removePinCard();
    }
  };

  const onMapShowPinCard = (arr) => {
    return (evt) => {
      evt.preventDefault();
      const mark = evt.target.closest(`.map__pin`);
      if (mark && !mark.classList.contains(`map__pin--main`)) {
        closePinCard.addEventListener(`click`, onClosePinCardClick);
        document.addEventListener(`keydown`, onClosePinCardEscPress);

        const markAvatarAlt = mark.querySelector(`img`).alt;
        window.card.renderPinCard(arr.find((pin) => pin.offer.title === markAvatarAlt), pinCard);
        map.insertBefore(pinCard, mapFormContainer);
      }
    };
  };

  window.card = {
    pinCard,
    mapFormContainer,
    renderPinCard,
    removePinCard,
    onMapShowPinCard,
    HousingTypesRu
  };
})();
