/**
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Format from './Format';

// todo: handle multiple choice questions
// todo: handle multiple part questions

function Rnw(probs) {
  return Format`\documentclass[12pt]{article}
\input{RnwOptions.tex}
\begin{document}
\chead{Math 314 -- Homework {\color{red} NUMBER: NAME}}

<<setup, include=FALSE>>=
options(replace.assign=TRUE, width=60)
opts_knit$set(progress=FALSE)
@

Due: {\color{red} TBA }

\begin{enumerate}
  ${probs.map(
    ({ question, answer }) => Format`
  \item ${question}
  \item ${answer}
  `
  )}
\end{enumerate}

\end{document}
`;
}

export default Rnw;
