const PHOTO_COUNT = 25;
const START_ID = 0;
const ErrorMessage = { HASHTAG_VALIDATION: 'ХешТег введен неверно', DESCRIPTION_LENGTH: 'Максимальная длина 140 символов' };
const MAX_HASHTAG_COUNT = 5;
const ZoomRange = { MAX: 100, MIN: 25, STEP: 25, DEFAULT: 100 };
const SliderDefaultEffect = { MAX: 100, MIN: 0, STEP: 1, START: 100 };
const SliderChromeEffect = { MAX: 1, MIN: 0, STEP: 0.1, START: 1 };
const SliderSepiaEffect = { MAX: 1, MIN: 0, STEP: 0.1, START: 1 };
const SliderMarvinEffect = { MAX: 100, MIN: 0, STEP: 1, START: 100 };
const SliderPhobosEffect = { MAX: 3, MIN: 0, STEP: 0.1, START: 3 };
const SliderHeatEffect = { MAX: 3, MIN: 1, STEP: 0.1, START: 3 };
const DESCRIPTION_LENGTH_FIELD = 140;
const ZoomControlButtonClass = { REDUCE: '.scale__control--smaller', INCREASE: '.scale__control--bigger' };
const HASHTAG_MASK = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;
const ONE_TIME_BIG_PICTURE_COMMENTS = 5;

export {SliderHeatEffect, SliderPhobosEffect, SliderMarvinEffect, SliderSepiaEffect, SliderChromeEffect, SliderDefaultEffect, ONE_TIME_BIG_PICTURE_COMMENTS, HASHTAG_MASK, ZoomControlButtonClass, PHOTO_COUNT, START_ID, ErrorMessage, MAX_HASHTAG_COUNT, ZoomRange, DESCRIPTION_LENGTH_FIELD};
