#!/usr/bin/env node
import inquirer from 'inquirer';
import select from 'cli-select';
import { stg_bossweb, stg_new_agency, stg_old_agency, stg_trade, stg_web } from './config/url.js';
import { open } from './utils/open.js';

const options = [
  { name: 'stg web1', value: stg_web },
  { name: 'stg trade1', value: stg_trade },
  { name: 'stg bossweb', value: stg_bossweb },
  { name: 'stg old agency', value: stg_old_agency },
  { name: 'stg new agency', value: stg_new_agency },
];


const showDropdown = () => {
  select({
    values: options.map(option => option.name),
    selected: 0
  }).then(response => {
    const selected = options.find(option => option.name === response.value);
    open(selected.value)
  });
};

export const selectDeployUrl = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'selectedOption',
      message: 'Select an option:',
      choices: options.map(option => option.name),
      when: () => !process.argv.includes('-d')
    }
  ]).then(answers => {
      showDropdown();
  
  });
};


