/**
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import ActionType from './ActionTypes.js';
import Dispatcher from './Dispatcher.js';
import Immutable from 'immutable';
import { ReduceStore } from 'flux/utils';

class FilterStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return Immutable.Map();
  }

  reduce(state, action) {
    switch (action.type) {
      case ActionType.FILTER_PROBLEMS:
        let parsedTree;
        if (action.parseResults.length > 0) {
          parsedTree = action.parseResults[0];
        } else {
          parsedTree = state;
        }

        return state.set('tree', parsedTree);


      default:
        return state;
    }
  }
}

export default new FilterStore();
