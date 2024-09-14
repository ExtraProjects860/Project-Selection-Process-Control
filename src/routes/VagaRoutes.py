from flask import Blueprint, jsonify, request, Response
from flask_jwt_extended import jwt_required
from src.validators.Validators import ValidatorsSchema
from src.controller.VagaController import VagaController

vaga_routes: Blueprint = Blueprint('vaga_routes', __name__)

validators_schema: ValidatorsSchema = ValidatorsSchema()

@vaga_routes.route('/pegar-setores-cargos', methods=['GET'])
@jwt_required()
def pegar_setores_cargos() -> tuple[Response, int]:
    try:
        vaga_controller: VagaController = VagaController(
            nome_vaga = None, status = None,
            descricao_vaga = None, salario = None,
            quantidade_vagas = None, data_encerramento = None
        )
        
        setores, cargos = vaga_controller.pegar_setores_cargos()
        
        return jsonify({"success": "Setores e cargos recuperados com sucesso", "setores": setores, "cargos": cargos}), 200
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    

@vaga_routes.route('/pegar-todas-vagas', methods=['GET'])
@jwt_required()
def pegar_todas_vagas() -> tuple[Response, int]:
    try:
        vaga_controller: VagaController = VagaController(
            nome_vaga = None, status = None,
            descricao_vaga = None, salario = None,
            quantidade_vagas = None, data_encerramento = None
        )
        
        return jsonify({"success": vaga_controller.pegar_todas_vagas()}), 200
    except Exception as error:
        return jsonify({"error": "Erro: " + str(error)}), 500


@vaga_routes.route('/criar-vaga', methods=['POST'])
@jwt_required()
def criar_vaga() -> tuple[Response, int]:
    try:
        body: dict[str, str] = request.get_json()
        
        if not validators_schema.validate_body(body):
            raise ValueError("Algum campo obrigatório não foi preenchido")
        
        vaga_controller: VagaController = VagaController(
            nome_vaga = body["nome_vaga"], status=body["status"],
            descricao_vaga=body["descricao_vaga"], salario=body["salario"],
            quantidade_vagas=body["quantidade_vagas"], data_encerramento=body["data_encerramento"]
        )
        
        vaga_controller.criar_vaga(body["setor"], body["cargo"])
        
        return jsonify({"success": "Vaga criada com sucesso"}), 200
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    except Exception as error:
        return jsonify({"error": "Algum erro interno no servidor ocorreu ao criar a vaga: " + str(error)}), 500
    

@vaga_routes.route('/atualizar-vaga/<int:id_vaga>', methods=['PUT'])
@jwt_required()
def atualizar_vaga(id_vaga: int) -> tuple[Response, int]:
    try:
        body: dict[str, str] = request.get_json()
        
        if not validators_schema.validate_body(body):
            raise ValueError("Algum campo obrigatório não foi preenchido")
        
        vaga_controller: VagaController = VagaController(
            nome_vaga = body["nome_vaga"], status=None,
            descricao_vaga=body["descricao_vaga"], salario=body["salario"],
            quantidade_vagas=body["quantidade_vagas"], data_encerramento=body["data_encerramento"]
        )
        
        vaga_controller.atualizar_vaga(id_vaga)
        
        return jsonify({"success": "Vaga atualizada com sucesso"}), 200
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    except Exception as error:
        return jsonify({"error": "Algum erro interno no servidor ocorreu ao atualizar a vaga: " + str(error)}), 500
    

@vaga_routes.route('/atualizar-status-vaga/<int:id_vaga>/<status>', methods=['PUT'])
@jwt_required()
def atualizar_status_vaga(id_vaga: int, status: str) -> tuple[Response, int]:
    try:
        vaga_controller: VagaController = VagaController(
            nome_vaga = None, status = status,
            descricao_vaga=None, salario=None,
            quantidade_vagas=None, data_encerramento=None
        )
        
        vaga_controller.atualizar_status_vaga(id_vaga)
        
        return jsonify({"success": "Vaga atualizada com sucesso"}), 200
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    except Exception as error:
        return jsonify({"error": "Algum erro interno no servidor ocorreu ao atualizar a vaga: " + str(error)}), 500