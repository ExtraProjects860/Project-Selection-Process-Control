from flask import Flask, Response, jsonify, request
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity, get_jwt
from werkzeug.exceptions import Unauthorized
from validators.Validators import ValidatorsSchema

class Middleware:
    
    def __init__(self, app: Flask):
        self.wsgi_app = app.wsgi_app
        app.wsgi_app = self
        self.app = app
        
        
    def __call__(self, environ, start_response) -> Response:
        with self.app.request_context(environ):
            
            protected_routes = ['/api/rota-teste-protegida']
            
            if request.path in protected_routes:
                try:
                    self.verificacoes_jwt()
                except Unauthorized as error:
                    res = jsonify({"msg": str(error)})
                    res.status_code = 401
                    return res(environ, start_response)
        
        return self.wsgi_app(environ, start_response)
    
    
    def verificacoes_jwt(self) -> None:
        auth_header: str = request.headers.get("Authorization")
        if auth_header is None:
            raise Unauthorized("Token de acesso não encontrado")
                    
        self.verify_jwt()
                    
        if ValidatorsSchema.checar_se_token_esta_na_blacklist(get_jwt()):
            raise Unauthorized("Token de acesso revogado")
                    
        current_user: dict = get_jwt_identity()
        # self.additional_checks(current_user)
    

    def verify_jwt(self) -> None:
        verify_jwt_in_request()
        

    def additional_checks(self, current_user: dict) -> None:
        if not current_user["admin"]:
            raise Unauthorized("Você não tem permissão para acessar esta rota")