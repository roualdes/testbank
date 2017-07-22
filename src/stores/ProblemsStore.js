/**
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ReduceStore } from 'flux/utils';
import Immutable from 'immutable';
import FAQs from 'json-loader!yaml-loader!./missingdata.yaml';
import nearley from 'nearley';
import { ParserRules, ParserStart } from './NearleyParser';
import Problem from './Problem';
import FilterQuery from './FilterQuery';
import ActionType from '../actions/ActionTypes';
import Dispatcher from '../Dispatcher';
// import UploadStore from './UploadStore';

// todo: break up ProblemStore => queryFilteredIDs, exportableIDs
// let UploadStoreToken = UploadStore.getDispatchToken();
// see todo: allow interdependent stores via

class ProblemsStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    const state = Immutable.Map();
    return state.withMutations(map => {
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
        // todo: allow interdependent stores via
        // Dispatch.waitFor([UploadStoreToken]);
        return state.withMutations(map => {
          action.problems.forEach((p, i) => {
            const uid = `id-${i}`;
            const pp = p;
            pp.uid = uid;
            map.set(uid, new Problem(pp));
          });
        });

      case ActionType.FILTER_PROBLEMS: {
        let queryTree = [];
        if (action.query !== '') {
          const parser = new nearley.Parser(ParserRules, ParserStart).feed(
            action.query
          );
          if (parser.results.length > 0) {
            queryTree = parser.results[0];
          }
        }
        return state.map(p => p.set('display', FilterQuery(p, queryTree)));
      }

      case ActionType.SELECT_PROBLEM:
        return state.update(action.uid, p =>
          p.set('exportable', p.display ? !p.exportable : p.exportable)
        );

      case ActionType.INVERT_SELECTION:
        return state.map(p =>
          p.set('exportable', p.display ? !p.exportable : p.exportable)
        );

      case ActionType.TOGGLE_ALL_PROBLEMS: {
        const allExportable = state
          .filter(p => p.display)
          .every(p => p.exportable);
        return state.map(p =>
          p.set('exportable', p.display ? !allExportable : allExportable)
        );
      }

      default:
        return state;
    }
  }
}

export default new ProblemsStore();
