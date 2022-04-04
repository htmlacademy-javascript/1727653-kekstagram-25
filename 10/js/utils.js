const getRandomPositiveInteger = (a, b) => {
  const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
  const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

const getRandomArrayElement = (elements) => {
  const element = elements[getRandomPositiveInteger(0, elements.length - 1)];
  return element;
};

const isEscapeKey = (evt) =>  evt.key === 'Escape';

export {getRandomPositiveInteger, getRandomArrayElement, isEscapeKey};
