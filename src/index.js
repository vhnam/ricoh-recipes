require('dotenv').config();

const fs = require('fs');
const kebabCase = require('lodash.kebabcase');

const { serialize } = require('./utils/ricoh');

const DISTRIBUTION_FOLDER = './dist';
const DISTRIBUTION_FOLDER_DB = `${DISTRIBUTION_FOLDER}/db`;

function getReadableRecipes(data) {
  const { encodedStructure, readableRecipes } = serialize(data);

  if (!fs.existsSync(DISTRIBUTION_FOLDER)) {
    [DISTRIBUTION_FOLDER_DB].forEach((dictionary) => {
      fs.mkdirSync(dictionary, { recursive: true });
    });
  }

  fs.writeFileSync(
    `${DISTRIBUTION_FOLDER_DB}/${process.env.OUTPUT_JSON_FILE_NAME}`,
    JSON.stringify({
      name: 'Ricoh Simulation Recipes',
      structure: encodedStructure,
      data: readableRecipes,
    }),
    {
      flag: 'a',
      encoding: 'utf8',
    }
  );

  return readableRecipes;
}

function main() {
  fs.readFile(
    `./assets/${process.env.INPUT_JSON_FILE_NAME}`,
    'utf8',
    (error, data) => {
      if (error) {
        return console.error(error);
      }

      console.log('--- Starting ---');

      fs.rmSync(DISTRIBUTION_FOLDER, { recursive: true, force: true });

      const jsonData = JSON.parse(data);
      const readableRecipes = getReadableRecipes(jsonData);

      console.log('--- Completed ---');
    }
  );
}

main();
