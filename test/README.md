# TestBank Tests

The goal is to make entering exercises into the database as automatic
as possible, while simultaneously addressing _security_ of the TestBank
sever, _stability_ of the kernel, and _response_ time.

### Testing Each New Exercise

The script `test_exercise.sh` is meant to test each new problem before
it is entered into the database. This directory contains exercises
(pairs of files, .json and .lang) named for the check within
`test_exercise.sh` that `test_exercise.sh` is meant to catch.

There should maybe even a script that tests all the files in this directory.

### Testing the Database

There should also be a script to test each exercise within the database
`db.json`.
