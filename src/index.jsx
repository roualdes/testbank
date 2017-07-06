/*
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import AppContainer from './containers/AppContainer.jsx'
import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(<AppContainer />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept('./containers/AppContainer.jsx', () => {
    ReactDOM.render(<AppContainer />, document.getElementById('root'));
  });
}
