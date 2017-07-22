/**
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { render } from 'react-dom';
import AppContainer from './containers/AppContainer';

render(<AppContainer />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept('./containers/AppContainer.js', () => {
    render(<AppContainer />, document.getElementById('root'));
  });
}
