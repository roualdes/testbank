/**
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import AppView from '../views/AppView';
import Actions from '../data/Actions.js';
import FilterStore from '../data/FilterStore';
import ProblemListStore from '../data/ProblemListStore';
import { Container } from 'flux/utils';


function getStores() {
  return [
    FilterStore,
    ProblemListStore,
  ];
}


function getState() {
  return {
    problemList: ProblemListStore.getState(),
    parseTree: FilterStore.getState(),

    onFilterProblems: Actions.filterProblems,
    onUploadProblems: Actions.uploadProblems,
    onSelectProblem: Actions.selectProblem,
  };
}


export default Container.createFunctional(AppView, getStores, getState);
