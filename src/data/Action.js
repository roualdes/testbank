/**
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


import ActionTypes from './ActionTypes';
import Dispatcher from './Dispatcher';

const Actions = {
  filterProblems(query) {
    Dispatcher.dispatch({
      type: ActionTypes.FILTER_PROBLEMS,
      query,
    });
  },

  invertSelection() {
    Dispatcher.dispatch({
      type: ActionTypes.INVERT_SELECTION,
    });
  },

  uploadProblems(problems) {
    Dispatcher.dispatch({
      type: ActionTypes.UPLOAD_PROBLEMS,
      problems,
    });
  },

  selectProblem(uid) {
    Dispatcher.dispatch({
      type: ActionTypes.SELECT_PROBLEM,
      uid,
    });
  },

  toggleAllProblems() {
    Dispatcher.dispatch({
      type: ActionTypes.TOGGLE_ALL_PROBLEMS,
    });
  },

};

export default Actions;
