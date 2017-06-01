/**
 * Copyright (c) 2017-present, Edward A. Roualdes..
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import Immutable from 'immutable';
import probs from 'json-loader!yaml-loader!./missingdata.yml';

const ProblemList = Immutable.Record({
    problems: Immutable.List(probs),
    problems_uploaded: false,
});

export default ProblemList;
