/**
 * Copyright (c) 2017-present, Edward A. Roualdes..
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import ActionType from './ActionTypes.js';
import Dispatcher from './Dispatcher.js';
import Filter from './Filter.js';
import { ReduceStore } from 'flux/utils';
import Immutable from 'immutable';

class FilterStore extends ReduceStore {
    constructor() {
        super(Dispatcher);
    }

    getInitialState() {
        return '';
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionType.FILTER_PROBLEMS:
                return action.text;

            default:
                return state;
        }
    }
}

export default new FilterStore();
