import binascii
import os
from flask import Flask, session
from flask_session import Session
from pathlib import Path

app = Flask(__name__)

app.config['SESSION_TYPE'] = 'filesystem'
app.secret_key = binascii.hexlify(os.urandom(24))
app.config['UPLOAD_FOLDER'] = Path('./data')

Session(app)

from web import views
