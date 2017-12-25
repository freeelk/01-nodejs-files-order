const path = require('path');

/**
 * Отбор всех аудио-файлов, и сортировка их по первой букве названия файла
 */
class MusicFirstLetterSelector {
  matchMime (mime) {
    return /^audio\/.*$/.test(mime);
  }

  async getSelector (file) {
    return await path.basename(file).substring(0, 1).toUpperCase();
  }
}

module.exports = MusicFirstLetterSelector;
