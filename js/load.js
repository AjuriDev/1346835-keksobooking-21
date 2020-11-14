'use strict';

const DATA_URL = `https://21.javascript.pages.academy/keksobooking/data`;
const SEND_URL = `https://21.javascript.pages.academy/keksobooking`;
const TIMEOUT_IN_MS = 10000;

const StatusCode = {
  OK: 200
};

const getRequest = (onSuccess, onError) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = `json`;
  xhr.timeout = TIMEOUT_IN_MS;

  xhr.addEventListener(`load`, () => {
    if (xhr.status === StatusCode.OK) {
      onSuccess(xhr.response);
    } else {
      onError(`Статус ответа: ` + xhr.status + ` ` + xhr.statusText);
    }
  });

  xhr.addEventListener(`error`, () => {
    onError(`Произошла ошибка соединения`);
  });

  xhr.addEventListener(`timeout`, () => {
    onError(`Запрос не успел выполниться за ` + xhr.timeout + `мс`);
  });

  return xhr;
};

const getData = (onSuccess, onError) => {
  const xhr = getRequest(onSuccess, onError);
  xhr.open(`GET`, DATA_URL);
  xhr.send();
};

const sendFormData = (data, onSuccess, onError) => {
  const xhr = getRequest(onSuccess, onError);
  xhr.open(`POST`, SEND_URL);
  xhr.send(data);
};

window.load = {
  getData,
  sendFormData
};
