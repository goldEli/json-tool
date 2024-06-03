#!/usr/bin/env node

import clipboardy from 'clipboardy';
import fs from 'fs';
import {program}  from "commander"

program
    .option('-u, --url <url>', 'JSON file URL')
    // .option('-c, --compareValue <value>', 'Value to compare')
    // .parse(process.argv);

program.parse();

const options = program.opts();
const compareValue = clipboardy.readSync().trim();
if (compareValue) {
    console.log(`剪贴板: ${compareValue}`);
} else {
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
            if (obj[key] === value) {
                keys.push(currentKey ? `${currentKey}.${key}` : key);
            }
        }
    }
    return keys;
}

findKeysWithCompareValue(url, compareValue)
    .then(keys => {
        console.log(keys);
        const keyString =keys.join('、') 

        console.log(keyString);
        clipboardy.writeSync(keyString);
    })
    .catch(error => {
        console.error(error);
    });
    