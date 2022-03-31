import {getRandomPositiveInteger, getRandomArrayElement} from './utils.js';
import {START_ID} from './constant.js';
import {NAMES, COMMENTS, DESCRIPTIONS} from './mocks.js';

const getComment = (id) => {
  const comment = {
    id: id,
    avatar: `img/avatar-${getRandomPositiveInteger(1, 6)}.svg`,
    message: getRandomArrayElement(COMMENTS),
    name: getRandomArrayElement(NAMES),
  };
  return comment;
};

const createComments = (count, id) => {
  const comments = Array.from({length: count}, () => {
    id++;
    return getComment(id);
  });
  return comments;
};

const getPhoto = (id) => {
  const photo = {
    id: id,
    url: `photos/${id}.jpg`,
    description: getRandomArrayElement(DESCRIPTIONS),
    likes: getRandomPositiveInteger(15, 200),
    comments: createComments(getRandomPositiveInteger(1, 10), START_ID),
  };
  return photo;
};

const createPhotos = (count, id) => Array.from({length: count}, () => {
  id++;
  return getPhoto(id);
});

export {createPhotos};
