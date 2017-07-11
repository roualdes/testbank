/**
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Checkbox, Container, Message, Popup, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import yaml from 'js-yaml';
import fs from 'fs';
import React from 'react';
import Immutable from 'immutable';

function Body(props) {
  const problems = [...props.problems.values()];

  return (
    <Container fluid>

      {!props.uploaded && <Upload {...props} />}

      {/* todo: would a sortable table be useful? */}
      <Table
        basic="very"
        compact
        fixed
        definition
        singleLine
        striped
        unstackable
        selectable
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
            .filter(problem => problem.display)
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
  problems: PropTypes.instanceOf(Immutable.Map).isRequired,
  uploaded: PropTypes.bool.isRequired,
  onSelectProblem: PropTypes.func.isRequired
};

function Upload(props) {
  const onUpload = acceptedFiles =>
    props.onUploadProblems(
      yaml.safeLoad(fs.readFileSync(acceptedFiles[0].path))
    );

  return (
    <Dropzone className="Card" onDrop={onUpload} multiple={false}>
      <Message info>
        Load your own database by clicking or dropping an appropriately formatted .yaml file.
      </Message>
    </Dropzone>
  );
}

Upload.propTypes = {
  onUploadProblems: PropTypes.func.isRequired
};

function ProblemItem(props) {
  const { problem } = props;
  const { author, exportable, question } = problem;
  const answer = problem.answer == null ? '' : problem.answer;
  const onSelectProblem = () => props.onSelectProblem(problem.uid);

  return (
    <Table.Row>
      <Table.Cell collapsing>
        <Checkbox checked={exportable} onChange={onSelectProblem} />
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
  onSelectProblem: PropTypes.func.isRequired
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
  txt: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired
};

export default Body;
