import {photos} from './main.js';
import {isEscapeKey} from './utils.js';

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

//Закрываем большое окно
function closeBigPicture (evt)  {
  evt.preventDefault();
  bigPicture.classList.add('hidden');
  bigPictureCancel.removeEventListener('click',  closeBigPicture);
  document.removeEventListener('keydown', closeBigPictureEscKeydown);
  body.classList.remove('modal-open');
}

//Проверяем, что нажали Escape для закрытия окна, и вызываем функцию закрытия окна
function closeBigPictureEscKeydown (evt)  {
  if (isEscapeKey(evt)) {
    closeBigPicture(evt);
  }
}

//Добавляем атрибуты для окна с большой картинкой
const addBigPictureAttributes = (index) =>{
  urlBigPicture.src = photos[index].url;
  urlBigPicture.alt = photos[index].description;
  likesCount.textContent = photos[index].likes;
  description.textContent = photos[index].description;
  commentsCount.textContent = photos[index].comments.length;
  commentList.innerHTML = '';
  photos[index].comments.forEach((comment)=> {
    const commentElement = commentTemplate.cloneNode(true);
    commentElement.querySelector('img').src = comment.avatar;
    commentElement.querySelector('img').alt = comment.name;
    commentElement.querySelector('p').textContent = comment.message;
    commentList.appendChild(commentElement);
  });
};


// Добаввляем обработчик событий на галерею для открытия большой картинки
const openBigPicture = () => {
  picturesContainer.addEventListener('click', (evt) => {
    evt.preventDefault();
    if (evt.target.matches('.picture__img')) {
      const id = evt.target.id;
      const index = id - 1;
      addBigPictureAttributes(index);
      bigPicture.classList.remove('hidden');
      bigPictureCancel.addEventListener('click',  closeBigPicture);
      document.addEventListener('keydown', closeBigPictureEscKeydown);
      document.querySelector('.social__comment-count').classList.add('hidden');
      document.querySelector('.comments-loader').classList.add('hidden');
      body.classList.add('modal-open');
    }
  });
};


export {openBigPicture};
