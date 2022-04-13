import {isEscapeKey} from './utils.js';
import {SliderHeatEffect, SliderPhobosEffect, SliderMarvinEffect, SliderSepiaEffect, SliderChromeEffect, SliderDefaultEffect, ErrorMessage, MAX_HASHTAG_COUNT, ZoomRange, DESCRIPTION_LENGTH_FIELD, ZoomControlButtonClass, HASHTAG_MASK} from './constant.js';
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
      case 'effects__preview--none':
        imgPreviewPhoto.style.filter = 'none';
        sliderContainer.classList.add('hidden');
        break;
      case 'effects__preview--chrome':
        imgPreviewPhoto.style.filter = `grayscale(${sliderValueInput.value})`;
        sliderContainer.classList.remove('hidden');
        break;
      case 'effects__preview--sepia':
        imgPreviewPhoto.style.filter = `sepia(${sliderValueInput.value})`;
        sliderContainer.classList.remove('hidden');
        break;
      case 'effects__preview--marvin':
        imgPreviewPhoto.style.filter = `invert(${sliderValueInput.value}%)`;
        sliderContainer.classList.remove('hidden');
        break;
      case 'effects__preview--phobos':
        imgPreviewPhoto.style.filter = `blur(${sliderValueInput.value}px)`;
        sliderContainer.classList.remove('hidden');
        break;
      case 'effects__preview--heat':
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
      case 'none':
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

      case 'chrome':
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

      case 'sepia':
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

      case 'marvin':
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

      case 'phobos':
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

      case 'heat':
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
function closeForm (evt) {
  evt.preventDefault();
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
  uploadForm.removeEventListener('submit', formSubmitHandler);
  document.removeEventListener('keydown', onFormEscKeydown);
  scaleBlock.removeEventListener('click', onZoomControlButtonClick);
  effectsList.removeEventListener('change', onUpdateEffect);
  slider.noUiSlider.destroy();
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
    effectsList.removeEventListener('change', onUpdateEffect);
    slider.noUiSlider.destroy();
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
  formValidation.addValidator(hashtagsField, validateHashtags, ErrorMessage.HASHTAG_VALIDATION);
  formValidation.addValidator(descriptionField, validateDescriptionLength, ErrorMessage.DESCRIPTION_LENGTH);
  effectsList.addEventListener('change', onUpdateEffect);

  if (!slider.noUiSlider) {
    createEffectSlider();
  }
};

export {openUploadForm};
