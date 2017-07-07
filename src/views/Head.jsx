/**
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  Dropdown,
  Header,
  Input,
  Menu,
} from 'semantic-ui-react';
import fs from 'fs';
import Immutable from 'immutable';
import React from 'react';
import Mousetrap from 'mousetrap';
import PropTypes from 'prop-types';
import Probsoln from '../templates/Probsoln';

const { dialog } = require('electron').remote;


function Head(props) {
  const FilterProblems = (event) => {
    const query = event.target.value;
    if (event.key === 'Enter' || query === '') {
      props.onFilterProblems(query);
    }
  };

  return (
    <Menu fluid inverted borderless>
      <Menu.Item>
        <Header inverted>
          TestBank/
        </Header>
      </Menu.Item >
      <Actions {...props} />
      <Menu.Item position="right" style={{ width: '70vw' }}>
        <Input
          id="searchBar"
          inverted
          focus
          icon="search"
          size="large"
          placeholder="search problems..."
          onKeyPress={FilterProblems}
          onChange={FilterProblems}
        />
      </Menu.Item>
    </Menu>
  );
}

Head.propTypes = {
  onFilterProblems: PropTypes.func.isRequired,
};


function Actions(props) {
  const ExportSelectedProblems = () => {
    const problems = [...props.problemList
                      .filter(problem => problem.exportable)
                      .values()];

    if (problems.length > 0) {
      dialog.showSaveDialog((fileName) => {
        if (fileName === undefined) {
          dialog.showErrorBox('Error:', 'no file specified.');
          return;
        }
        /* todo: export via other templates */
        fs.writeFile(fileName, Probsoln(problems), (err) => {
          if (err && 'message' in err) {
            dialog.showErrorBox('Error:', err.message);
          } else {
            dialog.showMessageBox({
              message: 'File successfully saved.',
              buttons: ['OK'],
            });
          }
        });
      });
    }
  };

  /* todo: shortcuts to operate when focused on an element */
  Mousetrap.bind(['command+shift+e', 'ctrl+shift+e'],
                 () => ExportSelectedProblems());
  Mousetrap.bind(['command+shift+t', 'ctrl+shift+t'],
                 () => props.onToggleAllProblems());
  Mousetrap.bind(['command+shift+i', 'ctrl+shift+i'],
                 () => props.onInvertSelection());
  Mousetrap.bind(['command+shift+s', 'ctrl+shift+s'],
                 () => document.getElementById('searchBar').focus());

  return (
    <Menu.Item>
      <Dropdown icon="content">
        <Dropdown.Menu>
          <Dropdown.Item onClick={ExportSelectedProblems}>
            Export Problems
          </Dropdown.Item>
          <Dropdown.Item onClick={props.onToggleAllProblems}>
            Toggle All Problems
          </Dropdown.Item>
          <Dropdown.Item onClick={props.onInvertSelection}>
            Invert Selected Problems
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  );
}


Actions.propTypes = {
  problemList: PropTypes.instanceOf(Immutable.Map).isRequired,
  onToggleAllProblems: PropTypes.func.isRequired,
  onInvertSelection: PropTypes.func.isRequired,
};

export default Head;
