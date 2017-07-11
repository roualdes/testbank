/**
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Container, Divider } from 'semantic-ui-react';
import React from 'react';

const Foot = () =>
  <Container fluid textAlign="center">
    <Divider clearing />
    <p>© 2017 Edward A. Roualdes</p>
  </Container>;

export default Foot;
