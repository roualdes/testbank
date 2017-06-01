/**
 * Copyright (c) 2017-present, Edward A. Roualdes..
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import React from 'react';

import App from 'grommet/components/App';
import Anchor from 'grommet/components/Anchor';
import Article from 'grommet/components/Article';
import Accordion from 'grommet/components/Accordion';
import AccordionPanel from 'grommet/components/AccordionPanel';
import Box from 'grommet/components/Box';
import Card from 'grommet/components/Card';
import Header from 'grommet/components/Header';
import Label from 'grommet/components/Label';
import Footer from 'grommet/components/Footer';
import Menu from 'grommet/components/Menu';
import MenuIcon from 'grommet/components/icons/base/Menu';
import Section from 'grommet/components/Section';
import Paragraph from 'grommet/components/Paragraph';
import Title from 'grommet/components/Title';
import Search from 'grommet/components/Search';
import Dropzone from 'react-dropzone';
import YML from 'js-yaml';
import FS from 'fs';


const AppView = (props) => {
    return (
        <App centered={ false }>
            <Article>
                <Head {...props} />
                <Body {...props} />
                <Foot {...props} />
            </Article>
        </App>
    );
}

const Head = (props) => {
    const onChange = (event) => props.onFilterProblems(event.target.value);
    return (
      <Header direction='row' justify='between'
            pad={ {horizontal: 'medium'} } colorIndex='grey-1'>
          <Title>TestBank/</Title>
          <Search fill inline size='medium'
                  placeHolder='search' value={ props.fText }
          onDOMChange={ onChange }/>
      </Header>
    );
}

const Body = (props) => {
    return (
        <Section margin='small' pad='small'>
            {!props.problemList.get('problems_uploaded') && <Upload {...props} /> }
            <ProblemList {...props} />
        </Section>
    );
}


const ProblemList = (props) => {
    const problems = props.problemList.get('problems');
    const fText = props.fText;
    let listItems = [];

    problems.forEach((problem) => {
        if (problem.question.indexOf(fText) > -1 || problem.answer.indexOf(fText) > -1 || problem.author.indexOf(fText) > -1) {
            listItems.push(
                <AccordionPanel key={ problem.id }
                                heading={ problem.question.substring(0,60) }
                                pad='small'>
                    {/* TODO MathJax */}
                    <Label size='small'> Question </Label>
                    { problem.question }

                    <Label size='small'> Answer </Label>
                    { problem.answer }

                    <Label size='small'> Author </Label>
                    { problem.author }

                </AccordionPanel>);
        }
    });
    return (
        <Accordion openMulti>
            { listItems }
        </Accordion>
    )
}


const Upload = (props) => {

    const onUpload = (acceptedFiles, rejectedFiles) => props.onUploadProblems(
        YML.safeLoad(FS.readFileSync(acceptedFiles[0].path))
    )

    return (
        <Section colorIndex='critical' margin='none' pad='none'>
            <Dropzone className='Card' onDrop={ onUpload } multiple={ false }>
                <Card size={ {width: 'xlarge'} } margin='none' pad='none'>
                    Load your own database by clicking or dropping an appropriately formatted .yml file.
                </Card>
            </Dropzone>
        </Section>
    );
}





const Foot = (props) => {
    return (
        <Section>
            <Footer primary appCentered direction='column' align='center' pad='small'>
                <p>© 2017 Edward A. Roualdes</p>
            </Footer>
        </Section>
    );
}





export default AppView;
