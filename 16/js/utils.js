import {MESSAGE_SHOW_TIME} from './constant.js';


const getRandomPositiveInteger = (a, b) => {
  const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
  const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

const getRandomArrayElement = (elements) => {
  const element = elements[getRandomPositiveInteger(0, elements.length - 1)];
  return element;
};

const isEscapeKey = (evt) =>  evt.key === 'Escape';

//Показывает сообщение об ошибке загрузки данных с удаленного сервера.
const showDownloadMessage = (message) => {
  const errorElement = document.createElement('div');

  errorElement.classList.add('download-error-text');
  errorElement.textContent = message;

  document.body.append(errorElement);

  setTimeout(() => {
    errorElement.remove();
  }, MESSAGE_SHOW_TIME);
};

//Реакция на нажатие закрытия окна об отправке сообщения
const onCloseMessageByClick = (evt) => {
  if (evt.target.matches('.success') || evt.target.matches('.error')) {
    evt.preventDefault();
    closeUploadMessage();
  }
};

//Реакция на кнопку ESC для закрытия окна об отправке сообщения
const onCloseMessageByKeydown = (evt)=> {
  if (isEscapeKey) {
    evt.preventDefault();
    closeUploadMessage();
  }
};

//Закрываем окно загрузки изображения
function closeUploadMessage () {
  document.removeEventListener('keydown', onCloseMessageByKeydown);
  document.removeEventListener('click', onCloseMessageByClick);
  document.body.lastChild.remove();
}

//Реакция нанажатие кнопки закрытия окна отправки
const onCloseUploadMessageClick = (evt)=> {
  evt.preventDefault();
  closeUploadMessage();
};

//Показыываем сообщение о передаче на сервер
const showUploadMessage = (category, template, container) => {
  const uploadFragment = document.createDocumentFragment();
  const uploadElement = template.cloneNode(true);

  uploadFragment.appendChild(uploadElement);
  container.appendChild(uploadFragment);
  const closeMessageButton = uploadElement.querySelector(`.${category}__button`);

  document.addEventListener('keydown', onCloseMessageByKeydown);
  document.addEventListener('click', onCloseMessageByClick);
  closeMessageButton.addEventListener('click', onCloseUploadMessageClick);
};

const debounce = (cb, timeoutDelay) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(cb, timeoutDelay, ...rest);
  };
};

export {debounce, getRandomPositiveInteger, getRandomArrayElement, isEscapeKey, showDownloadMessage, showUploadMessage};
