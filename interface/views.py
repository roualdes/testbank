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

from flask import render_template, session, request, redirect, url_for
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from werkzeug.utils import secure_filename
from interface import app
from pathlib import Path
import re
import os
import yaml

ALLOWED_EXTENSIONS = set(['yml'])

@app.route('/')
@app.route('/index')
@app.route('/welcome')
def index():

    return render_template('index.html',
                           title='welcome')


@app.route('/database/', defaults={'database': 'missingdata.yml'})
@app.route('/database/<string:database>')
def database(database):
    p = Path('./data')

    if database != 'missingdata.yml':
        session['database'] = database

    # if session.get('database') and database == 'missingdata.yml':
    #     database = session['database']

    testbank_data = p.absolute() / database
    if not testbank_data.exists():
        testbank_data = p.absolute() / 'missingdata.yml'

    with testbank_data.open('r') as yfile:
        data = yaml.load(yfile)

    return render_template('database.html',
                           title='database',
                           data=data)


class DatabaseForm(FlaskForm):
    file = FileField(validators=[FileRequired(),
                                 FileAllowed(['yml'],
                                             'Properly format YAML files only.')])

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    form = DatabaseForm()
    if request.method == 'POST':
        if form.validate_on_submit():
            f = form.file.data
            if f:
                filename = secure_filename(f.filename)
                fldr = app.config['UPLOAD_FOLDER'].absolute()
                app.config['DATABASEFILE'] =  fldr/filename
                f.save(str(app.config['DATABASEFILE']))
                return redirect(url_for('database',
                                        database=filename))
    return render_template('upload.html',
                           form=form,
                           title='upload')

@app.route('/add')
def add():

    return render_template('add.html',
                           title='add')



@app.route('/edit')
def edit():

    return render_template('edit.html',
                           title='edit')


def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()

@app.route('/shutdown', methods=['GET'])
def shutdown():
    f = getattr(app.config, 'DATABASEFILE', None)
    if f:
        if f.exists():
            os.remove(str(app.config['DATABASEFILE']))
    shutdown_server()
    return 'Server shut down.'
