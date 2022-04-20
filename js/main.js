import {ErrorMessage} from './constant.js';
import {createGallery} from './gallery.js';
import {addFormOpenButtonHandler} from './upload-form.js';
import {getData} from './api.js';
import {showDownloadMessage} from './utils.js';

getData(
  (photos) => {
    createGallery(photos);
  },
  () => {
    showDownloadMessage(ErrorMessage.UPLOAD_ERROR);
  }
);

addFormOpenButtonHandler();
