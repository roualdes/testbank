## Using the `probsoln` \LaTeX package as a testbank

* Problems with their solutions are kept in organized external RNW files. 
* The exam RNW sources the relevant pool of questions in a code chunk before you `\begin{document}`

```
<<desc,child="Pool_Descriptive.Rnw">>=
@
```

* Problems are called into the exam file by `\useproblem{}`

```
\useproblem{insectspray_tellme}
```

* Solutions can be automatically added to the compiled document by uncommenting the `%\showanswers` on line 28.


#### Problem definition format

* Each question has to have a unique name (reference link). 
* If you are going to use R inside the question text anywhere, `[fragile]` needs to be added to the defproblem. 
* The extra vspace is helpful for spacing on the solution page. 

```
\begin{defproblem}{question_name}[fragile]
  Question text
  \begin{onlysolution}[fragile]%
    \begin{solution}
        Answer text.
    \vspace{-1cm}
    \end{solution}
  \end{onlysolution}
\end{defproblem}
```
