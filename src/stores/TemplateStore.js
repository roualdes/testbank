/**
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ReduceStore } from 'flux/utils';
import Immutable from 'immutable';
import ActionType from '../actions/ActionTypes';
import Dispatcher from '../Dispatcher';
import Template from './Template';
import templateStrings from '../templates';

class TemplateStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    let state = Immutable.Map();
    state = state.set(
      'Rnw',
      new Template({
        name: 'Rnw',
        string: templateStrings.Rnw,
        active: true
      })
    );
    state = state.set(
      'Lab',
      new Template({
        name: 'Lab',
        string: templateStrings.Lab
      })
    );
    state = state.set(
      'Probsoln',
      new Template({
        name: 'Probsoln',
        string: templateStrings.Probsoln
      })
    );
    return state;
  }

  reduce(state, action) {
    switch (action.type) {
      case ActionType.SET_TEMPLATE:
        return state
          .map(template => template.set('active', false))
          .setIn([action.name, 'active'], true);

      default:
        return state;
    }
  }
}

export default new TemplateStore();
