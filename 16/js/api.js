import {ServerAddress} from './constant.js';

//Получаем данные с сервера
const getData = (onSuccess, onFail) => {
  fetch(ServerAddress.GET)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not OK');
      }
      return response.json();
    })
    .then((photos) => {
      onSuccess(photos);
    })
    .catch(() => {
      onFail();
    });
};

//Отправляем данные на сервер
const sendData = (onSuccess, onFail, body) => {
  fetch(
    ServerAddress.POST,
    {
      method: 'POST',
      body,
    },
  )
    .then((response) => {
      if (!response.ok) {
        onFail();
      }
      onSuccess();
    });
};

export {getData, sendData};
