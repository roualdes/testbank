/*
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import ActionType from './ActionTypes.jsx';
import Dispatcher from './Dispatcher.jsx';
import Problem from './Problem.jsx';
import { ReduceStore } from 'flux/utils';
import Immutable from 'immutable';
import FAQs from 'json-loader!yaml-loader!./missingdata.yml';


class ProblemListStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    let state = Immutable.Map();
    return state.withMutations(map => {
      FAQs.forEach((p, i) => {
        let uid = "id-" + i;
        p['uid'] = uid;
        map.set(uid, new Problem(p))}
      );
    });
  }

  reduce(state, action) {
    switch (action.type) {
      case ActionType.UPLOAD_PROBLEMS:
        return state.withMutations(map => {
          action.problems.forEach((p, i) => {
            let uid = "id-" + i;
            p['uid'] = uid;
            map.set(uid, new Problem(p))}
          )
        });

      case ActionType.SELECT_PROBLEM:
        return state.update(
          action.uid,
          p => p.set('exportable', !p.exportable),
        );

      default:
        return state;

    }
  }
}

export default new ProblemListStore();
