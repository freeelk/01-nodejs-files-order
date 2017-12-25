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
const selectorsDefinition = require('./selectors/selectors-definitions');
const removeDirSync = require('./remove-dir-sync');


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
        console.error(`Error removing directory ${argvParsed.dest}  ${err.message}`);
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

const filesWalker = new FilesWalker(argvParsed);
filesWalker.walk();


