import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from src.routes.UsuarioRoutes import usuario_routes
from src.routes.VagaRoutes import vaga_routes
from src.routes.InscricaoRoutes import inscricao_routes
from src.middleware.Middleware import Middleware
from datetime import timedelta

load_dotenv()

app: Flask = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY_HOMO")
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
jwt = JWTManager(app)
app.wsgi_app = Middleware(app)

CORS(app, resources={r"/*": {"origins": "*"}})

app.register_blueprint(usuario_routes, url_prefix='/api')
app.register_blueprint(vaga_routes, url_prefix='/api')
app.register_blueprint(inscricao_routes, url_prefix='/api')