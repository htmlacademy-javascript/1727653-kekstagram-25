import {isEscapeKey} from './utils.js';
import {BIG_PICTURE_COMMENT_LIMIT, DEFAULT_COMMENT_NUMBER} from './constant.js';

const bigPicture = document.querySelector('.big-picture');
const bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');
const imgBigPicture = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const commentList = bigPicture.querySelector('.social__comments');
const description = bigPicture.querySelector('.social__caption');
const commentTemplate = document.querySelector('#comment').content.querySelector('.social__comment');
const body = document.querySelector('body');
const commentsNumberView = document.querySelector('.social__comment-count');
const commentsLoaderButton = document.querySelector('.comments-loader');
let commentsNumber = DEFAULT_COMMENT_NUMBER;
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
const showOneComment = (comment) => {
  const commentElement = commentTemplate.cloneNode(true);
  commentElement.querySelector('img').src = comment.avatar;
  commentElement.querySelector('img').alt = comment.name;
  commentElement.querySelector('p').textContent = comment.message;
  commentList.appendChild(commentElement);
  commentsNumber++;
};

//Показываем коментарии к большой картинке
const showMoreComments = () => {
  const startCommentIndex = commentsNumber - 1;
  let numberCommentsToShow = BIG_PICTURE_COMMENT_LIMIT;
  for (let i = startCommentIndex; numberCommentsToShow >= 1 ; i++) {
    showOneComment(comments[i]);
    numberCommentsToShow--;
    if (commentsNumber>= comments.length) {
      commentsLoaderButton.classList.add('hidden');
      break;
    }
  }
  commentsNumberView.textContent = `${commentsNumber} из ${comments.length} комментариев`;
};


//Добавляем атрибуты для окна с большой картинкой
const addBigPictureAttributes = (photo) =>{
  imgBigPicture.src = photo.url;
  imgBigPicture.alt = photo.description;
  likesCount.textContent = photo.likes;
  description.textContent = photo.description;
  commentsCount.textContent = photo.comments.length;
  commentList.innerHTML = '';
  commentsNumber = DEFAULT_COMMENT_NUMBER;
  comments = [];
  comments = photo.comments.slice();
  for (let i = 0; BIG_PICTURE_COMMENT_LIMIT > commentsNumber ; i++) {
    if (i >= comments.length) {
      commentsLoaderButton.classList.add('hidden');
      break;
    }
    showOneComment(comments[i]);
  }
  commentsNumberView.textContent = `${commentsNumber} из ${comments.length} комментариев`;
  if (comments.length > BIG_PICTURE_COMMENT_LIMIT) {
    commentsLoaderButton.classList.remove('hidden');
  }
};

//Функция обработчика событий по реакции на нажатие кнопки добавить коментариев на большой картинке
const onAddCoommentsButtonClick = (evt) => {
  evt.preventDefault();
  showMoreComments();
};

//Функция обработчика событий по реакции на нажатие на картинку в галерее
const showBigPicture = (photo) =>{
  addBigPictureAttributes(photo);
  bigPicture.classList.remove('hidden');
  bigPictureCancel.addEventListener('click',  onBigPictureCancelClick);
  document.addEventListener('keydown', onBigPictureEscKeydown);
  commentsLoaderButton.addEventListener('click',  onAddCoommentsButtonClick);
  body.classList.add('modal-open');
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

export {showBigPicture};
