// Copyright (c) 2019, Edward A. Roualdes
// Distributed under the terms of the Modified BSD License.

'use strict';

const express = require('express')
const app = express()
const port = 3000
const Session = require('@jupyterlab/services').Session;

// Start a new session.
const options = {
  kernelName: 'python3',
  path: 'tmp.ipynb'
};

const python_code = `
import json
import numpy as np
from scipy.stats import norm

ui32 = np.iinfo(np.uint32)
seed = np.random.randint(1, ui32.max)
np.random.seed(seed)
x = np.round(norm.rvs(loc=1, scale=0.1), 2)

ex = 'Find $P(X > {})$.'.format(x)
output = json.dumps({'seed': seed, 'exercise': ex})
print(output)
`;

var session;
Session.startNew(options)
    .then(function(s) {
        session = s;
    })
    .catch(function(err) {
        console.error(err);
        process.exit(1);
    });

app.get('/', function(req, res) {
    let future = session.kernel.requestExecute({ code: python_code });
    future.onIOPub = (msg) => {
        let output = msg.content.text;
        if (output != null) {
            res.send(output);
        }

    }
});

app.listen(port, () => console.log(`TestBank listening on port ${port}!`))
