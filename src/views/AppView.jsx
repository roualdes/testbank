/*
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


import { Checkbox,
         Container,
         Divider,
         Dropdown,
         Input,
         Header,
         Menu,
         Message,
         Popup,
         Table,
} from 'semantic-ui-react';
import React from 'react';
import Immutable from 'immutable';
import nearley from 'nearley';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import yml from 'js-yaml';
import fs from 'fs';
import filterQuery from './filterQuery';
import { ParserRules, ParserStart } from './nearleyParser';

const { dialog } = require('electron').remote;


function AppView(props) {
  return (
    <Container fluid>
      <Head {...props} />
      <Body {...props} />
      <Foot />
    </Container>
  );
}


function Head(props) {
  const FilterProblems = (event) => {
    const text = event.target.value;
    const parser = new nearley.Parser(ParserRules, ParserStart)
                            .feed(text);
    if (event.key === 'Enter') {
      props.onFilterProblems(parser.results);
    }
  };

  const DisplayAllProblems = (event) => {
    const text = event.target.value;
    if (text === '') {
      props.onFilterProblems([]);
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
          inverted
          focus
          icon="search"
          size="large"
          placeholder="search problems..."
          onKeyPress={FilterProblems}
          onChange={DisplayAllProblems}
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
        fs.writeFile(fileName, problems, (err) => {
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
  return (
    <Menu.Item>
      <Dropdown icon="content">
        <Dropdown.Menu>
          <Dropdown.Item onClick={ExportSelectedProblems}>
            export
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  );
}


Actions.propTypes = {
  problemList: PropTypes.instanceOf(Immutable.Map),
};


function Body(props) {
  const problems = [...props.problemList.values()];

  let queryTree;
  if (props.parseTree.get('tree') == null) {
    queryTree = Immutable.Map();
  } else {
    queryTree = props.parseTree.get('tree');
  }

  return (
    <Container fluid>

      {!props.uploaded && <Upload {...props} />}

      {/* TODO would a sortable table be useful? */}
      <Table
        basic="very"
        compact
        fixed
        definition
        singleLine
        striped
        unstackable
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={2}>export</Table.HeaderCell>
            <Table.HeaderCell width={10}>question</Table.HeaderCell>
            <Table.HeaderCell width={8}>answer</Table.HeaderCell>
            <Table.HeaderCell width={2}>author</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {problems
            .filter(problem => filterQuery(problem, queryTree))
            .map(problem => (
              <ProblemItem
                key={problem.uid}
                problem={problem}
                onSelectProblem={props.onSelectProblem}
              />
            ))}
        </Table.Body>
      </Table>
    </Container>
  );
}


Body.propTypes = {
  problemList: PropTypes.instanceOf(Immutable.Map).isRequired,
  parseTree: PropTypes.instanceOf(Immutable.Map).isRequired,
  uploaded: PropTypes.bool.isRequired,
  onSelectProblem: PropTypes.func.isRequired,
};


function Upload(props) {
  const onUpload = acceptedFiles => props.onUploadProblems(
    yml.safeLoad(fs.readFileSync(acceptedFiles[0].path)));

  return (
    <Dropzone className="Card" onDrop={onUpload} multiple={false}>
      <Message info>
        Load your own database by clicking or dropping an appropriately formatted .yml file.
      </Message>
    </Dropzone>
  );
}


Upload.propTypes = {
  onUploadProblems: PropTypes.func.isRequired,
};


function ProblemItem(props) {
  const { problem } = props;
  const { author, exportable, question } = problem;
  const answer = problem.answer == null ? '' : problem.answer;
  const onSelectProblem = () => props.onSelectProblem(problem.uid);

  return (
    <Table.Row>
      <Table.Cell collapsing>
        <Checkbox
          checked={exportable}
          onChange={onSelectProblem}
        />
      </Table.Cell>
      <Table.Cell>
        <WidePopup txt={question} />
      </Table.Cell>
      <Table.Cell>
        <WidePopup txt={answer} />
      </Table.Cell>
      <Table.Cell>
        {author}
      </Table.Cell>
    </Table.Row>
  );
}


ProblemItem.propTypes = {
  problem: PropTypes.instanceOf(Immutable.Record).isRequired,
  onSelectProblem: PropTypes.func.isRequired,
};


function WidePopup(props) {
  const txt = props.txt;

  return (
    <Popup
      hideOnScroll
      wide="very"
      trigger={<p>{txt}</p>}
      content={txt}
      on="click"
    />
  );
}


WidePopup.propTypes = {
  txt: PropTypes.string.isRequired,
};


const Foot = () => (
  <Container fluid textAlign="center">
    <Divider clearing />
    <p>© 2017 Edward A. Roualdes</p>
  </Container>
  );


export default AppView;
