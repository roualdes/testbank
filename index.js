// Copyright (c) 2019, Edward A. Roualdes
// Distributed under the terms of the Modified BSD License.

'use strict';

const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const port = 3000
const Session = require('@jupyterlab/services').Session;
const HashID = require('./hashid.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const ex04 = {
    language: 'r',
    exercise: `
suppressPackageStartupMessages(library(jsonlite))
suppressPackageStartupMessages(library(pander))
suppressPackageStartupMessages(library(dplyr))

tree <- read.csv("https://vincentarelbundock.github.io/Rdatasets/csv/datasets/trees.csv") %>%
  mutate(g = Girth,
         h = Height,
         v = Volume,
         p = Girth*Height,
         type=factor(rep(LETTERS[1:2], length.out=31)))

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

seed <- sample(.Machine$integer.max, 1)
output <- toJSON(list(seed = seed,
                context = paste0(context, beta, conf),
                questions = questions))

cat(output)
`
};

const ex05 = {
    language: 'r',
    exercise: `
library(jsonlite)
output <- toJSON(list(seed = NULL, context = "The minority of this class focused on Logistic regression.  What
  are the two main differences between logistic and linear regression?", questions=c()))
cat(output)
`
};

const ex06 = {
    language: 'r',
    exercise: `
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

context <- "The dataset $\\\\texttt{admission}$ contains 400 randomly selected
  students' $\\\\texttt{gpa}$, $\\\\texttt{gre}$ (graduate school equivalent of
  SAT) scores, and a Bernoulli random variable named $\\\\texttt{admit}$
  that takes on the value $1$ if the student was admitted into
  graduate school and a $0$ otherwise.\n\n\tAssume you fit with logistic regression the response variable $\\\\texttt{admit}$ to the $\\\\textit{normalized}$ numerical explanatory variables $\\\\texttt{gre}$ and $\\\\texttt{gpa}$, in this order."

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

questions <- c(sprintf("With a row of the model matrix as \`c(1, 0, 0)\`, interpret, in context of the data, the predicted probability p = %.2f.", phat),
               paste("With a row of the model matrix as \`c(1, 0, 0)\`, interpret, in context of the data, the 95% confidence interval",  sprintf("(%.2f, %.2f).", ci[1], ci[2])))

output <- toJSON(list(seed = seed, context = context, questions = questions))
cat(output)
`
};


const ex = {
    1: ex01,
    2: ex02,
    3: ex03,
    4: ex04,
    5: ex05,
    6: ex06
};


// start kernels
const r_kernel = {
    kernelName: 'ir',
    path: 'r.ipynb'
};

const python_kernel = {
    kernelName: 'python',
    path: 'python.ipynb'
};

var r_session;
Session.startNew(r_kernel)
    .then(function(s) {
        r_session = s;
    })
    .catch(function(err) {
        console.error(err);
        process.exit(1);
    });

var python_session;
Session.startNew(python_kernel)
    .then(function(s) {
        python_session = s;
    })
    .catch(function(err) {
        console.error(err);
        process.exit(1);
    });

app.get('/:ID', function(req, res) {
    var e;
    if (req.params.ID) {
        e = ex[req.params.ID];
    } else {
        res.render('error', {error: `No exercise matching ID ${req.params.ID}`});
    }

    var code;
    var path;
    var session;
    switch (e.language) {
    case 'r':
        code = e.exercise;
        path = r_kernel.path;
        session = r_session;
        break;
    case 'python':
        code = e.exercise;
        path = python_kernel.path;
        session = python_session;
        break;
    default:
        res.render('error', {error: 'No kernel available for exercise matching ID ${req.params.ID}.  Please contact eroualdes@csuchico.edu'});
    }

    var output;
    Session
        .findByPath(path)
        .then(function() {
            let future = session.kernel.requestExecute({ code: code });
            future.onIOPub = (msg) => {
                let out = msg.content.text;
                if (out != null) {
                    output = JSON.parse(out);
                }
            };
            future.onReply = function(reply) {
                //console.log('Finished request');
            };
            return future.done;
        })
        .then(function() {
            res.json(output);
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.listen(port, () => console.log(`TestBank listening on port ${port}!`))
