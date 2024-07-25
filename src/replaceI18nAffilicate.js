import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import select from 'cli-select';
import pkg from 'enquirer';
import { fileURLToPath } from 'url';

console.log('%c [ process.cwd() ]-11', 'font-size:13px; background:pink; color:#bf2c9f;', process.cwd())

const { Quiz } = pkg;

const options = [
    { name: 'en', value: 'en' },
    { name: 'zh-cn', value: 'zh-en' },
    { name: 'vi', value: 'vi' },
    { name: 'ko-kr', value: 'ko-kr' },
    { name: 'zh-tw', value: 'zh-tw' },
];

function readJSONValues(filePath, keys) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data);

        const result = [];

        keys.forEach(key => {
            if (key in jsonData) {
                result.push({ key, value: jsonData[key] });
            } else {
                console.error(`Key ${key} not found in JSON structure.`);
            }
        });

        return result;
    } catch (err) {
        console.error('Error reading JSON file:', err);
        return [];
    }
}

// Example usage:
// const targetFilePath = './zh-cn.json';
// const targetFilePath = './zh-tw.json';
// const targetFilePath = './ko-kr.json';
// const targetFilePath = './vi.json';


function onReplace(lan) {
    const fileName = `./${lan}.json`
    const targetFilePath = path.join(process.cwd(), fileName);
    const sourceFilePath = path.resolve('/Users/eli/Documents/weex/affiliate_language', fileName)
    console.log('targetFilePath', targetFilePath)
    console.log('sourceFilePath', sourceFilePath)
    // const sourceFilePath = path.resolve('/Users/eli/Documents/weex/h5_language', targetFilePath)
    const jsonKeysFile = path.join(process.cwd(), './keys.json');
    const jsonData = fs.readFileSync(jsonKeysFile, 'utf8');
    const keys = JSON.parse(jsonData).keys;

    const values = readJSONValues(sourceFilePath, keys);

    const changes = values;

    fs.readFile(targetFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        try {
            let jsonData = JSON.parse(data);

            changes.forEach(change => {
                const key = change.key;

                if (key in jsonData) {
                    if (jsonData[key] === change.value) {
                        console.log(`${key} 值没有变化, value: ${change.value}`)
                        return 
                    } else {
                        jsonData[key] = change.value;
                    }
                } else {
                    jsonData[key] = change.value;
                    console.log(`新增${key}, value: ${change.value}`)
                }
            });

            fs.writeFile(targetFilePath, JSON.stringify(jsonData, null, 4), (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log('File updated successfully.');
            });
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
        }
    });
}

// const showDropdown = () => {
//     select({
//         values: options.map(option => option.name),
//         selected: 1
//     }).then(response => {
//         const selected = options.find(option => option.name === response.value);
//         // open(selected.value)
//         // onReplace(selected.value)
//     });
// };


export function replaceI18nAffilicate() {
    const prompt = new Quiz({
        name: 'language',
        message: '选择语言',
        choices: options.map(item => item.name),
        correctChoice: 0
    });

    prompt
        .run()
        .then(answer => {
            console.log(answer);
            onReplace(answer.selectedAnswer)
            //   if (answer.correct) {
            //     console.log('Correct!');
            //   } else {
            //     
            //   }
        })
        .catch(console.error);
}
