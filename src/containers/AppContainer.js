/**
 * Copyright (c) 2017-present, Edward A. Roualdes..
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import AppView from '../views/AppView';
import Actions from '../data/Actions.js';
import ProblemListStore from '../data/ProblemListStore';
import FilterStore from '../data/FilterStore';
import { Container } from 'flux/utils';


function getStores() {
    return [
        ProblemListStore,
        FilterStore,
    ];
}

function getState() {
    return {
        problemList: ProblemListStore.getState(),
        fText: FilterStore.getState(),

        onFilterProblems: Actions.filterProblems,
        onUploadProblems: Actions.uploadProblems,
    };
}


export default Container.createFunctional(AppView, getStores, getState);
