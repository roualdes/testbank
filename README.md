# TestBank/

  A database manager for test questions.

# Question file format

  Questions are stored in YAML files, with keys such as `question`, `answer`, `author`, `id`, and `tags`.  The key `tags` is an array of keywords describing the question of interest.  An example file is `src/data/missingdata.yml`.

# Build TestBank/

  Run the following commands to build TestBank/ for your platform.

  `yarn install`
  `yarn build`
  `yarn package`

# Develop TestBank/

  Clone the repository.  Then run

  `yarn install`
  `yarn dev`

  and in a separate terminal run
  `yarn testDev`

# Roadmap
  - MathJax
  - Complex queries
  - Export questions in different formats: LaTeX, YAML, ...
  - Custom templates for exporting questions