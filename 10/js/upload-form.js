import {isEscapeKey} from './utils.js';
const scaleBlock = document.querySelector('.img-upload__scale');
const scaleValue = document.querySelector('.scale__control--value');
const uploadForm = document.querySelector('#upload-select-image');
const uploadFormOverlay = document.querySelector('.img-upload__overlay');
const closeButton = document.querySelector('#upload-cancel');
const uploadFile = document.querySelector('#upload-file');
const descriptionField = document.querySelector('.text__description');
const hashtagsField = document.querySelector('.text__hashtags');
const body = document.querySelector('body');
const hashtagErrorMessage = 'ХешТег введен неверно';

//Подключаем Pristine
const formValidation = new Pristine(uploadForm, {
  classTo: 'upload-image__validate', // Элемент, на который будут добавляться классы
  errorTextParent: 'upload-image__validate', // Элемент, куда будет выводиться текст с ошибкой
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error-text',
});

//Предварительно подготавливаем массив с хештегами
const improveText = (text) => {
  text = text.toLowerCase();
  text = text.trim();
  for (let i = 1; i < text.length; i++) {
    text = text.replace('  ',' ');
  }
  return text;
};

//Получаем элемент массива хештегов и проверяем его регуляркой
const isMatchRegExp = (arrayItem) => {
  const regExp = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;
  return regExp.test(arrayItem);
};

//Пробегаемся по каждому элементу массива хештегов и отправляем элемент на проверку регулярным выражением
const validateRegExp = (array) => array.every(isMatchRegExp);

//Проверяем количество шештегов
const validateArrayLength = (array) => array.length <= 5;

//Проверяем массив хештегов на дубликаты
const hasNoDuplicateItem = (array) => {
  const workArray = array.slice().sort();

  for (let i = 0; i < workArray.length; i++) {
    if (workArray[i] === workArray[i + 1]) {
      return false;
    }
  }

  return true;
};

//Проверяем хештеги
const validateHashtags = () => {
  let hashtagArray = hashtagsField.value;

  hashtagArray = improveText(hashtagArray);

  if (hashtagArray === '') {
    return true;
  }

  hashtagArray = hashtagArray.split(' ');

  const isArrayLengthValid = validateArrayLength(hashtagArray);
  const isRegExpValid = validateRegExp(hashtagArray);
  const hasNoDuplicates = hasNoDuplicateItem(hashtagArray);
  const validateResult = isArrayLengthValid && isRegExpValid && hasNoDuplicates;
  return validateResult;
};


//Управляем процентом увеличения картинки
const controlScale = (evt) => {
  evt.preventDefault();
  const current = Number(scaleValue.value.split('%')[0]);
  if (evt.target.matches('.scale__control--smaller')&& current > 25) {
    scaleValue.value = `${current - 25}%`;
  } if (evt.target.matches('.scale__control--bigger')&& current < 100) {
    scaleValue.value = `${current + 25}%`;
  }
};


//Закрываем форму загрузки фотографий
const closeForm = (evt) => {
  evt.preventDefault();
  uploadFormOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  uploadFile.value = '';
  descriptionField.value = '';
  hashtagsField.value = '';
  closeButton.removeEventListener('click', closeForm);
  uploadForm.removeEventListener('submit', submitForm);
  document.removeEventListener('keydown', closeFormKeydown);
  scaleBlock.removeEventListener('click', controlScale);
  formValidation.reset();
};

// Отправляем форму и проводим валидацию
function submitForm (evt) {
  if(!formValidation.validate()) {
    evt.preventDefault();
    //descriptionField.value = '';
    hashtagsField.value = '';
    //formValidation.reset();
  } else {
    body.classList.remove('modal-open');
    //uploadFile.value = '';
    //descriptionField.value = '';
    //hashtagsField.value = '';
    closeButton.removeEventListener('click', closeForm);
    uploadForm.removeEventListener('submit', submitForm);
    document.removeEventListener('keydown', closeFormKeydown);
    scaleBlock.removeEventListener('click', controlScale);
    //formValidation.reset();
  }
}

//Проверяем, что нажата кнопка Escape, и не в фокусе поле хештегов или описания
function closeFormKeydown (evt) {
  if (isEscapeKey(evt) && evt.target !== descriptionField && evt.target !== hashtagsField) {
    closeForm(evt);
  }
}

//Открываем форму загрузки изображения
const openUploadForm = () => {
  uploadFormOverlay.classList.remove('hidden');
  closeButton.addEventListener('click', closeForm);
  uploadForm.addEventListener('submit', submitForm);
  document.addEventListener('keydown', closeFormKeydown);
  scaleBlock.addEventListener('click', controlScale);
  body.classList.add('modal-open');
  formValidation.addValidator(hashtagsField, validateHashtags, hashtagErrorMessage);
};

export {openUploadForm};
