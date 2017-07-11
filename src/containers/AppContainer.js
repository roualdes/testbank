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
import ProblemsStore from '../data/ProblemsStore';
import TemplateStore from '../data/TemplateStore';
import UploadStore from '../data/UploadStore';


function getStores() {
  return [
    ProblemsStore,
    TemplateStore,
    UploadStore,
  ];
}


function getState() {
  return {
    problems: ProblemsStore.getState(),
    templates: TemplateStore.getState(),
    uploaded: UploadStore.getState(),

    onFilterProblems: Actions.filterProblems,
    onInvertSelection: Actions.invertSelection,
    onUploadProblems: Actions.uploadProblems,
    onSelectProblem: Actions.selectProblem,
    onSetTemplate: Actions.setTemplate,
    onToggleAllProblems: Actions.toggleAllProblems,
  };
}


export default Container.createFunctional(AppView, getStores, getState);
