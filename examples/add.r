## for unknown reasons, if you want to load dplyr first load stats
## Be sure to silence any output other than the final desired JSON
suppressPackageStartupMessages(library(stats))
suppressPackageStartupMessages(library(dplyr))
suppressPackageStartupMessages(library(jsonlite))

seed <- #< SEED >#
id <- '#< ID >#'

## Any code can go here
x <- rnorm(1)

#< #exercise >#
context <- "To add this question to the database, there needs to be an associated JSON file, named add.json for this example, that provides a relative path from the JSON file to this one along with some other meta information about this exercise such as tags.  Then call TestBank's CLI with

$ node cli.js upsert <path/to/add.json>

If this is a new exercise the above will create a new ID.  If you intend to edit an existing exercise, then put the ID of the exercise you want to overwrite."

questions <- c("Please let me know with a GitHub issues what about this does not make sense.  Thanks.")

output <- toJSON(list(
  id = id,
  seed = seed,
  context = context,
  questions = questions,
  random = list(x = x)))
cat(output)
#< /exercise >#
#< #solution >#
sol <- toJSON(list(
  id = id,
  seed = seed,
  solutions = c("Moar wordz."),
  random = list(x = x)))
cat(sol)
#< /solution >#
