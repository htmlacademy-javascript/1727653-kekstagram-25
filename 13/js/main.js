import {createPhotos} from './offer.js';
import {openBigPicture} from './big-picture-modal.js';
import {PHOTO_COUNT, START_ID} from './constant.js';
import {createGallery} from './gallery.js';
import {openUploadForm} from './upload-form.js';


const photos = createPhotos(PHOTO_COUNT, START_ID);
createGallery(photos);
openBigPicture(photos);

document.querySelector('#upload-file').addEventListener('change', openUploadForm);

export {photos};

