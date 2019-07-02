const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require('fs');
const Mustache = require('mustache');
const program = require('commander');
const path = require('path');
const hash = require('./hashid.js');

program
  .version('0.0.1')
  .description('TestBank command line interface.');

// read exercise code and exercise meta data
function getInfo(jsonPath) {
  const meta = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const fldr = path.dirname(jsonPath);
  const code = fs.readFileSync(path.join(fldr, meta.code), 'utf8');

  return { meta, code };
}

// ////////////////////////  test exercise ////////////////////////////
function test(jsonPath, section = '') {
  if (section !== 'exercise' && section !== 'solution') {
    console.log(`section ${
      section
    } must be either "exercise" or "solution".`);
    process.exit(1);
  }

  // eslint-disable-next-line prefer-const
  let { meta, code } = getInfo(jsonPath);

  meta.setup = true;
  meta.exercise = false;
  meta.solution = false;
  meta[section] = true;

  code = Mustache.render(code, meta);
  console.log(code);
}

program
  .command('test <jsonPath> <section>')
  .alias('t')
  .description('generate exercise or solution code for testing')
  .action((jsonPath, section) => test(jsonPath, section));

// //////////////////////// insert exercise  //////////////////////////
function insert(jsonPath) {
  // lowdb setup
  const dbAdapter = new FileSync('db.json');
  const db = low(dbAdapter);

  const tagsAdapter = new FileSync('tags.json');
  const tags = low(tagsAdapter);

  db.defaults({
    exercises: [],
    last_updated: '',
  })
    .write();

  const IDs = db.get('exercises')
    .map('id')
    .value();

  tags.defaults({})
    .write();

  // read exercise
  const { meta, code } = getInfo(jsonPath);

  // insert db entry
  const setupExists = code.search(/\{\{ #setup \}\}/) >= 0;
  const exerciseExists = code.search(/\{\{ #exercise \}\}/) >= 0;
  const solutionExists = code.search(/\{\{ #solution \}\}/) >= 0;

  let setup;
  if (setupExists) {
    meta.setup = true;
    setup = Mustache.render(code, meta);
  } else {
    setup = '';
  }

  // exercise must exist
  if (!exerciseExists) {
    console.log('The Mustache tag {{ #exercise }} must exist.');
    process.exit(1);
  }
  meta.exercise = true;
  meta.setup = false;
  const ex = Mustache.render(code, meta);

  let sol;
  if (solutionExists) {
    meta.solution = true;
    meta.exercise = false;
    sol = Mustache.render(code, meta);
  } else {
    sol = '';
  }

  const ID = hash.gen(IDs);
  let language;
  switch (path.extname(meta.code)
    .replace(/\./g, '')
    .toLowerCase()) {
    case 'py':
      language = 'python';
      break;
    case 'r':
      language = 'r';
      break;
    default:
      console.log('Language (via file extension) unrecognized => no action.');
      process.exit(1);
  }

  db.get('exercises')
    .push({
      id: ID,
      language,
      setup,
      exercise: ex,
      solution: sol,
      tags: meta.tags,
    })
    .write();

  db.set('last_updated', Date())
    .write();

  // insert tag entries
  meta.tags.forEach((tag) => {
    if (tags.has(tag).value()) {
      const newTags = tags.get(tag)
        .concat(ID)
        .value();
      tags.set(tag, newTags).write();
    } else {
      tags.set(tag, [ID])
        .write();
    }
  });

  console.log(`Inserted exercise ${ID}, based on ${jsonPath}`);
}

program
  .command('insert <jsonPath>')
  .alias('i')
  .description('insert exercise/solution')
  .action(jsonPath => insert(jsonPath));

program.parse(process.argv);
