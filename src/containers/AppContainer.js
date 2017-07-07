/**
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


import { Container } from 'flux/utils';
import AppView from '../views/AppView';
import Actions from '../data/Actions';
import ProblemStore from '../data/ProblemStore';
import UploadStore from '../data/UploadStore';


function getStores() {
  return [
    ProblemStore,
    UploadStore,
  ];
}


function getState() {
  return {
    problemList: ProblemStore.getState(),
    uploaded: UploadStore.getState(),

    onFilterProblems: Actions.filterProblems,
    onInvertSelection: Actions.invertSelection,
    onUploadProblems: Actions.uploadProblems,
    onSelectProblem: Actions.selectProblem,
    onToggleAllProblems: Actions.toggleAllProblems,
  };
}


export default Container.createFunctional(AppView, getStores, getState);
