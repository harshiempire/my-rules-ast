from flask import Flask
from flask_cors import CORS
from extensions import db
from routes import rule_bp, evaluation_bp
import os
from dotenv import load_dotenv

load_dotenv()


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DB_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS', False)
    db.init_app(app)

    # Register Blueprints
    app.register_blueprint(rule_bp)
    app.register_blueprint(evaluation_bp)

    # Create database tables
    with app.app_context():
        db.create_all()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5001)