const fs = require('fs');
const path = require('path');

/**
 * Проходит рекурсивно по всем вложенным папкам и файлам исходной папки
 * и вызывает функцию-обработчик для каждого файла
 */
class FilesWalker {
  walk (base, handler) {
    try {
      const files = fs.readdirSync(base);

      files.forEach(item => {
        let localBase = path.join(base, item);
        let state = fs.statSync(localBase);
        if (state.isDirectory()) {
          this.walk(localBase, handler);
        } else {
          handler(null, localBase);
        }
      });
    } catch (err) {
      handler(err.message);
    }
  }
}

module.exports = FilesWalker;
