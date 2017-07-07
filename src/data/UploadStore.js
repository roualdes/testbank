/**
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


import { ReduceStore } from 'flux/utils';
import ActionType from './ActionTypes';
import Dispatcher from './Dispatcher';


class UploadStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return false;
  }

  reduce(state, action) {
    switch (action.type) {
      case ActionType.UPLOAD_PROBLEMS:
        return true;

      default:
        return state;
    }
  }
}

export default new UploadStore();
