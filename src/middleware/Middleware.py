from flask import Flask, Response, jsonify, request
from flask_jwt_extended import verify_jwt_in_request, get_jwt, create_access_token
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

    
    def verificacoes_jwt(self) -> None:
        verify_jwt_in_request()
                    
        if validators_schema.checar_se_token_esta_na_blacklist(get_jwt(), mysql=MySQLService()):
            raise Unauthorized("Token de acesso revogado")
        
        # verificar de implementar para chegar de se usuário é normal ou admin para acessar a rota
        
    
    def is_public_route(self, path: str) -> bool:
        return path in [
            "/api/criar-usuario", 
            "/api/login", 
            "/api/requistar-troca-senha",
            "/api/redefinir-senha",
        ]
        
    # não está sendo usado
    def verificar_admin_rotas(self, current_user: dict) -> None:
        if not current_user["admin"]:
            raise Unauthorized("Você não tem permissão para acessar esta rota")
     
        
    # Não será necessário, pois o flask já verifica o conteúdo da requisição
    # def verificacao_corpo_requisicao_json(self) -> None:
    #     if not request.is_json or not request.content_type == "application/json":
    #         raise Exception("Corpo da requisição deve ser JSON")
        
    
    # Não será necessário, pois o flask já verifica o método http da requisição
    # def verificacao_gerais(self) -> None:
    #     if not request.method in ["GET", "POST", "PUT", "DELETE"]:
    #         raise Exception("Metodo não permitido")
        
    #     # verificação se a rota existe 
    #     if request.path not in self.app.url_map._rules_by_endpoint:
    #         raise Exception("Rota não encontrada")