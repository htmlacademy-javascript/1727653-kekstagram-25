import {ErrorMessage} from './constant.js';
import {createGallery, addFiltersListeners} from './gallery.js';
import {onUploadFormChange} from './upload-form.js';
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

addFiltersListeners();

document.querySelector('#upload-file').addEventListener('change', onUploadFormChange);
