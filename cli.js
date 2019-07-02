const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require('fs');
const hash = require('./hashid.js');
const Mustache = require('mustache');
const program = require('commander');
const path = require('path');

program
    .version('0.0.1')
    .description('TestBank command line interface.')

// read exercise code and exercise meta data
const get_info = function(json_path) {

    let meta = JSON.parse(fs.readFileSync(json_path, 'utf8'));
    let fldr = path.dirname(json_path);
    let code = fs.readFileSync(path.join(fldr, meta['code']), 'utf8');

    return {meta: meta, code: code};
}

//////////////////////////  test exercise ////////////////////////////
const test = function(json_path, section = '') {

    if (section != 'exercise' && section != 'solution') {
        console.log('section ' +
                    section +
                    ' must be either \"exercise\" or \"solution\".');
        process.exit(1);
    }

    let {meta, code} = get_info(json_path);

    meta['setup'] = true;
    meta['exercise'] = meta['solution'] = false;
    meta[section] = true;

    code = Mustache.render(code, meta);
    console.log(code);
}

program
    .command('test <json_path> <section>')
    .alias('t')
    .description('generate exercise or solution code for testing')
    .action((json_path, section) => test(json_path, section));

////////////////////////// insert exercise  //////////////////////////
const insert = function(json_path) {

    // lowdb setup
    const db_adapter = new FileSync('db.json');
    const db = low(db_adapter);

    const tags_adapter = new FileSync('tags.json');
    const tags = low(tags_adapter);

    db.defaults({ exercises: [],
                  last_updated: ''
                })
        .write();

    const IDs = db.get('exercises')
          .map('id')
          .value();

    tags.defaults({})
        .write();

    // read exercise
    let {meta, code} = get_info(json_path);

    // insert db entry
    let setup_exists = code.search(/\{\{ #setup \}\}/) >= 0;
    let exercise_exists = code.search(/\{\{ #exercise \}\}/) >= 0;
    let solution_exists = code.search(/\{\{ #solution \}\}/) >= 0;

    let setup;
    if (setup_exists) {
        meta['setup'] = true;
        setup = Mustache.render(code, meta);
    } else {
        setup = '';
    }

    // exercise must exist
    if ( !exercise_exists ) {
        console.log("The Mustache tag {{ #exercise }} must exist.");
        process.exit(1);
    }
    meta['exercise'] = true;
    meta['setup'] = false;
    let ex = Mustache.render(code, meta);

    let sol;
    if (solution_exists) {
        meta['solution'] = true;
        meta['exercise'] = false;
        sol = Mustache.render(code, meta);
    } else {
        sol = '';
    }

    let ID = hash.gen(IDs);
    let language;
    switch (path.extname(meta['code'])
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
        .push({ id: ID,
                language: language,
                setup: setup,
                exercise: ex,
                solution: sol,
                tags: meta['tags']
              })
        .write();

    db.set('last_updated', Date())
        .write();

    // insert tag entries
    meta['tags'].forEach(tag => {
        if (tags.has(tag).value()) {
            let new_tags = tags.get(tag)
                .concat(ID)
                .value();
            tags.set(tag, new_tags).write();
        } else {
            tags.set(tag, [ID])
                .write();
        }
    });

    console.log("Inserted exercise " + ID + ", based on " + json_path);
}

program
    .command('insert <json_path>')
    .alias('i')
    .description('insert exercise/solution')
    .action(json_path => insert(json_path));

program.parse(process.argv);
