// Copyright (c) 2019, Edward A. Roualdes
// Distributed under the terms of the Modified BSD License.

const express = require('express');

const router = express.Router();

const FileSync = require('lowdb/adapters/FileSync');
const { Session } = require('@jupyterlab/services');
const low = require('lowdb');
const Mustache = require('mustache');

// database
const dbAdapter = new FileSync('db.json');
const db = low(dbAdapter);

// kernels
const rKernel = {
  kernelName: 'ir',
  path: 'r.ipynb',
};

const pythonKernel = {
  kernelName: 'python',
  path: 'python.ipynb',
};

let rSession;
Session.startNew(rKernel)
  .then((s) => {
    rSession = s;
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

let pythonSession;
Session.startNew(pythonKernel)
  .then((s) => {
    pythonSession = s;
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

router.get('/:ID', (req, res) => {
  // find exercise
  const { ID } = req.params;
  let e;
  if (ID) {
    e = db.get('exercises')
      .find({ id: ID })
      .value();
    if (!e) {
      res.render('error', { error: `No exercise matching ID ${ID}` });
    }
  } else {
    res.render('error', { error: 'No request parameter.' });
  }

  // match exercise <=> kernel
  let code;
  let path;
  let session;
  switch (e.language) {
    case 'r':
      code = e.exercise;
      ({ path } = rKernel);
      session = rSession;
      break;
    case 'python':
      code = e.exercise;
      ({ path } = pythonKernel);
      session = pythonSession;
      break;
    default:
      res.render('error', {
        error:
      `No kernel available for exercise matching ID ${req.params.ID}.  Please contact eroualdes@csuchico.edu`,
      });
  }

  // prepare Mustache meta data
  let SEED = req.query.seed;
  if (SEED == null) { // TODO or SEED != a number
    SEED = 1234;
  }

  const meta = {
    ID,
    SEED,
    exercise: true,
  };
  code = Mustache.render(code, meta);

  // execute code and return
  let output;
  Session.findByPath(path)
    .then(() => {
      const future = session.kernel.requestExecute({ code });
      future.onIOPub = (msg) => {
        const out = msg.content.text;
        if (out != null) {
          output = JSON.parse(out);
        }
      };
      future.onReply = () => {
        // console.log('Finished request');
      };
      return future.done;
    })
    .then(() => {
      res.json(output);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
