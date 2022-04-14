import {isEscapeKey, showUploadMessage} from './utils.js';
import {EffectClassName, EffectName, SliderHeatEffect, SliderPhobosEffect, SliderMarvinEffect, SliderSepiaEffect, SliderChromeEffect, SliderDefaultEffect, ErrorMessage, MAX_HASHTAG_COUNT, ZoomRange, DESCRIPTION_LENGTH_FIELD, ZoomControlButtonClass, HASHTAG_MASK} from './constant.js';
import {sendData} from './server-data-exchange.js';
const uploadForm = document.querySelector('#upload-select-image');
const scaleBlock = uploadForm.querySelector('.img-upload__scale');
const imgPreviewPhoto = uploadForm.querySelector('.img-upload__preview img');
const scaleValue = uploadForm.querySelector('.scale__control--value');
const uploadFormOverlay = uploadForm.querySelector('.img-upload__overlay');
const closeButton = uploadForm.querySelector('#upload-cancel');
const uploadFile = uploadForm.querySelector('#upload-file');
const descriptionField = uploadForm.querySelector('.text__description');
const hashtagsField = uploadForm.querySelector('.text__hashtags');
const effectsList = uploadForm.querySelector('.effects__list');
const sliderValueInput = uploadForm.querySelector('.effect-level__value');
const slider = uploadForm.querySelector('.effect-level__slider');
const sliderContainer = uploadForm.querySelector('.img-upload__effect-level');
const effectNoneInput = uploadForm.querySelector('#effect-none');
const submitButton = uploadForm.querySelector('.img-upload__submit');
const successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
const errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');
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

//Блокируем кнопку отправить
const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Отправка...';
};

//Разблокируем кнопку отправить
const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Отправить';
};

