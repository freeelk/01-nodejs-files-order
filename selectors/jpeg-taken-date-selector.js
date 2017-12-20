const path = require('path');
const ExifImage = require('exif').ExifImage;

/**
 * Отбор JPEG-файлов и сортировка по дате съемки (берется из EXIF) в целевой папке в виде дерева год->месяц->день
 */
class JpegTakenDateSelector {
  match (mime) {
    return mime === 'image/jpeg';
  }

  getSelector (file, callback) {
    try {
      ExifImage({ image: file }, function (error, exifData) {
        if (error) {
          callback(null, 'not_defined');
        } else {
          if (exifData.exif.DateTimeOriginal) {
            let matched = exifData.exif.DateTimeOriginal.match(/(\d{4}):(\d{2}):(\d{2})/);
            if (matched) {
              callback(null, path.join(matched[1], matched[2], matched[3]));
            } else {
              callback(null, 'not_defined');
            }
          } else {
            callback(null, 'not_defined');
          }
        }
      });
    } catch (error) {
      callback(error.message, null);
    }
  }
}

module.exports = JpegTakenDateSelector;
