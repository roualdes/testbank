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
import yaml from 'js-yaml';
import path from 'path';

const { dialog } = require('electron').remote;
let doT = require('dot')
doT.templateSettings.strip = false;


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

  function ImportProblems() {
    dialog.showOpenDialog({ filters: [{ extensions: ['yaml'] }] }, (
      fileNames
    ) => {
      if (fileNames === undefined) return;
      const fileName = fileNames[0];
      props.onImportProblems(yaml.safeLoad(fs.readFileSync(fileName, 'utf-8')));
    });
  }

  const ExportSelectedProblems = () => {
    const problems = [
      ...props.problems.filter(problem => problem.exportable).values()
    ];

    const activeTemplate = props
      .templates
      .filter(template => template.get('active'))
      .first()
      .get('string');

    if (problems.length > 0) {
      dialog.showSaveDialog(fileName => {
        if (fileName === undefined) {
          dialog.showErrorBox('Error:', 'No file specified.');
          return;
        }

        /* todo: use custom templates */
        const templateFn = doT.template(activeTemplate);
        const data = problems.length > 1 ? {problems: problems} : {problem: problems[0]};
        fs.writeFile(fileName,
                     templateFn(data),
                     err => {
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

  const UploadTemplate = () => {
    dialog.showOpenDialog({ filters: [{ extensions: ['yaml'] }] }, (
      fileNames
    ) => {
      if (fileNames === undefined) return;
      const fileName = fileNames[0];
      const content = fs.readFileSync(fileName, 'utf-8');
      const rawString = String.raw`${content.toString()}`;
      props.onUploadTemplate(path.basename(fileName, path.extname(fileName)), rawString);
    });
  }

  /* todo: shortcuts to operate when focused on an element */
  Mousetrap.bind(['command+shift+e', 'ctrl+shift+e'], () =>
    ExportSelectedProblems()
  );
  Mousetrap.bind(['command+shift+t', 'ctrl+shift+t'], () =>
    props.onToggleAllProblems()
  );
  Mousetrap.bind(['command+shift+c', 'ctrl+shift+c'], () =>
    props.onComplementSelection()
  );
  Mousetrap.bind(['command+shift+s', 'ctrl+shift+s'], () =>
    document.getElementById('searchBar').focus()
  );
  Mousetrap.bind(['command+shift+i', 'ctrl+shift+i'], () =>
    ImportProblems()
  );
  Mousetrap.bind(['command+shift+u', 'ctrl+shift+u'], () =>
    UploadTemplate()
  );

  const templates = [...props.templates.values()];

  return (
    <Menu.Item>
      <Dropdown icon="content">
        <Dropdown.Menu>
          <Dropdown.Item
            text="Export Problems"
            description="Cmd+E"
            onClick={ExportSelectedProblems}
          />
          <Dropdown.Item
          text="Import Problems"
          description="Cmd+I"
          onClick={ImportProblems}
          />
          <Menu.Header>Selection</Menu.Header>
          <Dropdown.Item
            text="Toggle All"
            description="Cmd+T"
            onClick={props.onToggleAllProblems}
          />
          <Dropdown.Item
            text="Complement"
            description="Cmd+C"
            onClick={props.onComplementSelection}
          />
          <Menu.Header>Templates</Menu.Header>
          <Dropdown.Item
          text="Upload Custom"
          description="Cmd+U"
          onClick={UploadTemplate}
          />
          {templates.map(template =>
            <TemplateItem
                key={template.name}
                name={template.name}
                active={template.active}
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
  onComplementSelection: PropTypes.func.isRequired
};


function TemplateItem(props) {
  const { name, active } = props;
  const onSetTemplate = () => props.onSetTemplate(name);
  return (
    <Menu.Item
      name={name}
      active={active}
      onClick={onSetTemplate}
    >
      {active && <Icon name="checkmark" />}
      {name}
    </Menu.Item>
  );
}

TemplateItem.propTypes = {
  name: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onSetTemplate: PropTypes.func.isRequired
};

export default Head;
