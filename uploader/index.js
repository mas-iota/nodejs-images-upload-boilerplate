const uploader = require('express').Router();
const multer = require('multer');
const readChunk = require('read-chunk');
const fileType = require('file-type');
const path = require('path');
const fs = require('fs');
const shortId = require('shortid');
const async = require('async');
const DiskStorage = require('./storage/disk');

const PERMITTED_IMAGES = ['image/png', 'image/jpeg', 'image/jpg'];
const MAX_IMAGE_SIZE = 1024 * 2000; // 2MB
const MAX_MULTI_IMAGES = 10;
const UPLOADS_DIR = 'public/images/uploads';

const fileFilter = (req, file, cb) => {
  if (PERMITTED_IMAGES.indexOf(file.mimetype) === -1) {
    return cb({
      code: 422,
      message: `Only ${PERMITTED_IMAGES.join(', ')} formats are allowed`
    });
  }

  return cb(null, true);
};

const deleteFiles = (files) => {
  files.forEach(file => fs.unlinkSync(path.join(__dirname, '../', file.path)));
};

const storage = new DiskStorage({
  destination: UPLOADS_DIR,
  filename(req, file) {
    return `${shortId.generate()}.${file.mimetype.split('/')[1]}`;
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_IMAGE_SIZE,
    files: 1
  },
  fileFilter
}).single('image');

const multiUpload = multer({
  storage,
  limits: {
    fileSize: MAX_IMAGE_SIZE
  },
  fileFilter
}).array('images', MAX_MULTI_IMAGES);


uploader.post('/', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(422).json({
        code: 422,
        message: err.message
      });
    }

    if (!req.file) {
      return res.status(422).json({
        code: 422,
        message: 'Image is not attached or corrupted.'
      });
    }

    const buffer = readChunk.sync(path.join(__dirname, '../', req.file.path), 0, 4100);
    const type = fileType(buffer);

    if (!type || PERMITTED_IMAGES.indexOf(type.mime) === -1) {
      fs.unlinkSync(path.join(__dirname, '../', req.file.path));

      return res.status(403).json({
        code: 403,
        message: `invalid file format: Only ${PERMITTED_IMAGES.join(', ')} formats are allowed`
      });
    }

    res.json({
      code: 200,
      data: {
        path: req.file.path.replace('public', '')
      }
    });
  });
});


uploader.post('/multi/', (req, res) => {
  multiUpload(req, res, (err) => {
    if (err) {
      return res.status(422).json({
        code: 422,
        message: err.message
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(422).json({
        code: 422,
        message: 'Images are corrupted or not attached.'
      });
    }

    async.eachSeries(req.files, (file, callback) => {
      const buffer = readChunk.sync(path.join(__dirname, '../', file.path), 0, 4100);
      const type = fileType(buffer);

      if (!type || PERMITTED_IMAGES.indexOf(type.mime) === -1) {
        return callback({
          code: 403,
          message: `invalid file format: Only ${PERMITTED_IMAGES.join(', ')} formats are allowed`
        });
      }

      callback();
    }, (error) => {
      if (error) {
        deleteFiles(req.files);
        return res.status(error.code).json(error);
      }

      const paths = req.files.map((file) => `/images/uploads/${file.filename}`);

      res.json({
        code: 200,
        data: {
          paths
        }
      });
    });
  });
});


module.exports = uploader;
