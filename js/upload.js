'use strict';

(function () {
  const URL = `https://21.javascript.pages.academy/keksobooking`;
  const StatusCode = {
    OK: 200
  };
  const TIMEOUT_IN_MS = 10000;

  const sendAdForm = (data, onSuccess, onError) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = `json`;

    xhr.addEventListener(`load`, function () {
      if (xhr.status === StatusCode.OK) {
        onSuccess(xhr.response);
      } else {
        onError(`Статус ответа: ` + xhr.status + ` ` + xhr.statusText);
      }
    });

    xhr.addEventListener(`error`, function () {
      onError();
    });

    xhr.addEventListener(`timeout`, function () {
      onError();
    });

    xhr.timeout = TIMEOUT_IN_MS;

    xhr.open(`POST`, URL);
    xhr.send(data);
  };

  window.upload = {
    sendAdForm
  };
})();
