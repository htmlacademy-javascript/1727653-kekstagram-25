import {createPhotos} from './offer.js';
import {PHOTO_ARRAY_COUNT, START_ID} from './constant.js';
import {createGallery} from './gallery.js';
import {openUploadForm} from './upload-form.js';


const photos = createPhotos(PHOTO_ARRAY_COUNT, START_ID);
createGallery(photos);

document.querySelector('#upload-file').addEventListener('change', openUploadForm);

export {photos};

