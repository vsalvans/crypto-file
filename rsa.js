import crypto from 'crypto';
import { stdin, stdout } from "process";
import readline from 'readline/promises';
import { TextEncoder } from "util";

async function main() {
    //Generate pair of keys
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        // The standard secure default length for RSA keys is 2048 bits
        modulusLength: 2048,
    });

    console.log('public', publicKey.export({
		type: "pkcs1",
		format: "pem",
	}));

	console.log('private', privateKey.export({
		type: "pkcs1",
		format: "pem",
	}));


    const user = readline.createInterface({ input: stdin, output: stdout });
    const text = await user.question("Enter the text to encrypt: ")

    const textBuffer = new TextEncoder().encode(text);

    const encryptedBuffer = crypto.publicEncrypt(publicKey, textBuffer);
    const encryptedMessage = encryptedBuffer.toString('base64');
    console.log('encrypted message', encryptedMessage);

    const decryptedBuffer = crypto.privateDecrypt(privateKey, Buffer.from(encryptedMessage, 'base64'));
    console.log('The decripted message is', decryptedBuffer.toString());

}

await main();
process.exit(0);