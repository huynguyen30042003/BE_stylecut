const express = require('express');
const { upload, display, update, delete: deleteImage } = require('../config/multer');
const router = express.Router();

router.get('/:name', display);
router.post('/', upload);
router.put('/:name', update);
router.delete('/:name', deleteImage);

module.exports = router;
