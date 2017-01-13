from flask import render_template, session, request, redirect, url_for
from werkzeug.utils import secure_filename
from web import app
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

    if session.get('database') and database == 'missingdata.yml':
        database = session['database']

    testbank_data = p.absolute() / database
    with testbank_data.open('r') as yfile:
        data = yaml.load(yfile)

    return render_template('database.html',
                           title='database',
                           data=data)


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        # check if the post request has the file part
        # if 'file' not in request.files:
        #     print("No file part.")
        #     return redirect(request.url)
        file = request.files.get('file', None)
        if file.filename == '':
            print("No file selected.")
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            print(app.config['UPLOAD_FOLDER'])
            file.save(str(app.config['UPLOAD_FOLDER'].absolute() / filename))
            return redirect(url_for('database',
                                    database=filename))
    return render_template('upload.html',
                           title='doh')

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
    shutdown_server()
    return 'Server shutting down...'
