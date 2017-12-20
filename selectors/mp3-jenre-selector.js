const NodeID3 = require('node-id3');

/**
 * Отбор MPEG-файлов и сортировка их в целевой папке по жанру. Жанр берется из ID3-данных файла.
 */
class Mp3JenreSelector {
  match (mime) {
    return mime === 'audio/mpeg';
  }

  getSelector (file, callback) {
    try {
      const tags = NodeID3.read(file);
      let genre = 'not_defined';
      if (tags && tags.genre) {
        genre = tags.genre;
      }
      callback(null, genre);
    } catch (err) {
      callback(err.message, null);
    }
  }
}

module.exports = Mp3JenreSelector;
