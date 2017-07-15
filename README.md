# TestBank/

  A database manager for test questions.


# Question file format

  Questions are stored in YAML files, with keys such as `question`, `answer`, `author`, `id`, and `tags`.  The key `tags` is an array of keywords describing the question of interest.  An example file is `src/data/missingdata.yaml`.


# Features

  Questions are searchable via complex-ish queries and selectable via check boxes next to each question.  Currently there are two options for exporting problems: .Rnw files or .Rnw files made for Probsoln.  There is ongoing development in allowing the user to select amongst these output formats, and further, to specify their own output formats.

## Complex-ish Queries

   Queries containing the following elements and their combination are generally allowed:
   * search all keys' values:
     * singleWordString
     * 'quoted string'
     * (a OR (b AND c)) -- nested, infix boolean expressions
   * search a specific key's value:
     * key:singleWordString

## MathJax

   MathJax compatible LaTeX will automatically be converted to symbols.
   

# Build TestBank/

  Run the following commands to build TestBank/ for your platform.

  ```
  yarn install
  yarn build
  yarn package
  ```

# Develop TestBank/

  Clone the repository.  Then run

  ```
  yarn install
  yarn dev
  ```

  and then in a separate terminal tab/window run

  ```
  yarn testDev
  ```

# Roadmap
  - [] Add negation to the queries
  - [] MathJax via webpack [v3.0](https://github.com/mathjax/MathJax/issues/1629)
  - [x] Export questions in different formats: LaTeX, Rnw, txt, ...
  - [x] Selection tool for different export formats
  - [] Drop dependence on internet connection: semanti-ui-css, MathJax
  - [] Custom templates for exporting questions