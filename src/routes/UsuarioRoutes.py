from flask import Blueprint, jsonify, request, Response
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from src.controller.DadosUsuarioController import DadosUsuarioController
from src.controller.UsuarioController import UsuarioController
from src.validators.Validators import ValidatorsSchema

usuario_routes: Blueprint = Blueprint('usuario_routes', __name__)

validators_schema: ValidatorsSchema = ValidatorsSchema()

@usuario_routes.route('/pegar-dados-usuario', methods=['GET'])
@jwt_required()
def pegar_dados_usuario() -> tuple[Response, int]:
    try:
        current_user: dict = get_jwt_identity()
        return jsonify({"success": current_user}), 200
    except Exception as error:
        return jsonify({"error": "Erro: " + str(error)}), 500


@usuario_routes.route('/criar-usuario', methods=['POST'])
def criar_usuario() -> tuple[Response, int]:
    try:
        body: dict[str, str] = request.get_json()
        
        if not validators_schema.validate_body(body):
            raise ValueError("Algum campo obrigatório não foi preenchido")
        
        dados_usuario: DadosUsuarioController = DadosUsuarioController(
            nome_usuario = body["nome_usuario"], cpf = body["cpf"], 
            telefone = body["telefone"], endereco = body["endereco"], 
            dataNascimento = body["dataNascimento"], sexo = body["sexo"], curriculo = None
        )
        
        usuario_controller: UsuarioController = UsuarioController(
            dados_usuario = dados_usuario, email = body["email"], 
            senha = body["senha"], admin = True # não esquecer de trocar para false depois
        )
        
        usuario_controller.criar_usuario()
        
        return jsonify({"success": "Usuário criado com sucesso"}), 200
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    except Exception as error:
        return jsonify({"error": "Algum erro interno no servidor ocorreu ao criar o usuário: " + str(error)}), 500
    

@usuario_routes.route('/login', methods=['POST'])
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
        return jsonify({"error": str(error)}), 400
    except Exception as error:
        return jsonify({"error": "Erro ao logar o usuário: " + str(error)}), 500


@usuario_routes.route('/logout', methods=['POST'])
@jwt_required()
def logout() -> tuple[Response, int]:
    try:
        jti: str = get_jwt()["jti"]
        
        validators_schema.adicionar_token_na_blacklist(jti)
        
        return jsonify({"success": "Logout efetuado com sucesso"}), 200
    except Exception as error:
        return jsonify({"error": "Erro ao realizar o logout: " + str(error)}), 500


@usuario_routes.route('/requisitar-troca-senha', methods=['POST'])
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
        return jsonify({"error": str(error)}), 400
    except Exception as error:
        return jsonify({"error": "Erro ao requisitar token para trocar a senha: " + str(error)}), 500


@usuario_routes.route('/redefinir-senha', methods=['POST'])
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
        return jsonify({"error": str(error)}), 400
    except Exception as error:
        return jsonify({"error": "Erro ao redefinir a senha: " + str(error)}), 500


# falta implementar
@usuario_routes.route('/atualizar-dados', methods=['POST'])
def atualizar_dados():
    pass

