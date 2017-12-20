/**
 *  Так как копирование файлов производится асинхронно, возникла необходимость отслеживать окончание копирования
 *  По окончанию копирования всех файлов вызывается функция onComplete()
 */
class CopyWatcher {
  constructor (onComplete) {
    this.onComplete = onComplete;
  }

  init () {
    this.process = [];
    this.allStarted = false;
  }

  startedAll () {
    this.allStarted = true;
  }

  start (fileName) {
    this.process.push(fileName);
    //console.log('START ', fileName);
  }

  end (fileName) {
    let index = this.process.findIndex(item => {
      return item === fileName;
    });
    this.process.splice(index, 1);
    //console.log('END ', fileName);
    this._checkForComplete();
  }

  _checkForComplete () {
    if (this.allStarted && this.process.length === 0) {
      this.onComplete();
    }
  }
}

module.exports = CopyWatcher;
