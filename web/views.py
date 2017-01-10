from flask import render_template
from web import app
from pathlib import Path
import re
import yaml

@app.route('/')
@app.route('/index')
def index():
    user = {'nickname': 'Edward'}
    p = Path()
    testbank_data = p.absolute() / 'tb.yml'
    with testbank_data.open('r') as yfile:
        data = yaml.load(yfile)
    return render_template('index.html',
                           title='Home',
                           user=user,
                           data=data)
