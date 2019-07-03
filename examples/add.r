suppressPackageStartupMessages(library(jsonlite))

admit <- read.csv("https://raw.githubusercontent.com/roualdes/data/master/admissions.csv")

X <- model.matrix(~ 0 + gre + gpa, data=admit)

pred_logistic <- function(mX, betahat) {
  lin <- apply(mX, 1, function(row) {sum(betahat * row)})
  1 / (1 + exp(-lin))
}

ll <- function(beta, y, mX) {
    beta0 <- beta[1]
    betas <- beta[-1]
    lin <- apply(mX, 1, function(row) {beta0 + sum(betas * row)})
    sum( log1p(exp(lin)) - y*lin )
}

beta_hat <- optim(rnorm(3), ll, method="L-BFGS-B", y=admit$admit, mX=scale(X))$par

phat <- round(pred_logistic(matrix(c(1, 0, 0), ncol=3), beta_hat), 2)

blogistic <- function(data, idx) {
    y <- data[idx, 1]
    X <- data[idx, -1]
    beta_hat <- optim(rnorm(3), ll, method="L-BFGS-B", y=y, mX=X)$par
    diff(pred_logistic(matrix(c(1, 0, 0, # intercept, gre, gpa
                                1, 0, 1),
                              ncol=3, byrow=TRUE), beta_hat))
}

b <- boot::boot(cbind(admit$admit, scale(X)),
                R=999,
                blogistic,
                ncpus=3, parallel="multicore")
seed <- b$seed
ci <- round(boot::boot.ci(b, type="perc")$percent[4:5], 2)

{{ #exercise }}
context <- "The dataset $\\\\texttt{admission}$ contains 400 randomly selected
  students' $\\\\texttt{gpa}$, $\\\\texttt{gre}$ (graduate school equivalent of
  SAT) scores, and a Bernoulli random variable named $\\\\texttt{admit}$
  that takes on the value $1$ if the student was admitted into
  graduate school and a $0$ otherwise.\n\n\tAssume you fit with logistic regression the response variable $\\\\texttt{admit}$ to the $\\\\textit{normalized}$ numerical explanatory variables $\\\\texttt{gre}$ and $\\\\texttt{gpa}$, in this order."

questions <- c(sprintf("With a row of the model matrix as \`c(1, 0, 0)\`, interpret, in context of the data, the predicted probability p = %.2f.", phat),
               paste("With a row of the model matrix as \`c(1, 0, 0)\`, interpret, in context of the data, the 95% confidence interval",  sprintf("(%.2f, %.2f).", ci[1], ci[2])))

output <- toJSON(list(
  id = id,
  seed = seed,
  context = context,
  questions = questions))
cat(output)
{{ /exercise }}
