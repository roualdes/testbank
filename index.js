// Copyright (c) 2019, Edward A. Roualdes
// Distributed under the terms of the Modified BSD License.

const bodyParser = require('body-parser');
const express = require('express');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const tb = require('./testbank.js');

app.use('/', tb);

app.listen(port, () => console.log(`TestBank listening on port ${port}!`));
