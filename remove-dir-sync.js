const fs = require('fs');

/**
 * Рекурсивно удаляет директорию
 *
 * @param path
 */
const removeDirSync = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file) => {
      var curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        removeDirSync(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });

    fs.rmdirSync(path);
  }
};

module.exports = removeDirSync;
