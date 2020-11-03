'use strict';

(() => {
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

  window.card = {
    renderPinCard,
    HABITATION_TYPES_RU
  };
})();
