from flask import Blueprint, jsonify, request, Response
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from src.controller.DadosUsuarioController import DadosUsuarioController
from src.controller.UsuarioController import UsuarioController
from src.validators.Validators import Validators

usuario_routes: Blueprint = Blueprint('usuario_routes', __name__)

validators_schema: Validators = Validators()

@usuario_routes.route('/pegar-dados-usuario', methods=['GET'], strict_slashes=False)
@jwt_required()
def pegar_dados_usuario() -> tuple[Response, int]:
    try:
        current_user: dict = get_jwt_identity()
        return jsonify({"success": "Informacoes do usuario recuperadas", "dados": current_user}), 200
    except Exception as error:
        return jsonify({"error": "Exception " + str(error)}), 500
    
    
@usuario_routes.route('/atualizar-para-usuario-ou-admin/<int:id_usuario>/<admin>', methods=['PUT'], strict_slashes=False)
@jwt_required()
def atualizar_para_usuario_ou_admin(id_usuario: int, admin: bool) -> tuple[Response, int]:
    try:
        usuario_controller: UsuarioController = UsuarioController(
           None, None, None, admin
        )
        
        usuario_controller.atualizar_usuario_ou_admin(id_usuario)
        
        return jsonify({"success": "Usuario atualizado com sucesso"}), 204
    except Exception as error:
        return jsonify({"error": "Exception " + str(error)}), 500     
        

@usuario_routes.route('/criar-usuario', methods=['POST'], strict_slashes=False)
def criar_usuario() -> tuple[Response, int]:
    try:
        body: dict[str, str] = request.get_json()
        
        if not validators_schema.validate_body(body):
            raise ValueError("Algum campo obrigatório não foi preenchido")
        
        dados_usuario: DadosUsuarioController = DadosUsuarioController(
            body["nome_usuario"], body["cpf"], 
            body["telefone"], body["endereco"], 
            body["dataNascimento"], body["sexo"], None
        )
        
        usuario_controller: UsuarioController = UsuarioController(
            dados_usuario, body["email"], 
            body["senha"], False
        )
        
        usuario_controller.criar_usuario()
        
        return jsonify({"success": "Usuario criado com sucesso"}), 200
    except ValueError as error:
        return jsonify({"error": "ValueError " + str(error)}), 400
    except Exception as error:
        return jsonify({"error": "Exception " + str(error)}), 500
    

@usuario_routes.route('/login', methods=['POST'], strict_slashes=False)
def login() -> tuple[Response, int]:
    try:
        body: dict[str, str] = request.get_json()
        
        if not validators_schema.validate_body(body):
            raise ValueError("Algum campo obrigatório não foi preenchido")
        
        usuario_controller: UsuarioController = UsuarioController(
            dados_usuario = None, email = body["email"],
            senha = body["senha"], admin = None
        )
        
        token_de_acesso: str = usuario_controller.login()
        
        return jsonify({"success": "Login efetuado com sucesso", "token": token_de_acesso}), 200
    except ValueError as error:
        return jsonify({"error": "ValueError " + str(error)}), 400
    except Exception as error:
        return jsonify({"error": "Exception " + str(error)}), 500


@usuario_routes.route('/logout', methods=['POST'], strict_slashes=False)
@jwt_required()
def logout() -> tuple[Response, int]:
    try:
        jti: str = get_jwt()["jti"]
        
        validators_schema.adicionar_token_na_blacklist(jti)
        
        return jsonify({"success": "Logout efetuado com sucesso"}), 200
    except Exception as error:
        return jsonify({"error": "Erro ao realizar o logout " + str(error)}), 500


@usuario_routes.route('/requisitar-troca-senha', methods=['POST'], strict_slashes=False)
def requisitar_troca_senha():
    try:
        body: dict[str, str] = request.get_json()
        
        if not validators_schema.validate_body(body):
            raise ValueError("Algum campo obrigatório não foi preenchido")
        
        validators_schema.validate_email_exists(body["email"])
        
        usuario_controller: UsuarioController = UsuarioController(
            dados_usuario = None, email = body["email"],
            senha = None, admin = None
        )
        
        usuario_controller.requisitar_token_troca_de_senha()
        
        return jsonify({"success": f"Token de troca de senha enviado para o e-mail {body['email']}"}), 200 
    except ValueError as error:
        return jsonify({"error": "ValueError " + str(error)}), 400
    except Exception as error:
        return jsonify({"error": "Erro ao requisitar token para trocar a senha " + str(error)}), 500


@usuario_routes.route('/redefinir-senha', methods=['POST'], strict_slashes=False)
def redefinir_senha():
    try:
        body: dict[str, str] = request.get_json()
        
        if not validators_schema.validate_body(body):
            raise ValueError("Algum campo obrigatório não foi preenchido")
        
        usuario_controller: UsuarioController = UsuarioController(
            dados_usuario = None, email = body["email"],
            senha = body["nova_senha"], admin = None
        )
        
        usuario_controller.redefinir_senha(body["token"])
        
        return jsonify({"success": "Senha redefinida com sucesso"}), 200
    except ValueError as error:
        return jsonify({"error": "ValueError " + str(error)}), 400
    except Exception as error:
        return jsonify({"error": "Erro ao redefinir a senha " + str(error)}), 500


@usuario_routes.route('/atualizar-dados/<int:id_usuario>', methods=['PUT'], strict_slashes=False)
@jwt_required()
def atualizar_dados(id_usuario: int):
    try:
        body: dict[str, str] = request.get_json()
        
        if not validators_schema.validate_body(body):
            raise ValueError("Algum campo obrigatório não foi preenchido")
        
        usuario_controller: DadosUsuarioController = DadosUsuarioController(
            nome_usuario=None, cpf=None,
            telefone=body["novo_telefone"], endereco=body["novo_endereco"],
            dataNascimento=None, sexo=None, curriculo=None
        )
        
        usuario_controller.atualizar_dados_usuario(id_usuario, body["novo_email"], body["nova_senha"])
        
        return jsonify({"success": "Dados atualizados com sucesso"}), 204
    except ValueError as error:
        return jsonify({"error": "ValueError " + str(error)}), 400
    except Exception as error:
        return jsonify({"error": "Erro ao atualizar os dados " + str(error)}), 500