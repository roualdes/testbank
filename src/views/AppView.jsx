/**
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


import { Container } from 'semantic-ui-react';
import React from 'react';
import Body from './Body';
import Foot from './Foot';
import Head from './Head';


function AppView(props) {
  return (
    <Container fluid>
      <Head {...props} />
      <Body {...props} />
      <Foot />
    </Container>
  );
}


export default AppView;
