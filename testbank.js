// Copyright (c) 2019, Edward A. Roualdes
// Distributed under the terms of the Modified BSD License.

const express = require('express');

const router = express.Router();

const FileSync = require('lowdb/adapters/FileSync');
const { Session } = require('@jupyterlab/services');
const low = require('lowdb');
const Mustache = require('mustache');

// utility
function randomInt(min, max) {
  const mn = Math.ceil(min);
  const mx = Math.floor(max);
  return Math.floor(Math.random() * (mx - mn) + mn);
}

// database
const dbAdapter = new FileSync('db.json');
const db = low(dbAdapter);

const authAdapter = new FileSync('auth.json');
const authDB = low(authAdapter);

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
      res.json({ error: `No exercise matching ID ${ID}` });
      return;
    }
  } else {
    res.json({ error: 'No request parameter.' });
    return;
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
      res.json({
        error:
      `No kernel available for exercise matching ID ${req.params.ID}.  Please contact eroualdes@csuchico.edu`,
      });
  }

  // prepare Mustache meta data
  let SEED = parseInt(req.query.seed, 10);
  let { solution } = req.query;
  const { auth } = req.query;
  if (SEED == null || !Number.isInteger(SEED)) {
    // R has a smaller max int than python
    // .Machine$integer.max < np.iinfo(np.uint32)
    SEED = randomInt(1, 2147483647);
  }

  let exercise = true;
  if (solution == null) {
    solution = false;
  } else {
    solution = true;
    exercise = false;
  }

  if (solution && SEED % 2 === 0) {
    const notAuthorized = authDB.get('auth')
      .filter({ key: auth })
      .isEmpty()
      .value();
    if (notAuthorized) {
      res.json({ error: 'unauthorized' });
      return;
    }
  }

  const meta = {
    ID,
    SEED,
    exercise,
    solution,
  };
  code = Mustache.render(code, meta, {}, ['#<', '>#']);

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
      future.onReply = (err) => {
        const errorMessage = err.content.traceback;
        if (errorMessage != null) {
          console.log(errorMessage);
        }

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
