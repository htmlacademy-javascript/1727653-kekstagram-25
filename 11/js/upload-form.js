import {isEscapeKey} from './utils.js';
import {ERROR_MESSAGE, MAX_HASHTAG_COUNT, ZOOM, DESCRIPTION_LENGTH_FIELD, ZOOM_CONTROL_BUTTON_CLASS, HASHTAG_MASK} from './constant.js';
const scaleBlock = document.querySelector('.img-upload__scale');
const scaleValue = document.querySelector('.scale__control--value');
const uploadForm = document.querySelector('#upload-select-image');
const uploadFormOverlay = document.querySelector('.img-upload__overlay');
const closeButton = document.querySelector('#upload-cancel');
const uploadFile = document.querySelector('#upload-file');
const descriptionField = document.querySelector('.text__description');
const hashtagsField = document.querySelector('.text__hashtags');
const body = document.querySelector('body');

//Подключаем Pristine
const formValidation = new Pristine(uploadForm, {
  classTo: 'upload-image__validate', // Элемент, на который будут добавляться классы
  errorTextParent: 'upload-image__validate', // Элемент, куда будет выводиться текст с ошибкой
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error-text',
});

//Предварительно подготавливаем массив с хештегами
const cleanText = (text) => {
  text = text.toLowerCase().trim();
  for (let i = 1; i < text.length; i++) {
    text = text.replace('  ',' ');
  }
  return text;
};

//Получаем элемент массива хештегов и проверяем его регуляркой
const validateHashtagByMask = (hashtagItem) => HASHTAG_MASK.test(hashtagItem);

//Пробегаемся по каждому элементу массива хештегов и отправляем элемент на проверку регулярным выражением
const validateRegExp = (hashtags) => hashtags.every(validateHashtagByMask);

//Проверяем количество шештегов
const validateHashtagsCount = (hashtags) => hashtags.length <= MAX_HASHTAG_COUNT;

//Проверяем массив хештегов на дубликаты
const validateNoDuplicateItem = (hashtags) => {
  const hashtagsList = hashtags.slice().sort();

  for (let i = 0; i < hashtagsList.length; i++) {
    if (hashtagsList[i] === hashtagsList[i + 1]) {
      return false;
    }
  }
  return true;
};

//Проверяем поле description на длинну
const validateDescriptionLength = () => {
  const description = descriptionField.value.length;
  if (description <= DESCRIPTION_LENGTH_FIELD) {
    return true;
  } else {
    return false;
  }
};

//Проверяем хештеги
const validateHashtags = () => {
  let hashtagsList = hashtagsField.value;

  hashtagsList = cleanText(hashtagsList);

  if (hashtagsList === '') {
    return true;
  }

  hashtagsList = hashtagsList.split(' ');

  const isHashtagsListLengthValid = validateHashtagsCount(hashtagsList);
  const isRegExpValid = validateRegExp(hashtagsList);
  const hasNoDuplicates = validateNoDuplicateItem(hashtagsList);
  const validationResult = isHashtagsListLengthValid && isRegExpValid && hasNoDuplicates;
  return validationResult;
};


//Управляем процентом увеличения картинки
const controlScale = (evt) => {
  evt.preventDefault();
  const current = Number(scaleValue.value.split('%')[0]);
  if (evt.target.matches(ZOOM_CONTROL_BUTTON_CLASS.REDUCE)&& current > ZOOM.MIN) {
    scaleValue.value = `${current - ZOOM.STEP}%`;
  } if (evt.target.matches(ZOOM_CONTROL_BUTTON_CLASS.INCREASE)&& current < ZOOM.MAX) {
    scaleValue.value = `${current + ZOOM.STEP}%`;
  }
};

//Проверяем, что нажата кнопка Escape, и не в фокусе поле хештегов или описания
function closeFormKeydown (evt) {
  if (isEscapeKey(evt) && evt.target !== descriptionField && evt.target !== hashtagsField) {
    closeForm(evt);
  }
}

//Коллбек обработчика событий закрытия формы отправки кнопкой Escape
const onZoomControlButtonClick = (evt) => {
  controlScale(evt);
};

//Коллбек обработчика событий закрытия формы отправки кнопкой Escape
const onFormEscKeydown = (evt) => {
  closeFormKeydown(evt);
};

//Коллбек обработчика события отправки формы
const formSubmitHandler = (evt) => {
  submitForm(evt);
};

//Коллбек обработчика событий закрытия формы
const onCloseButtonClick = (evt) => {
  closeForm(evt);
};


//Закрываем форму загрузки фотографий
function closeForm (evt) {
  evt.preventDefault();
  uploadFormOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  uploadFile.value = '';
  descriptionField.value = '';
  hashtagsField.value = '';
  closeButton.removeEventListener('click', onCloseButtonClick);
  uploadForm.removeEventListener('submit', formSubmitHandler);
  document.removeEventListener('keydown', onFormEscKeydown);
  scaleBlock.removeEventListener('click', onZoomControlButtonClick);
  formValidation.reset();
}

// Отправляем форму и проводим валидацию
function submitForm (evt) {
  if(!formValidation.validate()) {
    evt.preventDefault();
    hashtagsField.value = '';
  } else {
    body.classList.remove('modal-open');
    closeButton.removeEventListener('click', onCloseButtonClick);
    uploadForm.removeEventListener('submit', formSubmitHandler);
    document.removeEventListener('keydown', onFormEscKeydown);
    scaleBlock.removeEventListener('click', onZoomControlButtonClick);
  }
}

//Открываем форму загрузки изображения
const openUploadForm = () => {
  uploadFormOverlay.classList.remove('hidden');
  closeButton.addEventListener('click', onCloseButtonClick);
  uploadForm.addEventListener('submit', formSubmitHandler);
  document.addEventListener('keydown', onFormEscKeydown);
  scaleBlock.addEventListener('click', onZoomControlButtonClick);
  body.classList.add('modal-open');
  formValidation.addValidator(hashtagsField, validateHashtags, ERROR_MESSAGE.HASHTAG_VALIDATION);
  formValidation.addValidator(descriptionField, validateDescriptionLength, ERROR_MESSAGE.DESCRIPTION_LENGTH);
};

export {openUploadForm};
