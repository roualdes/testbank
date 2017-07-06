/**
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


import { ReduceStore } from 'flux/utils';
import Immutable from 'immutable';
import FAQs from 'json-loader!yaml-loader!./missingdata.yml';
import ActionType from './ActionTypes';
import Dispatcher from './Dispatcher';
import Problem from './Problem';


class ProblemListStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    const state = Immutable.Map();
    return state.withMutations((map) => {
      FAQs.forEach((p, i) => {
        const uid = `id-${i}`;
        const pp = p;
        pp.uid = uid;
        map.set(uid, new Problem(pp));
      });
    });
  }

  reduce(state, action) {
    switch (action.type) {
      case ActionType.UPLOAD_PROBLEMS:
        return state.withMutations((map) => {
          action.problems.forEach((p, i) => {
            const uid = `id-${i}`;
            const pp = p;
            pp.uid = uid;
            map.set(uid, new Problem(pp));
          });
        });

      case ActionType.SELECT_PROBLEM:
        return state.update(
                    action.uid,
                    p => p.set('exportable', !p.exportable),
        );

      case ActionType.INVERT_SELECTION:
        return state.map(p => p.set('exportable', !p.exportable));

      case ActionType.TOGGLE_ALL_PROBLEMS: {
        const allExportable = state.every(p => p.exportable);
        return state.map(p => p.set('exportable', !allExportable));
      }

      default:
        return state;

    }
  }
}

export default new ProblemListStore();
