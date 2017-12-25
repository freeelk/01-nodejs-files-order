const NodeID3 = require('node-id3');

/**
 * Отбор MPEG-файлов и сортировка их в целевой папке по жанру. Жанр берется из ID3-данных файла.
 */
class Mp3JenreSelector {
  matchMime (mime) {
    return mime === 'audio/mpeg';
  }

  async getSelector(file) {
    const tags = NodeID3.read(file);
    let genre = 'not_defined';
    if (tags && tags.genre) {
      genre = tags.genre;
    }

    return await genre;
  }

}

module.exports = Mp3JenreSelector;
