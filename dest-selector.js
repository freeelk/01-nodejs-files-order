const mmm = require('mmmagic');
const Magic = mmm.Magic;

/**
 * При помощи полученного в конструкторе класса производит отбор нужных файлов на основе MIME (this.selector.match(mime))
 * и получает т.н. селектор - путь в целевой папке, куда нужно скопировать данный файл.
 *
 * Передача различных классов позволяет организовать сортировку файлов по различным параметрам
 * и легко добавлять новые способы сортировки.
 */
class DestSelector {
  constructor (selector) {
    this.selector = selector;
  }

  check (file, callback) {
    const magic = new Magic(mmm.MAGIC_MIME_TYPE);

    magic.detectFile(file, (err, mime) => {
      if (err) {
        callback(err);
      }

      if (this.selector.match(mime)) {
        this.selector.getSelector(file, (err, selector) => {
          callback(err, selector);
        });
      }
    });
  }
}

module.exports = DestSelector;
