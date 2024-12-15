/** read the parameters
 * 1. --file
 * 2. --encrypt
 * 3. --decrypt
*/

import { decryptFile, encryptFile } from "./symetric.js";

const getArguments = () => {
    const args = {};

    for (const [index, arg] of process.argv.entries()) {
        switch (arg) {
            case '--file':
                args['file'] = process.argv[index + 1];
                break;

            case '--encrypt':
                args['process'] = 'encrypt';
                break;

            case '--decrypt':
                args['process'] = 'decrypt';
                break;
            default:
                break;
        }
    }

    if (!args.process || !args.file) {
        showHowToUse();
    }

    return args;
}

const showHowToUse = () => {
    console.log(`
        Invalid Parameters
        --file : file to encrypt o decrypt
        --encrypt: Encrypts the file
        --decrypt: Decrypts the file
    `);

    process.exit(1);
}

const args = getArguments();

console.log(args);

switch (args.process) {
    case 'encrypt':
        await encryptFile(args.file);
        break;

    case 'decrypt':
        await decryptFile(args.file);
        break;

    default:
        showHowToUse();
        break;
}

process.exit(0);

