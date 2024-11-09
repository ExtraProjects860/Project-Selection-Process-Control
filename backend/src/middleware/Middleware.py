import re
from flask import jsonify, request, Response, Flask
from flask_jwt_extended import verify_jwt_in_request, get_jwt, get_jwt_identity, create_access_token
from jwt import ExpiredSignatureError
from werkzeug.exceptions import Unauthorized
from src.validators.Validators import Validators

validators_schema: Validators = Validators()

class Middleware:
    # eu particularmente odeio o middleware do flask, essa bomba n funciona direito com modificações
    # FastAPI é muito melhor
    
    @staticmethod
    def create_access_jwt(id_usuario: int, email_usuario: str, nome_usuario: str, is_admin: bool, telefone: str, endereco: str) -> str:
        token_de_acesso: str = create_access_token(identity={
            "id": id_usuario, 
            "email": email_usuario, 
            "nome": nome_usuario,
            "admin": is_admin,
            "telefone": telefone,
            "endereco": endereco
        })
        
        return token_de_acesso
    
    def __init__(self, app: Flask):
        # sempre quando for utilizar middleware personalizado fazer dessa forma
        self.app: Flask = app
        self.wsgi_app = app.wsgi_app


    def __call__(self, environ, start_response):
        # definindo o contexto da requisição Flask
        with self.app.request_context(environ):
            if request.method == 'OPTIONS':
                return self.__handle_options(environ, start_response)
            elif self.__is_public_route(request.path):
                return self.wsgi_app(environ, start_response)
            try:
                self.__verificacoes_rotas()
            except ExpiredSignatureError as e:
                response = jsonify({"error-expired-jwt": str(e)})
                response.status_code = 401
                return response(environ, start_response)
            except Unauthorized as e:
                response = jsonify({"error-unauthorized": str(e)})
                response.status_code = 401
                return response(environ, start_response)
            except Exception as e:
                response = jsonify({"error-jwt": str(e)})
                response.status_code = 400
                return response(environ, start_response)
        
        return self.wsgi_app(environ, start_response)
    
    
    def __handle_options(self, environ, start_response) -> Response:
        response: Response = Response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.status_code = 200
        return response(environ, start_response)
    

    def __verificacoes_rotas(self) -> None:
        self.__verificacoes_jwt()
        
        if self.__is_admin_route(request.path):
            self.__verificacao_admin()

    
    def __verificacoes_jwt(self) -> None:
        verify_jwt_in_request()
                    
        if validators_schema.checar_se_token_esta_na_blacklist(get_jwt()):
            raise Unauthorized("Token de acesso revogado")
        
        
    def __verificacao_admin(self) -> None:
        claims: dict = get_jwt_identity()
        if claims["admin"] != 1:
            raise Unauthorized("Acesso não autorizado privilégios de admin são necessários")
        
    
    def __is_public_route(self, path: str) -> bool:
        # poderia ser melhorado
        public_routes: list[str] = [
            r"^/api/criar-usuario/?$", 
            r"^/api/login/?$", 
            r"^/api/requisitar-troca-senha/?$",
            r"^/api/redefinir-senha/?$",
        ]
        
        return any(re.match(route, path) for route in public_routes)
    
    
    def __is_admin_route(self, path: str) -> bool:
        # poderia ser melhorado
        admin_routes: list[str] = [
            r"^/api/atualizar-para-usuario-ou-admin/\d+/\w+/?$",
            r"^/api/criar-vaga/?$",
            r"^/api/atualizar-vaga/\d+/?$",
            r"^/api/excluir-curriculo/\d+/?$",
            r"^/api/pegar-curriculo/\d+/?$",
            r"^/api/pegar-etapas/\d+/?$",
            r"^/api/pegar-setores-cargos/?$",
            r"^/api/pegar-todos_status-processo-seletivo/\d+/?$",
            r"^/api/pegar-todos-usuarios/\d+/?$",
            r"^/api/atualizar-status-processo-seletivo/\d+/?$",
        ]
        
        return any(re.match(route, path) for route in admin_routes)