'use strict';

const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];

const adForm = window.form.adForm;
const avatarChooser = adForm.querySelector(`#avatar`);
const avatarPreview = adForm.querySelector(`.ad-form-header__preview`).querySelector(`img`);
const photoChooser = adForm.querySelector(`#images`);
const photoPreviewContainer = adForm.querySelector(`.ad-form__photo`);

const getReader = (file, cb) => {
  const reader = new FileReader();

  reader.addEventListener(`load`, function () {
    cb(reader);
  });

  reader.readAsDataURL(file);
};

const changeAvatarSrc = (reader) => {
  avatarPreview.src = reader.result;
};

const showPickedPhoto = (reader) => {
  photoPreviewContainer.innerHTML = ``;
  const image = document.createElement(`img`);
  image.src = reader.result;
  image.style = `max-width: 100%; max-height: 100%`;
  photoPreviewContainer.appendChild(image);
};

const getFileChooserHandler = (chooser, types, cb) => {
  return () => {
    const file = chooser.files[0];
    const fileName = file.type.toLowerCase();

    const matches = types.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      getReader(file, cb);
    }
  };
};

const onAvatarChooserChange = getFileChooserHandler(avatarChooser, FILE_TYPES, changeAvatarSrc);

const onAdPhotoChooserChange = getFileChooserHandler(photoChooser, FILE_TYPES, showPickedPhoto);

const activateChoosers = () => {
  avatarChooser.addEventListener(`change`, onAvatarChooserChange);
  photoChooser.addEventListener(`change`, onAdPhotoChooserChange);
};

const deactivateChoosers = () => {
  avatarChooser.removeEventListener(`change`, onAvatarChooserChange);
  photoChooser.removeEventListener(`change`, onAdPhotoChooserChange);
  photoPreviewContainer.innerHTML = ``;
  avatarPreview.src = `img/muffin-grey.svg`;
};

activateChoosers();

window.preview = {
  activateChoosers,
  deactivateChoosers
};
