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
import ProblemList from './ProblemList.js';
import { ReduceStore } from 'flux/utils';
import Immutable from 'immutable';


class ProblemListStore extends ReduceStore {
    constructor() {
        super(Dispatcher);
    }

    getInitialState() {
        return new ProblemList({});
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionType.UPLOAD_PROBLEMS:
                return new ProblemList({
                    problems: Immutable.List(action.problems),
                    problems_uploaded: true,
                });

            default:
                return state;
        }
    }
}

export default new ProblemListStore();
