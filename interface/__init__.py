import binascii
import os
from flask import Flask, session
from flask_session import Session
from flask_wtf.csrf import CSRFProtect
from pathlib import Path

csrf = CSRFProtect()

app = Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem'
app.secret_key = binascii.hexlify(os.urandom(24))
app.config['UPLOAD_FOLDER'] = Path('./data')

csrf.init_app(app)

Session(app)

from interface import views
