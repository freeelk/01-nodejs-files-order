const path = require('path');

/**
 * Отбор всех аудио-файлов, и сортировка их по первой букве названия файла
 */
class MusicFirstLetterSelector {
  match (mime) {
    return /^audio\/.*$/.test(mime);
  }

  getSelector (file, callback) {
    callback(null, path.basename(file).substring(0, 1).toUpperCase());
  }
}

module.exports = MusicFirstLetterSelector;
