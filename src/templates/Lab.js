/**
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Lab = String.raw`\documentclass[12pt]{article}
\input{TexOptions.tex}
\begin{document}
\chead{CSCI 111-{\color{red} SECTION-NUMBER} \hfill
Lab {\color{red} LAB-NUMBER: LAB-NAME} \hfill
Due: {\color{red} 2017-07-24 @ 11:59 pm}}

{{= it.problem.question }}

{{? it.problem.parts.length > 0 }}
\begin{enumerate}

{{~ it.problem.parts :part }}
  \item {{= part }}
{{~}}

\end{enumerate}
{{?}}
\end{document}
`;

export default Lab;
