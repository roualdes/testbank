/**
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import ActionTypes from './ActionTypes';
import Dispatcher from './Dispatcher';

const Actions = {
  filterProblems(parseResults) {
    Dispatcher.dispatch({
      type: ActionTypes.FILTER_PROBLEMS,
      parseResults,
    });
  },

  uploadProblems(problems) {
    Dispatcher.dispatch({
      type: ActionTypes.UPLOAD_PROBLEMS,
      problems,
    });
  },

  selectProblem(id) {
    Dispatcher.dispatch({
      type: ActionTypes.SELECT_PROBLEM,
      id,
    });
  },

}

export default Actions;
