const ErrorMessage = { HASHTAG_VALIDATION: 'ХешТег введен неверно', DESCRIPTION_LENGTH: 'Максимальная длина 140 символов',
  UPLOAD_ERROR: 'Не удалось получить данные. Попробуйте ещё раз' };

const MAX_HASHTAG_COUNT = 5;
const ZoomRange = { MAX: 100, MIN: 25, STEP: 25, DEFAULT: 100 };
const SliderDefaultEffect = { MAX: 100, MIN: 0, STEP: 1, START: 100 };
const SliderChromeEffect = { MAX: 1, MIN: 0, STEP: 0.1, START: 1 };
const SliderSepiaEffect = { MAX: 1, MIN: 0, STEP: 0.1, START: 1 };
const SliderMarvinEffect = { MAX: 100, MIN: 0, STEP: 1, START: 100 };
const SliderPhobosEffect = { MAX: 3, MIN: 0, STEP: 0.1, START: 3 };
const SliderHeatEffect = { MAX: 3, MIN: 1, STEP: 0.1, START: 3 };
const EffectName = { NONE: 'none', CHROME: 'chrome', SEPIA: 'sepia', MARVIN: 'marvin', PHOBOS: 'phobos', HEAT: 'heat' };
const EffectClassName = { NONE: 'effects__preview--none', CHROME: 'effects__preview--chrome', SEPIA: 'effects__preview--sepia',
  MARVIN: 'effects__preview--marvin', PHOBOS: 'effects__preview--phobos', HEAT: 'effects__preview--heat' };

const SubmitUploadFormButtonText = { SEND: 'Отправить', WAIT: 'Отправка...' };
const DESCRIPTION_LENGTH_FIELD = 140;
const ZoomControlButtonClass = { REDUCE: '.scale__control--smaller', INCREASE: '.scale__control--bigger' };
const ACTIVE_FILTER_BUTTON_CLASS = 'img-filters__button--active';
const HASHTAG_MASK = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;
const DEFAULT_COMMENT_NUMBER = 0;
const BIG_PICTURE_COMMENT_LIMIT = 5;
const MESSAGE_SHOW_TIME = 5000;
const ServerAddress = { GET: 'https://25.javascript.pages.academy/kekstagram/data', POST: 'https://25.javascript.pages.academy/kekstagram' };
const UploadStatusMessage = { ERROR: 'error', SUCCESS: 'success' };
const RENDER_DELAY = 500;
const RANDOM_PHOTOS_COUNT = 10;
const FILE_EXTENSIONS = ['jpg', 'jpeg', 'png'];

export {SubmitUploadFormButtonText, ACTIVE_FILTER_BUTTON_CLASS, FILE_EXTENSIONS, RANDOM_PHOTOS_COUNT, RENDER_DELAY, UploadStatusMessage, EffectClassName, EffectName, DEFAULT_COMMENT_NUMBER, ServerAddress, MESSAGE_SHOW_TIME, SliderHeatEffect, SliderPhobosEffect,
  SliderMarvinEffect, SliderSepiaEffect, SliderChromeEffect, SliderDefaultEffect, BIG_PICTURE_COMMENT_LIMIT, HASHTAG_MASK, ZoomControlButtonClass,
  ErrorMessage, MAX_HASHTAG_COUNT, ZoomRange, DESCRIPTION_LENGTH_FIELD};
