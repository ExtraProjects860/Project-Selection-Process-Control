from flask import Blueprint, jsonify, request, Response
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from controller.DadosUsuarioController import DadosUsuarioController
from controller.UsuarioController import UsuarioController
from validators.Validators import ValidatorsSchema

usuario_routes: Blueprint = Blueprint('usuario_routes', __name__)

@usuario_routes.route('/rota-teste-protegida', methods=['GET'])
@jwt_required()
def rota_teste() -> tuple[Response, int]:
    try:
        current_user: dict = get_jwt_identity()
        print(f"Usuário {current_user} acessou a rota protegida.")
        return jsonify(message="Esta é uma rota protegida"), 200
    except Exception as error:
        return jsonify({"message": "Erro: " + str(error)}), 500


@usuario_routes.route('/criar-usuario', methods=['POST'])
def criar_usuario() -> tuple[Response, int]:
    try:
        body = request.get_json()
        # se não estiver com multipart/form-data na requisição ira dar erro
        # arquivo_curriculo = request.files['curriculo']
        
        ValidatorsSchema.validate_body(body)
        is_admin: bool = ValidatorsSchema.validate_email_is_admin(body["email"])
        
        usuario_controller: UsuarioController = UsuarioController(
            dados_usuario = DadosUsuarioController(
                nome = body["nome"], 
                cpf = body["cpf"], 
                telefone = body["telefone"], 
                endereco = body["endereco"], 
                dataNascimento = body["dataNascimento"], 
                sexo = body["sexo"],
                # está comentado, pois não será utilizado agora
                # curriculo = body["curriculo"]
                curriculo = "teste"
            ),
            email = body["email"], 
            senha = body["senha"], 
            admin = is_admin
        )
        
        usuario_controller.criar_usuario()
        
        # só vai funcionar no front end
        # video de auxilio: https://www.youtube.com/watch?v=oKtJdsFfNnI
        # ValidatorsSchema.salvar_curriculo(user_id, body["nome"], arquivo_curriculo)
        
        return jsonify({"message": "Usuário criado com sucesso"}), 200
    except Exception as error:
        return jsonify({"message": "Algum erro interno no servidor ocorreu ao criar o usuário: " + str(error)}), 500
    

@usuario_routes.route('/login', methods=['POST'])
def login() -> tuple[Response, int]:
    try:
        body = request.get_json()
        
        usuario_controller: UsuarioController = UsuarioController(
            dados_usuario = None,
            email = body["email"],
            senha = body["senha"],
            admin = None
        )
        
        token_de_acesso: str = usuario_controller.login()
        
        return jsonify({"token": token_de_acesso}), 200
    except Exception as error:
        return jsonify({"message": "Erro ao logar o usuário: " + str(error)}), 500


@usuario_routes.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        jti = get_jwt()["jti"]
        ValidatorsSchema.adicionar_token_na_blacklist(jti)
        return jsonify({"message": "Logout efetuado com sucesso"}), 200
    except Exception as error:
        return jsonify({"message": "Erro ao realizar o logout: " + str(error)}), 500

# falta implementar
@usuario_routes.route('/requisitar-troca-senha', methods=['POST'])
def requisitar_troca_senha():
    pass

# falta implementar
@usuario_routes.route('/recuperar-senha', methods=['POST'])
def recuperar_senha():
    pass

# falta implementar
@usuario_routes.route('/atualizar-dados', methods=['POST'])
def atualizar_dados():
    pass

