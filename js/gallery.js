import { showBigPicture } from './big-picture-modal.js';
import { getRandomPositiveInteger, debounce } from './utils.js';
import { RANDOM_PHOTOS_COUNT, RENDER_DELAY, ACTIVE_FILTER_BUTTON_CLASS } from './constant.js';

const picturesList = document.querySelector('.pictures');
const picturesListFragment = document.createDocumentFragment();
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
const previewFilterElement = document.querySelector('.img-filters');
const previewFilterButtons = document.querySelectorAll('.img-filters__button');
const defaultPreviewFilter = document.querySelector('#filter-default');
const randomPreviewFilter = document.querySelector('#filter-random');
const commentsPreviewFilter = document.querySelector('#filter-discussed');
let serverPhotos = []; //массив фоток с сервера
let photos = []; //рабочий массив фоток

//Обрабатываем событие и ловим id, по нему ищем фотку и вызываем функцию открытия большого окна
const onGalleryPictureClick = (evt) =>{
  if (!evt.target.matches('.picture__img')) {
    return;
  }
  evt.preventDefault();
  showBigPicture(photos[photos.findIndex(
    (photo) =>
      photo.id === Number(evt.target.id))]);
};

//Создаем и изменяем параметры HTML фотографии
const createPictureElements = (pictures) => {
  pictures.forEach(({id, url, description, likes, comments}) => {
    const picture = pictureTemplate.cloneNode(true);
    picture.querySelector('.picture__img').id = id;
    picture.querySelector('.picture__img').src = url;
    picture.querySelector('.picture__img').alt = description;
    picture.querySelector('.picture__likes').textContent = likes;
    picture.querySelector('.picture__comments').textContent = comments.length;
    picturesListFragment.appendChild(picture);
  });
};

//Создаем фильтрованную галерею
const createFilteredGallery = (pictures) => {
  createPictureElements(pictures);
  picturesList.appendChild(picturesListFragment);
};

//Удаляем картинки из галереи перед показом фильтрованных картинок
const removeAllPictures = () => {
  const pictures = document.querySelectorAll('a.picture');
  pictures.forEach((element) => element.remove());
};

//Обновляем статус кнопок фильтров
const updateFilterButtonStatus = (evt) =>{
  previewFilterButtons.forEach((element) => element.classList.remove(ACTIVE_FILTER_BUTTON_CLASS));
  evt.target.classList.add(ACTIVE_FILTER_BUTTON_CLASS);
};

//Обновляем массив фоток галереи
const updatePhotosList = (pictures) => {
  photos = pictures.slice();
};

//Показываем фотки с сервера в исходном виде
const onDefaultFilterButtonClick = (evt) => {
  evt.preventDefault();
  const pictures = serverPhotos.slice();

  removeAllPictures();

  updateFilterButtonStatus(evt);

  updatePhotosList(pictures);

  createFilteredGallery(pictures);
};

//Показываем 10 случайных
const onRandomPreviewFilterButtonClick = (evt) => {
  evt.preventDefault();
  const pictures = serverPhotos.slice();
  const randomPhotos = [];

  for (let i = 0; i < RANDOM_PHOTOS_COUNT; i++) {
    const index = getRandomPositiveInteger(0, pictures.length - 1);
    randomPhotos[i] = pictures[index];
    pictures.splice(index, 1);
  }

  removeAllPictures();

  updateFilterButtonStatus(evt);

  updatePhotosList(randomPhotos);

  createFilteredGallery(randomPhotos);
};

//Показываем самые обсуждаемые фотографии
const onCommentsPreviewsButtonClick = (evt) => {
  evt.preventDefault();
  const pictures = serverPhotos.slice();
  pictures.sort((a, b) => {
    if (a.comments > b.comments) {
      return -1;
    }
    if (a.comments < b.comments) {
      return 1;
    }

    return 0;
  });

  removeAllPictures();

  updateFilterButtonStatus(evt);

  updatePhotosList(pictures);

  createFilteredGallery(pictures);
};


//Активируем фильтры
const addFiltersListeners = () => {
  previewFilterElement.classList.remove('img-filters--inactive');
  defaultPreviewFilter.addEventListener('click', debounce(
    onDefaultFilterButtonClick,
    RENDER_DELAY,
  ));
  randomPreviewFilter.addEventListener('click', debounce(
    onRandomPreviewFilterButtonClick,
    RENDER_DELAY,
  ));
  commentsPreviewFilter.addEventListener('click', debounce(
    onCommentsPreviewsButtonClick,
    RENDER_DELAY,
  ));
};

//Создаем галерею и навешиваем обработчик через делегирование на открытиебольшой картинки
const createGallery = (pictures) => {
  serverPhotos = pictures.slice();
  photos = pictures.slice();
  createPictureElements(pictures);
  picturesList.appendChild(picturesListFragment);
  picturesList.addEventListener('click', onGalleryPictureClick);
  addFiltersListeners();
};

export {createGallery};
