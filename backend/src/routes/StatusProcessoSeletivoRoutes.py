from flask import Blueprint, jsonify, request, Response
from flask_jwt_extended import jwt_required
from src.validators.Validators import Validators
from src.controller.StatusProcessoSeletivoController import StatusProcessoSeletivoController

status_processo_seletivo_routes: Blueprint = Blueprint('status_processo_seletivo_routes', __name__)

validators_schema: Validators = Validators()


@status_processo_seletivo_routes.route('/pegar-etapas', methods=['GET'], strict_slashes=False)
@jwt_required()
def pegar_etapas() -> tuple[Response, int]:
    try:
        status_processo_seletivo_controller: StatusProcessoSeletivoController = StatusProcessoSeletivoController()
        etapas: list[str] = status_processo_seletivo_controller.pegar_etapas()
        return jsonify({"success": "Etapas recuperadas", "etapas": etapas}), 200
    except Exception as error:
        return jsonify({"error": "Exception " + str(error)}), 500


@status_processo_seletivo_routes.route('/pegar-todos-status-processo-seletivo', defaults={'pagina': 1}, methods=['GET'], strict_slashes=False)
@status_processo_seletivo_routes.route('/pegar-todos-status-processo-seletivo/<int:pagina>', methods=['GET'], strict_slashes=False)
@jwt_required()
def pegar_todos_status_processo_seletivo(pagina: int) -> tuple[Response, int]:
    try:
        status_processo_seletivo_controller: StatusProcessoSeletivoController = StatusProcessoSeletivoController()
        total_de_paginas, todos_status_processo_seletivo = status_processo_seletivo_controller.pegar_todos_status_processo_seletivo(pagina)
        return jsonify({
            "success": "Status do processo seletivo recuperado com sucesso",
            "total_de_paginas": total_de_paginas,
            "status_processo_seletivo": todos_status_processo_seletivo
            }), 200
    except Exception as error:
        return jsonify({"error": "Exception " + str(error)}), 500
    

@status_processo_seletivo_routes.route('/pegar-todos-usuarios', defaults={'pagina': 1}, methods=['GET'], strict_slashes=False)
@status_processo_seletivo_routes.route('/pegar-todos-usuarios/<int:pagina>', methods=['GET'], strict_slashes=False)
@jwt_required()
def pegar_todos_usuarios(pagina: int) -> tuple[Response, int]:
    try:
        status_processo_seletivo_controller: StatusProcessoSeletivoController = StatusProcessoSeletivoController()
        total_de_paginas, usuarios = status_processo_seletivo_controller.pegar_todos_usuarios(pagina)
        return jsonify({"success": "Usuario(s) recuperado com sucesso", "total_de_paginas": total_de_paginas, "usuarios": usuarios}), 200
    except Exception as error:
        return jsonify({"error": "Exception " + str(error)}), 500
    

@status_processo_seletivo_routes.route('/salvar-status-processo-seletivo/<int:id_usuario>', methods=['POST'], strict_slashes=False)
@jwt_required()
def salvar_status_processo_seletivo(id_usuario: int) -> tuple[Response, int]:
    try:
        body: dict = request.get_json()
        
        if not validators_schema.validate_body(body):
            raise ValueError("Algum campo obrigatório não foi preenchido")
        
        status_processo_seletivo_controller: StatusProcessoSeletivoController = StatusProcessoSeletivoController(
            None, None, body['status_processo'], None, None, body['forms_respondido'], None
        )
        
        status_processo_seletivo_controller.salvar_status_processo_seletivo(id_usuario, body['vaga'], body['etapa'])
        
        return jsonify({"success": "Status do processo seletivo salvo com sucesso"}), 200
    except ValueError as error:
        print(error)
        return jsonify({"error": "ValueError " + str(error)}), 400
    except Exception as error:
        print(error)
        return jsonify({"error": "Exception " + str(error)}), 500
    

@status_processo_seletivo_routes.route('/atualizar-status-processo-seletivo/<int:id_status_processo_seletivo>', methods=['PUT'], strict_slashes=False)
@jwt_required()
def atualizar_status_processo_seletivo(id_status_processo_seletivo: int) -> tuple[Response, int]:
    try:
        body: dict = request.get_json()
        
        status_processo_seletivo_controller: StatusProcessoSeletivoController = StatusProcessoSeletivoController(
            body["data_entrevista"], body['data_conclusao'], 
            body['status_processo'], body["perfil"], 
            body["observacao"], body['forms_respondido'], 
            body["avaliacao_forms"]
        )
        
        nome_usuario, email_usuario = status_processo_seletivo_controller.atualizar_status_processo_seletivo(id_status_processo_seletivo, body["etapa"])
        
        response_message: dict[str, str] = {"success": "Status do processo seletivo atualizado com sucesso"}
        
        try:
            status_processo_seletivo_controller.enviar_email_com_base_no_status(nome_usuario, email_usuario)
        except Exception as email_error:
            response_message["email_error"] = str(email_error)
        
        return jsonify(response_message), 204
    except ValueError as error:
        return jsonify({"error": "ValueError " + str(error)}), 400
    except Exception as error:
        return jsonify({"error": "Exception " + str(error)}), 500