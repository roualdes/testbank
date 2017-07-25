/**
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ActionTypes from './ActionTypes';
import Dispatcher from '../Dispatcher';

const Actions = {
  filterProblems(query) {
    Dispatcher.dispatch({
      type: ActionTypes.FILTER_PROBLEMS,
      query
    });
  },

  complementSelection() {
    Dispatcher.dispatch({
      type: ActionTypes.COMPLEMENT_SELECTION
    });
  },

  importProblems(problems) {
    Dispatcher.dispatch({
      type: ActionTypes.IMPORT_PROBLEMS,
      problems
    });
  },

  selectProblem(uid) {
    Dispatcher.dispatch({
      type: ActionTypes.SELECT_PROBLEM,
      uid
    });
  },

  setTemplate(name) {
    Dispatcher.dispatch({
      type: ActionTypes.SET_TEMPLATE,
      name
    });
  },

  toggleAllProblems() {
    Dispatcher.dispatch({
      type: ActionTypes.TOGGLE_ALL_PROBLEMS
    });
  },

  uploadTemplate(name, string) {
    Dispatcher.dispatch({
      type: ActionTypes.UPLOAD_TEMPLATE,
      name,
      string
    });
  }
};

export default Actions;
