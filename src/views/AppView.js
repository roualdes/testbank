/**
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import React from 'react';

import { Checkbox,
         Container,
         Divider,
         Input,
         Header,
         Menu,
         Message,
         Popup,
         Table
} from 'semantic-ui-react';
import filterQuery from './filterQuery';
import {ParserRules, ParserStart} from './nearley-parser.js';
import nearley from 'nearley';
import Immutable from 'immutable';
import Dropzone from 'react-dropzone';
import yml from 'js-yaml';
import fs from 'fs';


function AppView(props) {
  return (
    <Container fluid>
      <Head {...props} />
      <Body {...props} />
      <Foot {...props} />
    </Container>
  );
};



function Head(props) {
  const FilterProblems = (event) => {
    const text = event.target.value;
    let parser = new nearley.Parser(ParserRules, ParserStart)
                            .feed(text);
    props.onFilterProblems(parser.results);
  };
  return (
    <Menu fluid inverted borderless>
      <Menu.Item>
        <Header inverted>
          TestBank/
        </Header>
      </Menu.Item>
      <Menu.Item position="right">
        <Input inverted focus icon='search'
            size="large" placeholder='search problems...'
               onChange={FilterProblems} />
      </Menu.Item>
    </Menu>
  );
};


function Body(props) {

  const problems = props.problemList.get('problems');

  let queryTree;
  if (props.parseTree.get('tree') == null) {
    queryTree = Immutable.Map();
  } else {
    queryTree = props.parseTree.get('tree');
  }
  console.log(queryTree);

  return (
    <Container fluid>

    {!props.problemList.get('problems_uploaded') && <Upload {...props} />}

      <Table basic="very" definition compact fixed
             singleLine sortable striped unstackable>
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
          .map((problem, k) => (
            <ProblemItem
                key={k}
                question={problem.question}
                answer={problem.answer}
                author={problem.author}
                onSelectProblem={props.onSelectProblem}
                {...props}
            />
          ))}
      </Table.Body>
    </Table>
    </Container>
  );
};

function Upload(props) {

  const onUpload = (acceptedFiles, rejectedFiles) => props.onUploadProblems(
    yml.safeLoad(fs.readFileSync(acceptedFiles[0].path)));

  return (
    <Dropzone className="Card" onDrop={onUpload} multiple={false}>
      <Message info>
        Load your own database by clicking or dropping an appropriately formatted .yml file.
      </Message>
    </Dropzone>
  );
};


function ProblemItem(props) {
  const answer = props.answer == null ? "" : props.answer;
  const {author, problem, question} = props;
  const onSelectProblem = () => props.onSelectProblem(key);

  return (
    <Table.Row>
      <Table.Cell collapsing>
        <Checkbox />
      </Table.Cell>
      <Table.Cell>
        <WidePopup txt={question}/>
      </Table.Cell>
      <Table.Cell>
        <WidePopup txt={answer}/>
      </Table.Cell>
      <Table.Cell>
        {author}
      </Table.Cell>
    </Table.Row>
  );
};

function WidePopup(props) {
  const txt = props.txt;
  return (
    <Popup hideOnScroll wide="very"
           trigger={<p>{txt}</p>}
           content={txt} on="click"/>
  );
};

const Foot = (props) => {
  return (
    <Container fluid textAlign="center">
      <Divider clearing />
        <p>© 2017 Edward A. Roualdes</p>
    </Container>
  );
};


export default AppView;
