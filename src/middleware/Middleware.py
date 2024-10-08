import re
from flask import jsonify, request
from flask_jwt_extended import verify_jwt_in_request, get_jwt, get_jwt_identity, create_access_token
from werkzeug.exceptions import Unauthorized
from src.validators.Validators import ValidatorsSchema
from src.config.MysqlService import MySQLService

validators_schema: ValidatorsSchema = ValidatorsSchema()

class Middleware:
    
    @staticmethod
    def create_access_jwt(id_usuario: int, email_usuario: str, nome_usuario: str, is_admin: bool) -> str:
        token_de_acesso: str = create_access_token(identity={
            "id": id_usuario, 
            "email": email_usuario, 
            "nome": nome_usuario,
            "admin": is_admin,
        })
        
        return token_de_acesso
    
    def __init__(self, app):
        # sempre quando for utilizar middleware personalizado fazer dessa forma
        self.app = app
        self.wsgi_app = app.wsgi_app


    def __call__(self, environ, start_response):
        # Definindo o contexto da requisição Flask
        with self.app.request_context(environ):
            if request.method == 'OPTIONS' or self.is_public_route(request.path):
                return self.wsgi_app(environ, start_response)
            try:
                self.verificacoes_rotas()
            except Unauthorized as e:
                response = jsonify({"msg": str(e)})
                response.status_code = 401
                return response(environ, start_response)
            except Exception as e:
                response = jsonify({"msg": str(e)})
                response.status_code = 400
                return response(environ, start_response)
        
        return self.wsgi_app(environ, start_response)
    

    def verificacoes_rotas(self) -> None:
        self.verificacoes_jwt()
        
        if self.is_admin_route(request.path):
            self.verificacao_admin()

    
    def verificacoes_jwt(self) -> None:
        verify_jwt_in_request()
                    
        if validators_schema.checar_se_token_esta_na_blacklist(get_jwt(), mysql=MySQLService()):
            raise Unauthorized("Token de acesso revogado")
        
        
    def verificacao_admin(self) -> None:
        claims: dict = get_jwt_identity()
        if claims["admin"] != 1:
            raise Unauthorized("Acesso não autorizado privilégios de admin são necessários")
        
    
    def is_public_route(self, path: str) -> bool:
        return path in [
            "/api/criar-usuario", 
            "/api/login", 
            "/api/requistar-troca-senha",
            "/api/redefinir-senha",
        ]
    
    
    def is_admin_route(self, path: str) -> bool:
        admin_routes: list[str] = [
            r"^/api/atualizar-para-usuario-ou-admin/\d+/\w+$",
            r"^/api/criar-vaga$",
            r"^/api/atualizar-vaga/\d+$",
            r"^/api/atualizar-status-vaga/\d+/[^/]+$",
            r"^/api/excluir-curriculo/\d+$",
            r"^/api/pegar-curriculo/\d+$",
            r"^/api/pegar_vagas_etapas$",
            r"^/api/pegar_todos_status_processo_seletivo$",
            r"^/api/pegar_todos_usuarios$",
            r"^/api/atualizar_status_processo_seletivo/\d+$",
        ]
        
        return any(re.match(route, path) for route in admin_routes)
