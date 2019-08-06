#!/usr/bin/env bash

# BSD 3-Clause License
# Copyright (c) 2019, Edward A. Roualdes
# All rights reserved.
# See LICENSE in root of this project.

command -v jq >/dev/null 2>&1 || { echo >&2 "TestBank's test_schema.sh \
        scripts require jq, but it's not installed.  Aborting."; exit 1; }

STDIN=$(cat);

HAS_ID=$(echo "$STDIN" | jq 'has("id")');
if [[ "$HAS_ID" != "true" ]]; then
  echo "missing key 'id'\n"
fi

HAS_SEED=$(echo "$STDIN" | jq 'has("seed")');
if [[ "$HAS_SEED" != "true" ]]; then
  echo "missing key 'seed'\n"
fi

HAS_QUESTIONS=$(echo "$STDIN" | jq 'has("questions")');
HAS_SOLUTINOS=$(echo "$STDIN" | jq 'has("solutions")');

if [[ "$HAS_QUESTIONS" != "true" ]] || [[ "$HAS_SOLUTIONS" != "true" ]]; then
  if [[ "$HAS_QUESTIONS" == "true" ]]; then

    CONTEXT_CORRECT=$(echo "$STDIN" | jq '(.context | length > 0)');
    if [[ "$CONTEXT_CORRECT" != "true" ]]; then
      echo "'context' is incorrectly specified\n";
    fi

    QUESTIONS_CORRECT=$(echo "$STDIN" | jq '(.questions | type == "array")');
    if [[ "$QUESTIONS_CORRECT" != "true" ]]; then
      echo "'questions' are incorrectly specified\n";
    fi

  fi

  if [[ "$HAS_SOLUTIONS" == "true" ]]; then

    SOLUTIONS_CORRECT=$(echo "$STDIN" | jq '(.solutions | type == "array")');
    if [[ "$SOLUTIONS_CORRECT" != "true" ]]; then
      echo "'solutions' are incorrectly specified\n";
    fi

  fi
else
  echo "exactly one of the following keys is required: 'questions' || 'solutions'\n";
fi

HAS_RANDOM=$(echo "$STDIN" | jq 'has("random")');
if [[ "$HAS_RANDOM" != "true" ]]; then

  RANDOM_CORRECT=$(echo "$STDIN" | jq '(.random | type == "object")');
  if [[ "$RANDOM_CORRECT" != "true" ]]; then
    echo "'random' is incorrectly specified.\n";
  fi

fi
