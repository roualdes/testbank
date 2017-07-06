/*
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import AppView from '../views/AppView.jsx';
import Actions from '../data/Actions.jsx';
import FilterStore from '../data/FilterStore.jsx';
import ProblemStore from '../data/ProblemStore.jsx';
import UploadStore from '../data/UploadStore.jsx';
import { Container } from 'flux/utils';


function getStores() {
  return [
    FilterStore,
    ProblemStore,
    UploadStore,
  ];
}


function getState() {
  return {
    problemList: ProblemStore.getState(),
    parseTree: FilterStore.getState(),
    uploaded: UploadStore.getState(),

    onFilterProblems: Actions.filterProblems,
    onUploadProblems: Actions.uploadProblems,
    onSelectProblem: Actions.selectProblem,
  };
}


export default Container.createFunctional(AppView, getStores, getState);