//Обработчик события нажатия на кнопку отправить
const onSubmitForm = (evt) => {
  evt.preventDefault();
  const formData = new FormData(evt.target);
  const isValid = formValidation.validate();
  if (isValid) {
    blockSubmitButton();
    sendData(
      () => {
        closeForm();
        unblockSubmitButton();
        showUploadMessage('success', successMessageTemplate, body);
      },
      () => {
        closeForm();
        unblockSubmitButton();
        showUploadMessage('error', errorMessageTemplate, body);

      },
      formData
    );
  }
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

//Коллбек обработчика событий закрытия формы отправки кнопкой Escape
const onZoomControlButtonClick = (evt) => {
  evt.preventDefault();
  let scale = Number(scaleValue.value.split('%')[0]);
  if (evt.target.matches(ZoomControlButtonClass.REDUCE)&& scale > ZoomRange.MIN) {
    scale = scale - ZoomRange.STEP;
    scaleValue.value = `${scale}%`;
    imgPreviewPhoto.style.transform = `scale(${scale/100})`;
  } if (evt.target.matches(ZoomControlButtonClass.INCREASE)&& scale < ZoomRange.MAX) {
    scale = scale + ZoomRange.STEP;
    scaleValue.value = `${scale}%`;
    imgPreviewPhoto.style.transform = `scale(${scale/100})`;
  }
};

//Коллбек обработчика событий закрытия формы отправки кнопкой Escape
const onFormEscKeydown = (evt) => {
  if (isEscapeKey(evt) && evt.target !== descriptionField && evt.target !== hashtagsField) {
    evt.preventDefault();
    closeForm();
  }
};

//Коллбек обработчика событий закрытия формы
const onCloseButtonClick = (evt) => {
  evt.preventDefault();
  closeForm();
};

//Создаем слайдер
const createEffectSlider = () => {
  noUiSlider.create(slider, {
    range: {
      min: SliderDefaultEffect.MIN,
      max: SliderDefaultEffect.MAX,
    },
    start: SliderDefaultEffect.START,
    step: SliderDefaultEffect.STEP,
    connect: 'lower',
    format: {
      to: function (value) {
        if (Number.isInteger(value)) {
          return value.toFixed(0);
        }
        return value.toFixed(0);
      },
      from: function (value) {
        return parseFloat(value);
      },
    },
  });

  sliderContainer.classList.add('hidden');

  slider.noUiSlider.on('update', () => {
    sliderValueInput.value = slider.noUiSlider.get();
    switch (imgPreviewPhoto.className) {
      case EffectClassName.NONE:
        imgPreviewPhoto.style.filter = 'none';
        sliderContainer.classList.add('hidden');
        break;
      case EffectClassName.CHROME:
        imgPreviewPhoto.style.filter = `grayscale(${sliderValueInput.value})`;
        sliderContainer.classList.remove('hidden');
        break;
      case EffectClassName.SEPIA:
        imgPreviewPhoto.style.filter = `sepia(${sliderValueInput.value})`;
        sliderContainer.classList.remove('hidden');
        break;
      case EffectClassName.MARVIN:
        imgPreviewPhoto.style.filter = `invert(${sliderValueInput.value}%)`;
        sliderContainer.classList.remove('hidden');
        break;
      case EffectClassName.PHOBOS:
        imgPreviewPhoto.style.filter = `blur(${sliderValueInput.value}px)`;
        sliderContainer.classList.remove('hidden');
        break;
      case EffectClassName.HEAT:
        imgPreviewPhoto.style.filter = `brightness(${sliderValueInput.value})`;
        sliderContainer.classList.remove('hidden');
    }
  });
};

//Управляем эффектами через слайдер
const onUpdateEffect = (evt) => {
  if (evt.target.matches('input[type="radio"]')) {
    imgPreviewPhoto.className = '';
    imgPreviewPhoto.classList.add(`effects__preview--${evt.target.value}`);

    switch (evt.target.value) {
      case EffectName.NONE:
        imgPreviewPhoto.style.filter = 'none';
        slider.noUiSlider.updateOptions({
          range: {
            min: SliderDefaultEffect.MIN,
            max: SliderDefaultEffect.MAX,
          },
          start: SliderDefaultEffect.START,
          step: SliderDefaultEffect.STEP,
          format: {
            to: (value) => {
              if (Number.isInteger(value)) {
                return value.toFixed(0);
              }
              return value.toFixed(0);
            },
            from: (value) => parseFloat(value)
          },
        });
        return true;

      case EffectName.CHROME:
        slider.noUiSlider.updateOptions({
          range: {
            min: SliderChromeEffect.MIN,
            max: SliderChromeEffect.MAX,
          },
          start: SliderChromeEffect.START,
          step: SliderChromeEffect.STEP,
          format: {
            to: (value) => {
              if (Number.isInteger(value)) {
                return value.toFixed(0);
              }
              return value.toFixed(1);
            },
            from: (value) => parseFloat(value)
          },
        });

        return true;

      case EffectName.SEPIA:
        slider.noUiSlider.updateOptions({
          range: {
            min: SliderSepiaEffect.MIN,
            max: SliderSepiaEffect.MAX,
          },
          start: SliderSepiaEffect.START,
          step: SliderSepiaEffect.STEP,
          format: {
            to: (value) => {
              if (Number.isInteger(value)) {
                return value.toFixed(0);
              }
              return value.toFixed(1);
            },
            from: (value) => parseFloat(value)
          },
        });

        return true;

      case EffectName.MARVIN:
        slider.noUiSlider.updateOptions({
          range: {
            min: SliderMarvinEffect.MIN,
            max: SliderMarvinEffect.MAX,
          },
          start: SliderMarvinEffect.START,
          step: SliderMarvinEffect.STEP,
          format: {
            to: (value) => {
              if (Number.isInteger(value)) {
                return value.toFixed(0);
              }
              return value.toFixed(0);
            },
            from: (value) => parseFloat(value)
          },
        });

        return true;

      case EffectName.PHOBOS:
        slider.noUiSlider.updateOptions({
          range: {
            min: SliderPhobosEffect.MIN,
            max: SliderPhobosEffect.MAX,
          },
          start: SliderPhobosEffect.START,
          step: SliderPhobosEffect.STEP,
          format: {
            to: (value) => {
              if (Number.isInteger(value)) {
                return value.toFixed(0);
              }
              return value.toFixed(1);
            },
            from: (value) => parseFloat(value)
          },
        });

        return true;

      case EffectName.HEAT:
        slider.noUiSlider.updateOptions({
          range: {
            min: SliderHeatEffect.MIN,
            max: SliderHeatEffect.MAX,
          },
          start: SliderHeatEffect.START,
          step: SliderHeatEffect.STEP,
          format: {
            to: (value) => {
              if (Number.isInteger(value)) {
                return value.toFixed(0);
              }
              return value.toFixed(1);
            },
            from: (value) => parseFloat(value)
          },
        });

        return true;
    }
  }
};

//Закрываем форму загрузки фотографий
function closeForm () {
  uploadFormOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  uploadFile.value = '';
  descriptionField.value = '';
  hashtagsField.value = '';
  scaleValue.value = `${ZoomRange.DEFAULT}%`;
  imgPreviewPhoto.className = '';
  imgPreviewPhoto.style.transform = `scale(${ZoomRange.DEFAULT/100})`;
  imgPreviewPhoto.style.filter = 'none';
  sliderValueInput.value = '';
  effectNoneInput.checked = true;
  closeButton.removeEventListener('click', onCloseButtonClick);
  uploadForm.removeEventListener('submit', onSubmitForm);
  document.removeEventListener('keydown', onFormEscKeydown);
  scaleBlock.removeEventListener('click', onZoomControlButtonClick);
  effectsList.removeEventListener('change', onUpdateEffect);
  slider.noUiSlider.destroy();
  formValidation.reset();
}

//Открываем форму загрузки изображения
const openUploadForm = () => {
  uploadFormOverlay.classList.remove('hidden');
  closeButton.addEventListener('click', onCloseButtonClick);
  uploadForm.addEventListener('submit', onSubmitForm);
  //submitButton.addEventListener('click', onSubmitButtonClick);
  document.addEventListener('keydown', onFormEscKeydown);
  scaleBlock.addEventListener('click', onZoomControlButtonClick);
  body.classList.add('modal-open');
  formValidation.addValidator(hashtagsField, validateHashtags, ErrorMessage.HASHTAG_VALIDATION);
  formValidation.addValidator(descriptionField, validateDescriptionLength, ErrorMessage.DESCRIPTION_LENGTH);
  effectsList.addEventListener('change', onUpdateEffect);

  if (!slider.noUiSlider) {
    createEffectSlider();
  }
};

export {openUploadForm};
