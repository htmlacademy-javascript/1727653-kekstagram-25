import {isEscapeKey} from './utils.js';
import {ONE_TIME_BIG_PICTURE_COMMENTS} from './constant.js';


const bigPicture = document.querySelector('.big-picture');
const bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');
const urlBigPicture = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const commentList = bigPicture.querySelector('.social__comments');
const description = bigPicture.querySelector('.social__caption');
const commentTemplate = document.querySelector('#comment').content.querySelector('.social__comment');
const picturesContainer = document.querySelector('.pictures');
const body = document.querySelector('body');
const commentsNumberView = document.querySelector('.social__comment-count');
const commentsLoaderButton = document.querySelector('.comments-loader');
let commentsNumber = 0;
let photosList = [];
let commentsContent = [];

//Проверяем, что нажали Escape для закрытия окна, и вызываем функцию закрытия окна
const onBigPictureEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    closeBigPicture(evt);
  }
};

//Функция реакция по нажатию на кнопку cancel
const onBigPictureCancelClick = (evt) => {
  closeBigPicture(evt);
};

//Показываем коментарии к большой картинке
const showComments = (comments, number) => {
  //const finishIndex = commentsNumber + number - 1;
  for (let i = commentsNumber; number >= 1 ; i++) {
    if (i >= comments.length) {
      commentsLoaderButton.classList.add('hidden');
      break;
    }
    const commentElement = commentTemplate.cloneNode(true);
    commentElement.querySelector('img').src = comments[i].avatar;
    commentElement.querySelector('img').alt = comments[i].name;
    commentElement.querySelector('p').textContent = comments[i].message;
    commentList.appendChild(commentElement);
    number--;
    commentsNumber++;
    if (i + 1>= comments.length) {
      commentsLoaderButton.classList.add('hidden');
      break;
    }
  }
  commentsNumberView.innerHTML = `${commentsNumber} из <span class="comments-count">${comments.length}</span> комментариев`;
};


//Добавляем атрибуты для окна с большой картинкой
const addBigPictureAttributes = (photo) =>{
  urlBigPicture.src = photo.url;
  urlBigPicture.alt = photo.description;
  likesCount.textContent = photo.likes;
  description.textContent = photo.description;
  commentsCount.textContent = photo.comments.length;
  commentList.innerHTML = '';
  commentsNumber = 0;
  commentsContent = photo.comments;
  if (commentsContent.length > ONE_TIME_BIG_PICTURE_COMMENTS) {
    commentsLoaderButton.classList.remove('hidden');
  }
  showComments(commentsContent, ONE_TIME_BIG_PICTURE_COMMENTS);
};

//Функция обработчика событий по реакции на нажатие кнопки добавить коментариев на большой картинке
const onAddCoommentsButtonClick = (evt) => {
  evt.preventDefault();
  showComments(commentsContent, ONE_TIME_BIG_PICTURE_COMMENTS);
};

//Функция обработчика событий по реакции на нажатие на картинку в галерее
const onGalleryPictureClick = (evt) =>{
  if (!evt.target.matches('.picture__img')) {
    return;
  }
  evt.preventDefault();
  const id = evt.target.id;
  const index = id - 1;
  addBigPictureAttributes(photosList[index]);
  bigPicture.classList.remove('hidden');
  bigPictureCancel.addEventListener('click',  onBigPictureCancelClick);
  document.addEventListener('keydown', onBigPictureEscKeydown);
  commentsLoaderButton.addEventListener('click',  onAddCoommentsButtonClick);
  body.classList.add('modal-open');
};

// Добавляем обработчик событий на галерею для открытия большой картинки
const openBigPicture = (photos) => {
  photosList = [];
  commentsContent = [];
  photosList = photos;
  picturesContainer.addEventListener('click', onGalleryPictureClick);
};

//Закрываем большое окно
function closeBigPicture (evt) {
  evt.preventDefault();
  document.removeEventListener('keydown', onBigPictureEscKeydown);
  bigPictureCancel.removeEventListener('click',  onBigPictureCancelClick);
  commentsLoaderButton.removeEventListener('click',  onAddCoommentsButtonClick);
  commentsLoaderButton.classList.add('hidden');
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
}

export {openBigPicture};
