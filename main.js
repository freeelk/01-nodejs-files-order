/**
 * - прочитать параметры: старая папка, новая папка, ключ - удалять старую
 * - читать файлы, проходя по дереву и записывать в новую папку
 *      - читаем
 *      - определяем, в какую папку копировать
 *      - если целевой папки нет, создаем.
 *      - копируем
 *      - если в целевой папке уже есть такой файл, копируем с переименованием
 * - если указано удаление исходной папки, удаляем
 */

const ArgvParser = require('./argv-parser');

/**
 * Описание аргументов командной строки
 *
 * @type {*[]}
 */
const keysDefinition = [
    {key: 'source', required: true, description: 'Path to source folder'},
    {key: 'destination', required: true, description: 'Path to destination folder'},
    {
        key: 'remove-src',
        required: false,
        description: 'y - Delete source folder after copying, n - leave source folder (default)'
    },
];


const argvParser = new ArgvParser(keysDefinition);
var argvParsed;

try {
    argvParsed = argvParser.parse();
} catch (err) {
    console.log('Utilite for files ordering');
    console.error('Error:', err.message);
    console.log('Arguments:');
    argvParser.getDefinitions(keysDefinition).forEach(item=>console.log(item));
    process.exit(1);
}

console.log(argvParsed);
