//import {createPhotos} from './offer.js';
import {openBigPicture} from './big-picture-modal.js';
import {ErrorMessage} from './constant.js';
import {createGallery} from './gallery.js';
import {openUploadForm} from './upload-form.js';
import {getData} from './server-data-exchange.js';
import {showDownloadMessage} from './utils.js';


//const photos = createPhotos(PHOTO_COUNT, START_ID);
//createGallery(photos);
//openBigPicture(photos);

getData(
  (photos) => {
    createGallery(photos);
    openBigPicture(photos);
  },
  () => {
    showDownloadMessage(ErrorMessage.UPLOAD_ERROR);
  }
);

document.querySelector('#upload-file').addEventListener('change', openUploadForm);

//export {photos};

