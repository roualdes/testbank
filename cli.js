const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require('fs');
const Mustache = require('mustache');
const program = require('commander');
const path = require('path');
const hash = require('./hashid.js');

// lowdb setup
const dbAdapter = new FileSync('db.json');
const db = low(dbAdapter);

db.defaults({
  exercises: [],
  last_updated: '',
})
  .write();

const tagsAdapter = new FileSync('tags.json');
const tags = low(tagsAdapter);

tags.defaults({})
  .write();

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

// ////////////////////////////// test ////////////////////////////////
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

// ////////////////////////////  insert  //////////////////////////////
function insert(jsonPath) {
  const IDs = db.get('exercises')
    .map('id')
    .value();
  const ID = hash.gen(IDs);

  const { meta, code } = getInfo(jsonPath);

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
      exercise: code,
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


// ////////////////////////////// get  ////////////////////////////////
function get(ID, filePath = '') {
  const ex = db.get('exercises')
    .find({ id: ID })
    .value();
  if (ex) {
    if (filePath) {
      fs.writeFileSync(filePath, ex.exercise);
    } else {
      console.log(ex);
    }
  } else {
    console.log(`Can't find exercise with ID = ${ID}`);
  }

  process.exit(0);
}

program
  .command('get <ID> <filePath>')
  .alias('g')
  .description('get exercise/solution by ID')
  .action((ID, filePath = '') => get(ID, filePath));


program.parse(process.argv);
