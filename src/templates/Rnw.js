/**
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Rnw = String.raw`\documentclass[12pt]{article}
\input{RnwOptions.tex}
\begin{document}
\chead{Math 314 \hfill Homework {\color{red} NUMBER: NAME} \hfill Due: {\color{red} 2017-07-25}}

<<setup, include=FALSE>>=
options(replace.assign=TRUE, width=60)
opts_knit$set(progress=FALSE)
@

\begin{enumerate}
{{~ it.problems :problem }}
\item {{= problem.question }}
{{~}}
\end{enumerate}

\end{document}
`;

export default Rnw;
