#!/usr/bin/env node

import clipboardy from 'clipboardy';
import fs from 'fs';
import { program } from "commander"
import { spawn } from 'child_process'
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { stg_trade, stg_web } from './src/config/url.js';
import { open } from './src/utils/open.js';
import { selectDeployUrl } from './src/deploy.js';
import { replaceI18n } from './src/replaceI18n.js';

// 获取当前文件的 URL
const __filename = fileURLToPath(import.meta.url);

// 获取当前文件的目录
const __dirname = dirname(__filename);

program
    .option('-u, --url <url>', 'JSON file URL')
    .option('-r, --replace', 'Replace JSON value')
    .option('-l, --lan', 'update language')
    .option('-d, --deploy ', 'deploy stg sever')
    // .option('-c, --compareValue <value>', 'Value to compare')
    .parse(process.argv);


const options = program.opts();

if (options.lan) {

    const ls = spawn('python', [path.join(__dirname, './src/updateLan/index.py')]);

    ls.stdout.on('data', (data) => {
        console.log(`${data}`);
    });

    ls.stderr.on('data', (data) => {
        console.error(`Stderr: ${data}`);
    });

    ls.on('close', (code) => {
        console.log(`Child process exited with code ${code}`);
    });
} else if (options.deploy) {
    selectDeployUrl()
} else if (options.replace) {
    replaceI18n()
} else {
    const compareValue = clipboardy.readSync().trim();
    if (compareValue) {
        console.log(`剪贴板: ${compareValue}`);
    } else {
        console.error(`剪贴板内容为空`);
        process.exit(1);
    }
    if (!options.url || !compareValue) {
        console.error('-u is required');
        process.exit(1);
    }

    // Example usage:
    const url = options.url;

    function findKeysWithCompareValue(url, compareValue) {
        return new Promise((resolve, reject) => {
            fs.readFile(url, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }

                try {
                    const jsonObject = JSON.parse(data);
                    const keys = findKeys(jsonObject, compareValue);
                    resolve(keys);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    function findKeys(obj, value, currentKey = '') {
        let keys = [];
        for (let key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                const nestedKeys = findKeys(obj[key], value, currentKey ? `${currentKey}.${key}` : key);
                keys = keys.concat(nestedKeys);
            } else {
                const c = value.replace(/\\/g, '')
                if (obj[key] === c) {
                    keys.push(currentKey ? `${currentKey}.${key}` : key);
                }
            }
        }
        return keys;
    }

    findKeysWithCompareValue(url, compareValue)
        .then(keys => {
            console.log(keys);
            const keyString = keys.join('、')

            if (keyString) {
                console.log(keyString);

                clipboardy.writeSync(keyString);
            } else {
                console.log('无匹配')
            }
        })
        .catch(error => {
            console.error(error);
        });
}
