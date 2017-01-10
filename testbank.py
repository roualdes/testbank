# testbank provides a bank of test questions.
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
import jinja2
import yaml
from pathlib import Path
from web import app

# globals/decorators
actions = {}

def action(fn):
    global actions
    assert fn.__doc__, "Document the subcommand {!r}.".format(fn.__name__)
    actions[fn.__name__] = fn
    return fn

# utilities
def qprint(*pargs, **pkwargs):
    """Quiet printing."""
    global args
    if not args.quiet:
        print(*pargs, **pkwargs, flush=True)

# cli: program

parser = argparse.ArgumentParser(
    prog='testbank',
    description='Provide a bank of test questions.'
)

parser.add_argument(
    '-t',
    '--testbank',
    default=Path('tb.yml'),
    type=Path,
    help='set testbank to use'
)

parser.add_argument(
    '-q',
    '--quiet',
    action='store_true',
    help='do not print status along the way'
)

parser.add_argument(
    '-v',
    '--version',
    action='version',
    version='%(prog)s v0.1'
)


# cli: actions

subparser = parser.add_subparsers(
    help='actions to perform on federal agencies',
    metavar='action',
    dest='action'
)

# cli convert

parser_convert = subparser.add_parser(
    'convert',
    aliases='c',
    description='Convert input_file to output_file.',
    help='convert input_file to output_file'
)

parser_convert.add_argument(
    'input_file',
    type=str
)

parser_convert.add_argument(
    'output_file',
    type=str
)


def convert(args):
    """Convert input_file to output_file."""
    ifile = Path(args.input_file)
    ofile = Path(args.output_file)
    with args.testbank.open() as yfile:
        y = yaml.load(yfile)

    latex_jinja_env = jinja2.Environment(
        block_start_string = '\BLOCK{',
        block_end_string = '}',
        variable_start_string = '\VAR{',
        variable_end_string = '}',
        comment_start_string = '\#{',
        comment_end_string = '}',
        line_statement_prefix = '%%',
        line_comment_prefix = '%#',
        trim_blocks = True,
        autoescape = False,
        loader = jinja2.FileSystemLoader(str(ifile.parent.absolute())))

    qprint('Converting: {0} -> {1}... '.format(ifile.name, ofile.name), end='')

    temp = latex_jinja_env.get_template(ifile.name)
    with ofile.absolute().open('w') as out:
        out.write(temp.render(qs=y))

    qprint('done.')


parser_convert.set_defaults(func=convert)


# cli help

parser_help = subparser.add_parser(
    'help',
    aliases='h',
    description='Provide help message for the specified action.',
    help='provide helpful information about specified action',
    formatter_class=argparse.RawDescriptionHelpFormatter
)

parser_help.add_argument(
    'action',
    help='action about which a helpful message is desired',
    choices=[x for x in subparser.choices.keys() if len(x) > 1],
    metavar='action',
    type=str.lower,
    default=None
)


def help_message(args):
    """Print helpful message relative to the specified action."""
    act = args.action
    if act:
        if act in [x for x in subparser.choices.keys() if len(x) > 1]:
            subparser.choices[str(act)].print_help()
        else:
            print('Unknown action.')
    else:
        print('Must specify an action.')


parser_help.set_defaults(func=help_message)

# cli run flaskr
parser_run = subparser.add_parser(
    'run',
    aliases='r',
    description='Provide help message for the specified action.',
    help='provide helpful information about specified action',
    formatter_class=argparse.RawDescriptionHelpFormatter
)

def run_app(debug=None):
    app.run(debug=True)
    return 0

parser_run.set_defaults(func=run_app)

# main program
def main():
    global args
    args = parser.parse_args()
    sys.exit(args.func(args))
