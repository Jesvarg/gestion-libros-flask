from flask import Flask
from flask_cors import CORS
from models import db

from routes.libros import libros_bp
from routes.auth import auth_bp

app = Flask(__name__)
app.config.from_pyfile('config.py')

db.init_app(app)
CORS(app, resources={r"/*": {"origins": "*"}})
app.register_blueprint(libros_bp)
app.register_blueprint(auth_bp)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        # Sembrar datos de ejemplo
        from seed_data import seed_data
        seed_data()
        
    app.run(debug=True)
