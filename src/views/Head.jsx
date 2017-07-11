/**
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Dropdown, Header, Icon, Input, Menu } from 'semantic-ui-react';
import fs from 'fs';
import Immutable from 'immutable';
import React from 'react';
import Mousetrap from 'mousetrap';
import PropTypes from 'prop-types';
import templateFns from '../templates';

const { dialog } = require('electron').remote;

function Head(props) {
  const FilterProblems = event => {
    const query = event.target.value;
    if (event.key === 'Enter' || query === '') {
      props.onFilterProblems(query);
    }
  };

  return (
    <Menu fluid inverted borderless>
      <Menu.Item>
        <Header inverted>TestBank/</Header>
      </Menu.Item>
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
  onFilterProblems: PropTypes.func.isRequired
};

function Actions(props) {
  const templates = [...props.templates.values()];

  const ExportSelectedProblems = () => {
    const problems = [
      ...props.problems.filter(problem => problem.exportable).values()
    ];
    const activeTemplate = [
      ...props.templates.filter(template => template.get('active')).keys()
    ];

    if (problems.length > 0) {
      dialog.showSaveDialog(fileName => {
        if (fileName === undefined) {
          dialog.showErrorBox('Error:', 'No file specified.');
          return;
        }
        /* todo: use custom templates */
        const templateFn = templateFns[activeTemplate[0]];
        fs.writeFile(fileName, templateFn(problems), err => {
          if (err && 'message' in err) {
            dialog.showErrorBox('Error:', err.message);
          } else {
            dialog.showMessageBox({
              message: 'File successfully saved.',
              buttons: ['OK']
            });
          }
        });
      });
    }
  };

  /* todo: shortcuts to operate when focused on an element */
  Mousetrap.bind(['command+shift+e', 'ctrl+shift+e'], () =>
    ExportSelectedProblems()
  );
  Mousetrap.bind(['command+shift+t', 'ctrl+shift+t'], () =>
    props.onToggleAllProblems()
  );
  Mousetrap.bind(['command+shift+i', 'ctrl+shift+i'], () =>
    props.onInvertSelection()
  );
  Mousetrap.bind(['command+shift+s', 'ctrl+shift+s'], () =>
    document.getElementById('searchBar').focus()
  );

  return (
    <Menu.Item>
      <Dropdown icon="content">
        <Dropdown.Menu>
          <Dropdown.Item
            text="Export Problems"
            description="Cmd+E"
            onClick={ExportSelectedProblems}
          />
          <Menu.Header>Selection</Menu.Header>
          <Dropdown.Item
            text="Toggle All Problems"
            description="Cmd+T"
            onClick={props.onToggleAllProblems}
          />
          <Dropdown.Item
            text="Invert Selected Problems"
            description="Cmd+I"
            onClick={props.onInvertSelection}
          />
          <Menu.Header>Templates</Menu.Header>
          {templates.map(template =>
            <TemplateItem
              key={template.name}
              template={template}
              onSetTemplate={props.onSetTemplate}
            />
          )}
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  );
}

Actions.propTypes = {
  problems: PropTypes.instanceOf(Immutable.Map).isRequired,
  templates: PropTypes.instanceOf(Immutable.Map).isRequired,
  onSetTemplate: PropTypes.func.isRequired,
  onToggleAllProblems: PropTypes.func.isRequired,
  onInvertSelection: PropTypes.func.isRequired
};

function TemplateItem(props) {
  const { template } = props;
  const onSetTemplate = () => props.onSetTemplate(template.name);
  return (
    <Menu.Item
      name={template.name}
      active={template.active}
      onClick={onSetTemplate}
    >
      {template.active && <Icon name="checkmark" />}
      {template.name}
    </Menu.Item>
  );
}

TemplateItem.propTypes = {
  template: PropTypes.instanceOf(Immutable.Record).isRequired,
  onSetTemplate: PropTypes.func.isRequired
};

export default Head;
