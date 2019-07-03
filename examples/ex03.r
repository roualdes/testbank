suppressPackageStartupMessages(library(jsonlite))
suppressPackageStartupMessages(library(pander))
suppressPackageStartupMessages(library(dplyr))

tree <- read.csv("https://vincentarelbundock.github.io/Rdatasets/csv/datasets/trees.csv") %>%
  mutate(g = Girth,
         h = Height,
         v = Volume,
         p = Girth*Height,
         type=factor(rep(LETTERS[1:2], length.out=31)))

id <- "{{ ID }}"
seed <- {{ SEED }}

if (is.null(seed)) {
    seed <- sample(.Machine$integer.max, 1)
}

set.seed(seed)

N <- nrow(tree)
tree <- tree[sample(N, N, replace=TRUE), ]

fit <- tree %>%
  lm(v ~ g*h + type, data=.)

beta <- fit %>%
  .[[1]] %>%
  round(2) %>%
  pandoc.table.return %>%
  pandoc.indent(1)

conf <- fit %>%
  confint(level=.92) %>%
  round(2) %>%
  pandoc.table.return %>%
  pandoc.indent(1)

{{ #exercise }}
context <- "The dataset trees consists of 31 observations on two types of trees, $A$ and $B$.  For each tree, height (h, feet), girth (g, diameter in inches), and volume (v, feet$^3$) were measured.\n\n\tEstimated coefficients and confidence intervals appear below."

questions <- c("Identify the response variable(s) and its(their) statistical type(s).",
               "Identify the explanatory variable(s) and its(their) statistical type(s).",
               "Provide R code to reproduce the plot above.",
               "Given the output above, write 1 complete English sentence describing the estimated intercept for type A trees.",
               "Does the estimated intercept for type A trees make sense in context of these data.  Explain why or why not.",
               "Given the output above, write 1 complete English sentence describing the estimated intercept for type B trees.",
               "Does the estimated intercept for type B trees make sense in context of these data.  Explain why or why not.",
               "Note that the fit model has an interaction term between two numerical explanatory variables.  This is new.  Why does an interaction term between Height and Girth (diameter) make sense in the context of this predictive model?  Hint: think geometrically.  Explain.",
               "Given the output above, write 1 complete English sentence describing the estimated slope across Height}.  State clearly to which type(s) of trees this slope applies.  Be careful with your derivative.",
               "Given the output above, write 1 complete English sentence describing the estimated slope across Girth.  State clearly to which type(s) of trees this slope applies.  Be careful with your derivative.",
               "Provide R code to calculate the mean of Girth and the mean of Height by levels of the categorical variable type.  If you use any library, be sure to load it.",
               "Write down either R code or mathematical symbols that would make a prediction for the Volume of a type B tree when Height is equal to its mean, call it $\\\\bar{H}$, and when Girth is equal to its mean, call it $\\\\bar{G}$.",
               "Assume your code above predicts the number $28.44$. Interpret this number in context of these data.",
               "Write down either R code or mathematical symbols that would make a prediction for the Volume of a type B tree when Height is equal to its mean, call it $\\\\bar{H}$, and when Girth is equal to $40$.",
               "Using words from our class, which prediction is more reasonable at Girth equal to $\\\\bar{G}$ or at Girth equal to $40$?  Why?",
               "Interpret the confidence interval for the term factor(type)B in context of these data.",
               "Do these data suggest a significant difference between type A and type B trees?  Explain.")

output <- toJSON(list(
    id = id,
    seed = seed,
    context = paste0(context, beta, conf),
    questions = questions))

cat(output)
{{ /exercise }}
