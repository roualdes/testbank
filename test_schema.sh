#!/usr/bin/env bash

# BSD 3-Clause License
# Copyright (c) 2019, Edward A. Roualdes
# All rights reserved.
# See LICENSE in root of this project.

command -v jq >/dev/null 2>&1 || { echo >&2 "TestBank's test_*_schema.sh \
        scripts require jq, but it's not installed.  Aborting."; exit 1; }

STDIN=$(cat);
echo "$STDIN" | jq 'has("id") and
                   (.id |
                        (length == 4 or
                                (length == 1 and (.[] | length == 4)))) and
                   has("seed") and
                   (.seed |
                          (.[] | (. >= 1 and . <= 2147483647) or
                          (. >= 1 and . <= 2147483647))) and
                   (has("questions") or has("solutions")) and
                   if has("questions") then
                      (.context | length > 0) and
                      (.questions | type == "array")
                   elif has("solutions") then
                      (.solutions | type == "array")
                   else
                      false
                   end and
                   has("random") and
                   (.random | type == "object")';
