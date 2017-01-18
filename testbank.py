# testbank is a database manager for test questions.
# Copyright (C) 2017 Edward A. Roualdes

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

import sys
import argparse
from interface import app

# cli
parser = argparse.ArgumentParser(
    prog='testbank',
    description='Provide a bank of test questions.'
)

parser.add_argument(
    '-v',
    '--version',
    action='version',
    version='%(prog)s v0.1'
)

parser.add_argument(
    '-d',
    '--database',
    dest='databasefile',
    help="a YAML file to use as the database"
)

def main():
    args = parser.parse_args()
    app.run(debug=True)
    sys.exit(0)
