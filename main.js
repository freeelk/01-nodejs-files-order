/**
 * Умеет сортировать звуковые файлы по первой букве названия файла (с опцией --selector music-first-letter),
 * а также:
 *  - файлы JPEG по дате съемки с деревом год/месяц/день (с опцией --selector jpeg-taken-date),
 *  - файлы MP3 по жанру музыки (с опцией --selector mp3-jenre)
 *
 *
 * - прочитать параметры
 * - читать файлы, проходя по дереву и записывать в новую папку
 *      - читаем
 *      - определяем, в какую папку копировать
 *      - если целевой папки нет, создаем.
 *      - копируем
 *      - если в целевой папке уже есть такой файл, копируем с переименованием
 * - если указано удаление исходной папки, удаляем
 */

const fs = require('fs');
const ArgvParser = require('./argv-parser');
const FilesWalker = require('./files-walker');
const DestSelector = require('./dest-selector');
const FileCopy = require('./file-copy');
const CopyWatcher = require('./copy-watcher');
const removeDirSync = require('./remove-dir-sync');

const JpegTakenDateSelector = require('./selectors/jpeg-taken-date-selector');
const MusicFirstLetterSelector = require('./selectors/music-first-letter-selector');
const Mp3JenreSelector = require('./selectors/mp3-jenre-selector');

/**
 * Описание аргументов командной строки
 *
 * @type {*[]}
 */
const keysDefinition = [
  {
    key: 'source',
    required: true,
    description: 'Path to source folder'
  },
  {
    key: 'dest',
    required: true,
    description: 'Path to destination folder'
  },
  {
    key: 'selector',
    required: true,
    description: 'Selection type: music-first-letter, jpeg-taken-date, mp3-jenre'
  },
  {
    key: 'remove-src',
    required: false,
    description: 'y - Delete source folder after copying, n - leave source folder (default)',
    default: 'n'
  },
  {
    key: 'remove-dest',
    required: false,
    description: 'y - Delete destination folder before copying, n - leave destination folder (default)',
    default: 'n'
  },
  {
    key: 'silent',
    required: false,
    description: 'y - Only errors messages, n - More messages (default)',
    default: 'n'
  }
];

const selectorsDefinition = {
  'jpeg-taken-date': JpegTakenDateSelector,
  'music-first-letter': MusicFirstLetterSelector,
  'mp3-jenre': Mp3JenreSelector
};

const argvParser = new ArgvParser(keysDefinition);
var argvParsed;

try {
  argvParsed = argvParser.parse();
} catch (err) {
  console.log('Utilite for files ordering');
  console.error('Error:', err);
  console.log('Arguments:');
  argvParser.getDefinitions(keysDefinition).forEach(item => console.log(item));
  process.exit(1);
}

if (!selectorsDefinition.hasOwnProperty(argvParsed.selector)) {
  console.error(`Selector ${argvParsed.selector} is not allowed`);
  process.exit(1);
}

if (fs.existsSync(argvParsed.dest)) {
  let state = fs.statSync(argvParsed.dest);
  if (state.isDirectory()) {
    if (argvParsed['remove-dest'] === 'y') {
      try {
        removeDirSync(argvParsed.dest);
        if (argvParsed.silent !== 'y') {
          console.log(`Destination directory ${argvParsed.dest} was removed`);
        }
      } catch (err) {
        console.error(`Error removing directory ${argvParsed.dest}`);
      }
    }
  } else {
    console.log(`You point file as destination directory: ${argvParsed.dest}.  Stopped.`);
    process.exit(1);
  }
}

if (fs.existsSync(argvParsed.source)) {
  let state = fs.statSync(argvParsed.source);
  if (!state.isDirectory()) {
    console.log(`You point file as source directory: ${argvParsed.dest}.  Stopped.`);
    process.exit(1);
  }
}

const filesWalker = new FilesWalker();
const destSelector = new DestSelector(new selectorsDefinition[argvParsed.selector]());
const fileCopy = new FileCopy(argvParsed.dest, argvParsed.silent === 'y');

let copyWatcher = new CopyWatcher(() => {
  console.log('COMPLETED');
  if (argvParsed['remove-src'] === 'y') {
    try {
      removeDirSync(argvParsed.source);
      if (argvParsed.silent !== 'y') {
        console.log(`Source directory ${argvParsed.source} was removed`);
      }
    } catch (err) {
      console.error(`Error removing directory ${argvParsed.source}`);
      process.exit(1);
    }
  }
});

copyWatcher.init();

filesWalker.walk(argvParsed.source, (err, path) => {
  if (err) {
    console.log(err);
  } else {
    destSelector.check(path, (err, selector) => {
      if (err) {
        console.log(path, err);
      } else {
        copyWatcher.start(path);
        fileCopy.copy(selector, path, (err, message) => {
          if (err) {
            console.error(err);
          } else {
            if (!this.silent) {
              console.log(message);
            }
          }
          copyWatcher.end(path);
        });
      }
    });
  }
});

copyWatcher.startedAll();
