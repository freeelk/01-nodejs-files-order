const fs = require('fs');
const path = require('path');
const util = require('util');

const mmm = require('mmmagic');
const Magic = mmm.Magic;
const magic = new Magic(mmm.MAGIC_MIME_TYPE);
magic.detectFileP = util.promisify(magic.detectFile);

const removeDirSync = require('./remove-dir-sync');
const selectorsDefinition = require('./selectors/selectors-definitions');
const FileCopy = require('./file-copy');

/**
 * Проходит рекурсивно по всем вложенным папкам и файлам исходной папки
 */
class FilesWalker {
  constructor(argvParsed) {
    this.argvParsed = argvParsed;
    this.destSelector = new selectorsDefinition[argvParsed.selector];
    this.fileCopy = new FileCopy(argvParsed.dest, argvParsed.silent === 'y');
  }

  walk() {
    this.inProcess = 0;
    this._walk(this.argvParsed.source);
  }


  _walk (base) {
    try {
      const files = fs.readdirSync(base);

      files.forEach(item => {
        let localBase = path.join(base, item);
        let state = fs.statSync(localBase);
        if (state.isDirectory()) {
          this._walk(localBase);
        } else {

          (async () => {
            let mime = await magic.detectFileP(localBase);
            if (this.destSelector.matchMime(mime)) {
              let selector = await this.destSelector.getSelector(localBase);

              this.inProcess++;
              await this.fileCopy.copy(selector, localBase);
              console.log(`File ${localBase} copied to ${selector}`);
              this.inProcess--;
              if (this.inProcess === 0) {
                console.log('All files was copied ');

                if (this.argvParsed['remove-src'] === 'y') {
                  try {
                    removeDirSync(this.argvParsed.source);
                    if (this.argvParsed.silent !== 'y') {
                      console.log(`Source directory ${this.argvParsed.source} was removed`);
                    }
                  } catch (err) {
                    console.error(`Error removing directory ${this.argvParsed.source}`);
                    process.exit(1);
                  }
                }
              }
            }
          })();
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = FilesWalker;
