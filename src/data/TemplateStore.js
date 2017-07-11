/**
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


import { ReduceStore } from 'flux/utils';
import Immutable from 'immutable';
import ActionType from './ActionTypes';
import Dispatcher from './Dispatcher';
import Template from './Template';


class TemplateStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    let state = Immutable.Map();
    state = state.set('Rnw', new Template({ name: 'Rnw', active: true }));
    state = state.set('Probsoln', new Template({ name: 'Probsoln' }));
    return state;
  }

  reduce(state, action) {
    switch (action.type) {
    case ActionType.SET_TEMPLATE:
      return state.map(template => template.set('active', !template.active));

      default:
        return state;
    }
  }
}

export default new TemplateStore();
