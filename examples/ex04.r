suppressPackageStartupMessages(library(jsonlite))

id <- '{{ ID }}'
seed <- {{ SEED }}

output <- toJSON(list(
  id = id,
  seed = seed,
  context = "The minority of this class focused on Logistic regression.  What are the two main differences between logistic and linear regression?",
  questions=c()))

cat(output)
