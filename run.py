# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

import os
from   flask_migrate import Migrate
from   flask_minify  import Minify
from   sys import exit

from apps.config import config_dict
from apps import create_app, db
from flask import request
import numpy as np
from keras.models import load_model
from flask_cors import CORS

# WARNING: Don't run with debug turned on in production!
DEBUG = (os.getenv('DEBUG', 'False') == 'True')

# The configuration
get_config_mode = 'Debug' if DEBUG else 'Production'

try:

    # Load the configuration using the default values
    app_config = config_dict[get_config_mode.capitalize()]

except KeyError:
    exit('Error: Invalid <config_mode>. Expected values [Debug, Production] ')

app = create_app(app_config)
cors = CORS(app)
Migrate(app, db)

if not DEBUG:
    Minify(app=app, html=True, js=False, cssless=False)
    
if DEBUG:
    app.logger.info('DEBUG       = ' + str(DEBUG)             )
    app.logger.info('DBMS        = ' + app_config.SQLALCHEMY_DATABASE_URI)
    app.logger.info('ASSETS_ROOT = ' + app_config.ASSETS_ROOT )

@app.route('/asdf')
def predict():
    loaded_model = load_model('./model/best_model_site_all.h5')
    # Get the three GET arguments
    arg1 = float(request.args.get('s'))
    arg2 = float(request.args.get('v'))
    arg3 = float(request.args.get('w'))
    
    # Assuming your model expects input in the form of a NumPy array
    input_data = np.array([[arg1, arg2, arg3]])
    reshaped_input = np.tile(input_data, (1, 10, 2))  # Repeat the input along the sequence dimension

    # Make predictions using the loaded model
    prediction = loaded_model.predict(reshaped_input)
    
    # Assuming your model returns a single value
    result = prediction[0][0]
    
    return str(result)

if __name__ == "__main__":
    app.run(port="9002")
