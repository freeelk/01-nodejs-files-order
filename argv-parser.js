/**
 *  Парсер аргументов командной строки
 */

class ArgvParser {
    constructor(keysDefinition) {
        this.keysDefinition = keysDefinition;
    }

    getDefinitions() {
        return this.keysDefinition.map(item => '   --' + item.key + (item.required ? '  Required  ' : '  ') + item.description);
    }

    parse() {
        const args = process.argv.slice(2, process.argv.length);
        const receivedKeys = args.filter(this._isArgKey).map(item => item.substring(2));
        let parsed = {};

        receivedKeys.forEach(key => {
            if (this.allowedKeys.findIndex(allowedKey => allowedKey === key) === -1) {
                throw new Error(`Key --${key} is not allowed`);
            }

            let keyIndex = args.findIndex(arg => {
                return arg === '--' + key;
            });

            if (args[keyIndex + 1] && !this._isArgKey(args[keyIndex + 1])) {
                if (args[keyIndex + 2] && !this._isArgKey(args[keyIndex + 2])) {
                    throw new Error(`Value for key --${key} is not valid`);
                }

                if (parsed.hasOwnProperty(key)) {
                    throw new Error(`Key --${key} is specified more than once`);
                }

                parsed[key] = args[keyIndex + 1];
            } else {
                throw new Error(`Value for key --${key} is not valid`);
            }
        });

        this.requiredKeys.forEach(requiredKey => {
            if (!parsed.hasOwnProperty(requiredKey)) {
                throw new Error(`Missing required key --${requiredKey}`);
            }
        });

        return (parsed);
    }

    get allowedKeys() {
        return this.keysDefinition.map(item => item.key);
    }

    get requiredKeys() {
        return this.keysDefinition.filter(item => item.required).map(item => item.key);
    }

    static _isArgKey(arg) {
        return /^--.*$/.test(arg);
    }

}

module.exports = ArgvParser;