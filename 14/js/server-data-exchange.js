import {SERVER_ADDRESS} from './constant.js';

//Получаем данные с сервера
const getData = (onSuccess, onFail) => {
  fetch(SERVER_ADDRESS)
    .then((response) => response.json())
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
    SERVER_ADDRESS,
    {
      method: 'POST',
      body,
    },
  )
    .then(() => onSuccess())
    .catch(() => {
      onFail();
    });
};

export {getData, sendData};
