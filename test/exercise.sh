#!/usr/bin/env bash

# BSD 3-Clause License
# Copyright (c) 2019, Edward A. Roualdes
# All rights reserved.
# See LICENSE in root of this project.

command -v node >/dev/null 2>&1 || { echo >&2 "TestBank's
        test_exercise.sh \ scripts require node, but it's not
        installed.  Be sure to install all necessary Node.js packages
        as well.  Aborting."; exit 1; }

command -v jq >/dev/null 2>&1 || { echo >&2 "TestBank's test_exercise.sh \
        scripts require jq, but it's not installed.  Aborting."; exit 1; }

command -v lr >/dev/null 2>&1 || { echo >&2 "TestBank's
        test_exercise.sh \ scripts require littler (lr), but it's not
        installed.  Be sure to install all necessary R packages as
        well.  Aborting."; exit 1; }

command -v lr >/dev/null 2>&1 || alias | grep 'lr' >/dev/null 2>&1 ||

command -v python3 >/dev/null 2>&1 || { echo >&2 "TestBank's
        test_exercise.sh \ scripts require python3, but it's not
        installed.  Be sure to install all necessary Python packages
        as well.  Aborting."; exit 1; }

testDir=$(dirname ${BASH_SOURCE[0]});

verbose=0
# verbosity prints the input to each stage
if [ "$1" == "-v" ] || [ "$1" == "--verbose" ]; then
  verbose=1;
  shift
fi

jsonpath="$1"                   # relative to current directory
file=$(cat "$jsonpath" | jq -r '.code')
fileDir=$(dirname "$jsonpath")
filepath="$fileDir/$file"

extension="${file##*.}"

exs=(exercise solution)
for ex in ${exs[@]}; do
  failed=0
  printf 'Testing %s, %s...' "$filepath" "$ex"

  mustache=$(node cli.js test "$jsonpath" "$ex");
  status=$?
  if [ $status -ne 0 ]; then
    echo "Mustache templates incorrectly specified.";

    if [ "$verbose" -ne 0 ]; then
      cat "$jsonpath";
    fi

    failed=1;
    continue;
  fi

  # something to figure out which program needs to run
  if [ "$failed" -eq 0 ]; then
    if [ "$extension" == "py" ]; then
      code=$(echo "$mustache" | python3);
    elif [ "$extension" == "r" ] || [ "$extension" == "R" ]; then
      code=`lr -e "$(echo "$mustache")"`
    else
      echo "exercise.sh does not know the programming langauge specified in $jsonpath.";
      continue;
    fi
    status=$?
    if [ $status -ne 0 ]; then
      echo "Code or Mustache templates incorrectly specified.";

      if [ "$verbose" -ne 0 ]; then
        echo "$mustache";       # print input to this paragraph
      fi

      failed=1;
      continue;
    fi
  fi

  json=$(echo "$code" | python3 -m json.tool);
  status=$?
  if [ $status -ne 0 ]; then
    echo "JSON incorrectly specified.";

    if [ "$verbose" -ne 0 ]; then
      echo "$code";
    fi

    failed=1;
    continue;
  fi

  schema=$(echo "$json" | bash "$testDir"/schema.sh);
  if [ ! -z "$schema" ]; then
    printf "\n$schema";

    if [ "$verbose" -ne 0 ]; then
      echo "$json";
    fi

    failed=1;
    continue;
  fi

  if [ "$failed" -ne 0 ]; then
    printf "FAIL.\n";
  else
    printf "pass.\n";
  fi
done
