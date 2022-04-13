import {isEscapeKey} from './utils.js';
import {ONE_TIME_BIG_PICTURE_COMMENTS} from './constant.js';


const bigPicture = document.querySelector('.big-picture');
const bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');
const imgBigPicture = bigPicture.querySelector('.big-picture__img img');
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
let photos = [];
let comments = [];

//Проверяем, что нажали Escape для закрытия окна, и вызываем функцию закрытия окна
const onBigPictureEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeBigPicture();
  }
};

//Функция реакция по нажатию на кнопку cancel
const onBigPictureCancelClick = (evt) => {
  evt.preventDefault();
  closeBigPicture();
};

//Отрисовываем один коментарий
const showOneComment = (commentIndex) => {
  const commentElement = commentTemplate.cloneNode(true);
  commentElement.querySelector('img').src = comments[commentIndex].avatar;
  commentElement.querySelector('img').alt = comments[commentIndex].name;
  commentElement.querySelector('p').textContent = comments[commentIndex].message;
  commentList.appendChild(commentElement);
  commentsNumber++;
};

//Показываем коментарии к большой картинке
const showMoreComments = () => {
  const startCommentIndex = commentsNumber - 1;
  let numberCommentsToShow = ONE_TIME_BIG_PICTURE_COMMENTS;
  for (let i = startCommentIndex; numberCommentsToShow >= 1 ; i++) {
    showOneComment(i);
    numberCommentsToShow--;
    if (commentsNumber>= comments.length) {
      commentsLoaderButton.classList.add('hidden');
      break;
    }
  }
  commentsNumberView.innerHTML = `${commentsNumber} из <span class="comments-count">${comments.length}</span> комментариев`;
};


//Добавляем атрибуты для окна с большой картинкой
const addBigPictureAttributes = (photo) =>{
  imgBigPicture.src = photo.url;
  imgBigPicture.alt = photo.description;
  likesCount.textContent = photo.likes;
  description.textContent = photo.description;
  commentsCount.textContent = photo.comments.length;
  commentList.innerHTML = '';
  commentsNumber = 0;
  comments = photo.comments;
  for (let i = 0; ONE_TIME_BIG_PICTURE_COMMENTS > commentsNumber ; i++) {
    showOneComment(i);
  }
  commentsNumberView.innerHTML = `${commentsNumber} из <span class="comments-count">${comments.length}</span> комментариев`;
  if (comments.length > ONE_TIME_BIG_PICTURE_COMMENTS) {
    commentsLoaderButton.classList.remove('hidden');
  }
};

//Функция обработчика событий по реакции на нажатие кнопки добавить коментариев на большой картинке
const onAddCoommentsButtonClick = (evt) => {
  evt.preventDefault();
  showMoreComments();
};

//Функция обработчика событий по реакции на нажатие на картинку в галерее
const onGalleryPictureClick = (evt) =>{
  if (!evt.target.matches('.picture__img')) {
    return;
  }
  evt.preventDefault();
  const id = evt.target.id;
  const index = id - 1;
  addBigPictureAttributes(photos[index]);
  bigPicture.classList.remove('hidden');
  bigPictureCancel.addEventListener('click',  onBigPictureCancelClick);
  document.addEventListener('keydown', onBigPictureEscKeydown);
  commentsLoaderButton.addEventListener('click',  onAddCoommentsButtonClick);
  body.classList.add('modal-open');
};

// Добавляем обработчик событий на галерею для открытия большой картинки
const openBigPicture = (pictures) => {
  photos = [];
  comments = [];
  photos = pictures;
  picturesContainer.addEventListener('click', onGalleryPictureClick);
};

//Закрываем большое окно
function closeBigPicture () {
  document.removeEventListener('keydown', onBigPictureEscKeydown);
  bigPictureCancel.removeEventListener('click',  onBigPictureCancelClick);
  commentsLoaderButton.removeEventListener('click',  onAddCoommentsButtonClick);
  commentsLoaderButton.classList.add('hidden');
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
}

export {openBigPicture};
