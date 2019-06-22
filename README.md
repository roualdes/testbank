# TestBank

To perform a quick test of the features, clone this repository and
`cd` into the directory.  Then run

```
$ npm install
$ python3 main.py
```

and then in a separate window run

```
$ curl http://localhost:3000/ID
```

where `ID` can be any integer 1 through 6 (as these integers index
some embedded exercises).

## Examples

The directory `examples` contains an exam from my MATH 314 course at
[Chico State](https://www.csuchico.edu/).  The .Rmd file makes calls to `http://localhost:3000`,
which must be running in order to compile the file.

Some take aways from the example, `exam.Rmd`.

1. Exercise IDs are arbitrary and do not correspond to the numbering
   in the exam.
2. The second question in the exam makes an https request to a third
   party server to obtain a dataset.
3. The third question in the exam is produced with Python code,
   despite this being an RMarkdown document.
4. The fourth question in the exam calls a parallelized function to
   produce the output of the question.
5. I still don't know what to do with plots, so the user must deal
   with this on their end.
6. LaTeX works via MathJax, if you escape enough characters.


## Data Schemas

At least for now, I've settled on the two schemas.  One schema for
the source code of an exercise/solution and one schema for the output of an
exercise.  The source code scheme is very simple and should fit within
a single table of a SQL database.

### Source Code Schema

There are three columns, each of which will hold text.

| language | exercise | solution|
|----------|----------|---------|
| r/python | code to produce an exercise | code to produce a solution |


### Exercise Schema

Each exercise will be returned from the TestBank server as a JSON
object with the following structure.

```
{
    seed: 1234,
    context: "the context of this exercise",
    questions: ["part A", ..., "part Z"],
    tags: ["tag 1", ..., "tag T"] # planned but not implemented,
    solutions: ["solution A", ..., "solution Z"] # planned but not implemented
}
```


## TODO

[] An example with code embedded in the exercise.  This is likely to
get ugly.

[] Use a database.  I'm thinking
[SQLite](https://www.sqlite.org/index.html), until something more
serious is necessary.

[] Build a command line app to verify and insert exercises into the
database.

[] Develop policy for inserting exercises into the database.  Goal is
to minimize complexity of running code in kernel; maximize security,
stability, and response time.

[] Authorization for requested solutions, which, to me, implies that
exercises and their solutions are requested separately.  Hmm, what of
the seed then?


## Dependencies

To successfully run all of the examples, one needs [Python3](https://www.python.org/), [R](https://www.r-project.org/), and the
following packages within each language's ecosystem

- Use [pip](https://pip.pypa.io/en/stable/) to obtain
  - [jupyterlab](https://jupyterlab.readthedocs.io/en/stable/)
  - [numpy](https://www.numpy.org/)
  - [scipy](https://www.scipy.org/)
  - [pandas](https://pandas.pydata.org/)
- Use R's function `install.packages()` to obtain
  - [IRkernel](https://github.com/IRkernel/IRkernel)
  - [dplyr](https://dplyr.tidyverse.org/)
  - [tidyverse](https://ggplot2.tidyverse.org/)
  - [jsonlite](https://cran.r-project.org/web/packages/jsonlite/index.html)
  - [pander](https://rapporter.github.io/pander/)

This is my best attempt at a complete list, let me know what I've missed.

## License

License: Open source, [BSD (3-clause)](https://opensource.org/licenses/BSD-3-Clause).
