const path = require('path');
const exifImage = require('exif').ExifImage;
const util = require('util');

const exifImageP = util.promisify(exifImage);

/**
 * Отбор JPEG-файлов и сортировка по дате съемки (берется из EXIF) в целевой папке в виде дерева год->месяц->день
 */
class JpegTakenDateSelector {

  matchMime(mime) {
    return mime === 'image/jpeg';
  }

  async getSelector(file) {
    try {
      const exifData = await exifImageP({image: file});
      if (exifData && exifData.exif.DateTimeOriginal) {
        let matched = exifData.exif.DateTimeOriginal.match(/(\d{4}):(\d{2}):(\d{2})/);
        if (matched) {
          return path.join(matched[1], matched[2], matched[3]);
        }
      }

    }
    catch (err) {
      return ('not_defined');
    }

    return ('not_defined');
  }

}

module.exports = JpegTakenDateSelector;


