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
            const keyParts = key.split('.');
            let nestedObj = jsonData;

            for (let i = 0; i < keyParts.length; i++) {
                nestedObj = nestedObj[keyParts[i]];
                if (nestedObj === undefined) {
                    console.error(`Key ${key} not found in JSON structure.`);
                    return;
                }
            }

            result.push({ key, value: nestedObj });
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
    const targetFilePath = path.join(process.cwd(), `./${lan}.json`);
    const sourceFilePath = path.resolve('/Users/eli/Documents/weex/web-language', targetFilePath)
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
                const keys = change.key.split('.');
                let nestedObj = jsonData;

                for (let i = 0; i < keys.length - 1; i++) {
                    let temp = nestedObj[keys[i]];
                    if (!temp) {
                        // console.error(`Key ${keys[i]} not found in JSON structure.`);
                        nestedObj[keys[i]] = {}
                    }
                    nestedObj = nestedObj[keys[i]]
                }
                if (nestedObj[keys[keys.length - 1]] === change.value) {
                    console.log(`${keys.join('.')} 值没有变化`)
                }

                nestedObj[keys[keys.length - 1]] = change.value;
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


export function replaceI18n() {
    const prompt = new Quiz({
        name: 'language',
        message: '选择语言',
        choices: options.map(item => item.name),
        correctChoice: 3
      });
      
       prompt
        .run()
        .then(answer => {
          if (answer.correct) {
            console.log('Correct!');
          } else {
            onReplace(answer.correctAnswer)
          }
        })
        .catch(console.error);
//     inquirer
//   .prompt([
//     {
//       type: 'list',
//       name: 'framework',
//       message: 'What JavaScript framework do you use?',
//       choices: ['React', 'Angular', 'Vue.js'],
//     },
//   ])
//   .then((answers) => {
//     console.log('Chosen framework:', answers.framework);
//   });
    // inquirer.prompt([
    //     {
    //         type: 'list',
    //         name: 'selectedOption',
    //         message: 'Select an option:',
    //         choices: options.map(option => option.name),
    //         // when: () => !process.argv.includes('-r')
    //     }
    // ]).then(answers => {
    //     console.log('%c [ answers ]-125', 'font-size:13px; background:pink; color:#bf2c9f;', answers)
    //     // if (process.argv.includes('-r')) {
    //         // showDropdown();
    //     // }
    // });

}
