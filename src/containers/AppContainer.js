/**
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Container } from 'flux/utils';
import App from '../views/App';
import Actions from '../actions/Actions';
import ProblemsStore from '../stores/ProblemsStore';
import TemplateStore from '../stores/TemplateStore';
import ImportStore from '../stores/ImportStore';

function getStores() {
  return [ProblemsStore, TemplateStore, ImportStore];
}

function getState() {
  return {
    problems: ProblemsStore.getState(),
    templates: TemplateStore.getState(),
    imported: ImportStore.getState(),

    onFilterProblems: Actions.filterProblems,
    onComplementSelection: Actions.complementSelection,
    onImportProblems: Actions.importProblems,
    onSelectProblem: Actions.selectProblem,
    onSetTemplate: Actions.setTemplate,
    onToggleAllProblems: Actions.toggleAllProblems,
    onUploadTemplate: Actions.uploadTemplate
  };
}

export default Container.createFunctional(App, getStores, getState);
