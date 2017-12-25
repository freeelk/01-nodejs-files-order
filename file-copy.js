const fs = require('fs');
const path = require('path');
const util = require('util');
const promisePipe = require("promisepipe");

/**
 * Копирование файлов из исходной в целевую папку
 */
class CopyFile {
  /**
     *
     * @param targetDir Целевая папка
     */
  constructor (targetDir, silent = false) {
    this.targetDir = targetDir;
    this.silent = silent;
  }

  /**
     * Копирование файла
     *
     * @param selector Часть пути в целевой папке, куда следует скопировать файл
     * @param sourceFile Полный путь к исходному файлу
     */
  async copy(selector, sourceFile) {
      console.log(this.targetDir, selector);
    this.mkDirByPathSync(path.join(this.targetDir, selector));
    const targetFullName = this._getDestFileName(selector, path.basename(sourceFile));

    return await promisePipe(
        fs.createReadStream(sourceFile),
        fs.createWriteStream(targetFullName)
    );

  }

  /**
     * Создает рекурсивно папку
     *
     * @param targetDir
     * @param isRelativeToScript
     */
  mkDirByPathSync (targetDir, {isRelativeToScript = false} = {}) {
    const sep = path.sep;
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    const baseDir = isRelativeToScript ? __dirname : '.';

    targetDir.split(sep).reduce((parentDir, childDir) => {
      const curDir = path.resolve(baseDir, parentDir, childDir);
      try {
        fs.mkdirSync(curDir);
      } catch (err) {
        if (err.code !== 'EEXIST') {
          throw err;
        }

        return curDir;
      }

      return curDir;
    }, initDir);
  }

  /**
     * Если в целевой папке такой файл уже существует, то данный файл записывается с измененным именем в формате:
     *  filename_001.ext, filename_002.ext...
     *
     * @param selector
     * @param fileName
     * @param level
     * @return {*}
     * @private
     */
  _getDestFileName (selector, fileName, level = 0) {
    let extName = path.extname(fileName);
    let baseName = path.basename(fileName, extName);

    if (fs.existsSync(path.join(this.targetDir, selector, fileName))) {
      level++;

      if (/_\d{3}$/.test(baseName)) {
        fileName = baseName.substring(0, baseName.length - 3) + this._pad(level, 3) + extName;
      } else {
        fileName = baseName + '_' + this._pad(level, 3) + extName;
      }

      return this._getDestFileName(selector, fileName, level);
    } else {
      return path.join(this.targetDir, selector, fileName);
    }
  }

  /**
     * Форматирует число, дополняя его слева нулями
     *
     * @param num
     * @param size
     * @return {string}
     * @private
     */
  _pad (num, size) {
    var s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  }
}

module.exports = CopyFile;
