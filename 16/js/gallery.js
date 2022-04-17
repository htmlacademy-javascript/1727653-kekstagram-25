import { showBigPicture } from './big-picture-modal.js';
import { getRandomPositiveInteger, debounce } from './utils.js';
import { NUMBER_RANDOM_COUNT, RENDER_DELAY } from './constant.js';

const picturesList = document.querySelector('.pictures');
const picturesListFragment = document.createDocumentFragment();
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
const previewFilterElement = document.querySelector('.img-filters');
const previewFilterButtons = document.querySelectorAll('.img-filters__button');
const defaultPreviewFilter = document.querySelector('#filter-default');
const randomPreviewFilter = document.querySelector('#filter-random');
const discussedPreviewFilter = document.querySelector('#filter-discussed');
let photosFromServer = []; //массив фоток с сервера
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
const createPictureElement = (id, url, description, likes, comments) => {
  const picture = pictureTemplate.cloneNode(true);
  picture.querySelector('.picture__img').id = id;
  picture.querySelector('.picture__img').src = url;
  picture.querySelector('.picture__img').alt = description;
  picture.querySelector('.picture__likes').textContent = likes;
  picture.querySelector('.picture__comments').textContent = comments.length;
  return picture;
};

//Создаем галерею и навешиваем обработчик через делегирование на открытиебольшой картинки
const createGallery = (pictures) => {
  photosFromServer = pictures.slice();
  photos = pictures.slice();
  pictures.forEach(({id, url, description, likes, comments}) => {
    const pictureElement = createPictureElement(id, url, description, likes, comments);
    picturesListFragment.appendChild(pictureElement);
  });
  picturesList.appendChild(picturesListFragment);
  picturesList.addEventListener('click', onGalleryPictureClick);
};

//Создаем фильтрованную галерею
const createFilteredGallery = (pictures) => {
  pictures.forEach(({id, url, description, likes, comments}) => {
    const pictureElement = createPictureElement(id, url, description, likes, comments);
    picturesListFragment.appendChild(pictureElement);
  });
  picturesList.appendChild(picturesListFragment);
};

//Удаляем картинки из галереи перед показом фильтрованных картинок
const removeAllPictures = () => {
  const picture = document.querySelectorAll('a.picture');
  picture.forEach((element) => element.remove());
};

//Показываем фотки с сервера в исходном виде
const onDefaultFilterButtonClick = (evt) => {
  evt.preventDefault();
  const pictures = photosFromServer.slice();

  removeAllPictures();

  previewFilterButtons.forEach((element) => element.classList.remove('img-filters__button--active'));
  evt.target.classList.add('img-filters__button--active');
  photos = pictures.slice();

  createFilteredGallery(pictures);
};

//Показываем 10 случайных
const onRandomPreviewFilterButtonClick = (evt) => {
  evt.preventDefault();
  const pictures = photosFromServer.slice();
  const photosRandom = [];

  for (let i = 0; i < NUMBER_RANDOM_COUNT; i++) {
    const index = getRandomPositiveInteger(0, pictures.length - 1);
    photosRandom[i] = pictures[index];
    pictures.splice(index, 1);
  }

  removeAllPictures();

  previewFilterButtons.forEach((element) => element.classList.remove('img-filters__button--active'));
  evt.target.classList.add('img-filters__button--active');
  photos = photosRandom.slice();

  createFilteredGallery(photosRandom);
};

//Показываем самые обсуждаемые фотографии
const onDiscussedPreviewsButtonClick = (evt) => {
  evt.preventDefault();
  const pictures = photosFromServer.slice();
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

  previewFilterButtons.forEach((element) => element.classList.remove('img-filters__button--active'));
  evt.target.classList.add('img-filters__button--active');
  photos = pictures.slice();

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
  discussedPreviewFilter.addEventListener('click', debounce(
    onDiscussedPreviewsButtonClick,
    RENDER_DELAY,
  ));
};

export {createGallery, addFiltersListeners};
