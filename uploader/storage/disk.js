const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

function DiskStorage(options) {
  this.getFilename = options.filename;

  if (typeof options.destination === 'string') {
    mkdirp.sync(options.destination);
  }

  this.getDestination = options.destination;
}

DiskStorage.prototype._handleFile = function (req, file, cb) {
  const filename = this.getFilename(req, file);
  const destination = path.join(this.getDestination, filename);

  const outStream = fs.createWriteStream(destination);

  file.stream.pipe(outStream);
  outStream.on('error', cb);
  outStream.on('finish', () => {
    cb(null, {
      destination,
      filename,
      path: destination
    });
  });
};

DiskStorage.prototype._removeFile = function (req, file, cb) {
  const path = file.path;

  delete file.destination;
  delete file.filename;
  delete file.path;

  fs.unlink(path, cb);
};

module.exports = DiskStorage;
