import crypto from "crypto";
import { stdin, stdout } from "process";
import readline from 'readline/promises';
import md5 from 'md5';
import fs from 'node:fs/promises'

const aesGcmParams = {
    name: 'AES-GCM',
    length: 256
};

/**
 * @param {string} text
 */
const getIVFromString = (text) => {
    return Buffer.from(md5(text, { asBytes: true }));
}

/**
 *
 * @param {string} password
 */
const generateKey = async (password) => {
    const keyBuffer = Buffer.from(md5(password));
    return await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        aesGcmParams,
        false,
        ['encrypt', 'decrypt']
    );
}

/**
 * @param {string} filePath
 */
export const encryptFile = async (filePath) => {
    const ui = readline.createInterface({ input: stdin, output: stdout });
    const password = await ui.question("Enter the password to encrypt: ");

    const file = await fs.readFile(filePath);
    const key = await generateKey(password);
    const encryptedFile = await crypto.subtle.encrypt(
        { ...aesGcmParams, iv: getIVFromString("random") },
        key,
        file
    );

    await fs.writeFile(filePath, Buffer.from(encryptedFile));
}

/**
 * @param {string} filePath
 */
export const decryptFile = async (filePath) => {
    const encryptedFile = await fs.readFile(filePath);
    const ui = readline.createInterface({ input: stdin, output: stdout });

    let success = false;

    do {
        const password = await ui.question("Enter the password to decrypt: ");
        const key = await generateKey(password);
        try {
            const file = await crypto.subtle.decrypt(
                { ...aesGcmParams, iv: getIVFromString("random") },
                key,
                encryptedFile
            );

            await fs.writeFile(filePath, Buffer.from(file));
            success = true;
        } catch (e) {
            console.error('Invalid password');
        }
    } while (!success)
}
