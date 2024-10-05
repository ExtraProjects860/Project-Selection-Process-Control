from flask import Flask, Response, jsonify, request
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
    
    def __init__(self, app: Flask):
        self.wsgi_app = app.wsgi_app
        app.wsgi_app = self
        self.app = app
        
        
    def __call__(self, environ, start_response) -> Response:
        with self.app.request_context(environ):
            try:
                if not self.is_public_route(request.path):
                    self.verificacoes_rotas()
            except Unauthorized as error:
                res = jsonify({"msg": str(error)})
                res.status_code = 401
                return res(environ, start_response)
            except Exception as error:
                res = jsonify({"msg": str(error)})
                res.status_code = 400
                return res(environ, start_response)
        
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
        return path in [
            "/api/atualizar-para-usuario-ou-admin/<int:id_usuario>/<bool:admin>",
            "/api/criar-vaga",
            "/api/atualizar-vaga/<int:id_vaga>",
            "/api/atualizar-status-vaga/<int:id_vaga>/<status>",
            "/api/excluir-curriculo/<int:id_usuario>"
            "/api/pegar-curriculo/<int:id_usuario>",
            "/api/pegar_vagas_etapas",
            "/api/pegar_todos_status_processo_seletivo",
            "/api/pegar_todos_usuarios"
            "/api/atualizar_status_processo_seletivo/<int:id_status_processo_seletivo>",
        ]