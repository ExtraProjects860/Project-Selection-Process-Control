import os
from flask import Flask, request, Response
from flask_cors import CORS
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from src.routes.UsuarioRoutes import usuario_routes
from src.routes.VagaRoutes import vaga_routes
from src.routes.InscricaoRoutes import inscricao_routes
from src.routes.StatusProcessoSeletivoRoutes import status_processo_seletivo_routes
from src.middleware.Middleware import Middleware
from src.middleware.RateLimiter import RateLimiter
from datetime import timedelta

load_dotenv()

app: Flask = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY_HOMO")
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=5)
jwt = JWTManager(app)

# só me trouxe problemas ao utilizar middleware personalizado
middleware = Middleware(app)
app.wsgi_app = middleware

rate_limiter = RateLimiter(requests_limit=20, time_window=60)

@app.before_request
def limit_request() -> tuple[Response, int]:
    response = rate_limiter(request)
    if response is not True:
        return response

app.register_blueprint(usuario_routes, url_prefix='/api')
app.register_blueprint(vaga_routes, url_prefix='/api')
app.register_blueprint(inscricao_routes, url_prefix='/api')
app.register_blueprint(status_processo_seletivo_routes, url_prefix='/api')