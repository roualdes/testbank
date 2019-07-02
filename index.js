// Copyright (c) 2019, Edward A. Roualdes
// Distributed under the terms of the Modified BSD License.

const bodyParser = require('body-parser');
const express = require('express');

const app = express();
const port = 3000;
const { Session } = require('@jupyterlab/services');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const ex05 = {
  language: 'r',
  exercise: `
library(jsonlite)
output <- toJSON(list(seed = NULL, context = "The minority of this class focused on Logistic regression.  What
  are the two main differences between logistic and linear regression?", questions=c()))
cat(output)
`,
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
`,
};

const ex = {
  5: ex05,
  6: ex06,
};

// start kernels
const rKernel = {
  kernelName: 'ir',
  path: 'r.ipynb',
};

const pythonKernel = {
  kernelName: 'python',
  path: 'python.ipynb',
};

let rSession;
Session.startNew(rKernel)
  .then((s) => {
    rSession = s;
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

let pythonSession;
Session.startNew(pythonKernel)
  .then((s) => {
    pythonSession = s;
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

app.get('/:ID', (req, res) => {
  let e;
  if (req.params.ID) {
    e = ex[req.params.ID];
  } else {
    res.render('error', { error: `No exercise matching ID ${req.params.ID}` });
  }

  let code;
  let path;
  let session;
  switch (e.language) {
    case 'r':
      code = e.exercise;
      ({ path } = rKernel);
      session = rSession;
      break;
    case 'python':
      code = e.exercise;
      ({ path } = pythonKernel);
      session = pythonSession;
      break;
    default:
      res.render('error', {
        error:
      `No kernel available for exercise matching ID ${req.params.ID}.  Please contact eroualdes@csuchico.edu`,
      });
  }

  let output;
  Session.findByPath(path)
    .then(() => {
      const future = session.kernel.requestExecute({ code });
      future.onIOPub = (msg) => {
        const out = msg.content.text;
        if (out != null) {
          output = JSON.parse(out);
        }
      };
      future.onReply = () => {
        // console.log('Finished request');
      };
      return future.done;
    })
    .then(() => {
      res.json(output);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(port, () => console.log(`TestBank listening on port ${port}!`));
