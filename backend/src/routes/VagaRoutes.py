from flask import Blueprint, jsonify, request, Response
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.validators.Validators import Validators
from src.controller.VagaController import VagaController

vaga_routes: Blueprint = Blueprint('vaga_routes', __name__)

validators_schema: Validators = Validators()

@vaga_routes.route('/pegar-setores-cargos', methods=['GET'], strict_slashes=False)
@jwt_required()
def pegar_setores_cargos() -> tuple[Response, int]:
    try:
        setores, cargos = VagaController().pegar_setores_cargos()
        
        return jsonify({"success": "Setores e cargos recuperados com sucesso", "setores": setores, "cargos": cargos}), 200
    except Exception as error:
        return jsonify({"error": "Exception " + str(error)}), 500
    
    
@vaga_routes.route('/pegar-setores', methods=['GET'], strict_slashes=False)
@jwt_required()
def pegar_setores() -> tuple[Response, int]:
    try:
        setores, _ = VagaController().pegar_setores_cargos()
        
        return jsonify({"success": "Setores recuperados com sucesso", "setores": setores}), 200
    except Exception as error:
        return jsonify({"error": "Exception " + str(error)}), 500
    

@vaga_routes.route('/pegar-cargos', methods=['GET'], strict_slashes=False)
@jwt_required()
def pegar_cargos() -> tuple[Response, int]:
    try:
        _, cargos = VagaController().pegar_setores_cargos()
        
        return jsonify({"success": "Cargos recuperados com sucesso", "cargos": cargos}), 200
    except Exception as error:
        return jsonify({"error": "Exception " + str(error)}), 500
    

@vaga_routes.route('/pegar-todas-vagas', defaults={'pagina': 1}, methods=['GET'], strict_slashes=False)
@vaga_routes.route('/pegar-todas-vagas/<int:pagina>', methods=['GET'], strict_slashes=False)
@jwt_required()
def pegar_todas_vagas(pagina: int) -> tuple[Response, int]:
    try:
        # ALTO EM GAMBIARRA ISSO AQUI, LEMBRAR DE MELHORAR QUANDO POSSÍVEL
        current_user: dict = get_jwt_identity()
        
        if not pagina:
            raise ValueError("Número da página não informado")
        
        total_de_paginas, vagas = VagaController().pegar_todas_vagas(pagina, current_user["admin"])
        return jsonify({"success": "Vagas recuperadas com sucesso", "total_de_paginas": total_de_paginas, "vagas": vagas}), 200
    except ValueError as error:
        return jsonify({"error": "ValueError " + str(error)}), 400
    except Exception as error:
        return jsonify({"error": "Exception " + str(error)}), 500


@vaga_routes.route('/criar-vaga', methods=['POST'], strict_slashes=False)
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
        return jsonify({"error": "ValueError " + str(error)}), 400
    except Exception as error:
        return jsonify({"error": "Exception " + str(error)}), 500
    

@vaga_routes.route('/atualizar-vaga/<int:id_vaga>', methods=['PUT'], strict_slashes=False)
@jwt_required()
def atualizar_vaga(id_vaga: int) -> tuple[Response, int]:
    try:
        body: dict[str, str] = request.get_json()
        
        if not validators_schema.validate_body(body):
            raise ValueError("Algum campo obrigatório não foi preenchido")
        
        vaga_controller: VagaController = VagaController(
            nome_vaga = body["nome_vaga"], status= body["status"],
            descricao_vaga=body["descricao_vaga"], salario=body["salario"],
            quantidade_vagas=body["quantidade_vagas"], data_encerramento=body["data_encerramento"]
        )
        
        vaga_controller.atualizar_vaga(id_vaga, body["setor"], body["cargo"])
        
        return jsonify({"success": "Vaga atualizada com sucesso"}), 204
    except ValueError as error:
        return jsonify({"error": "ValueError " + str(error)}), 400
    except Exception as error:
        return jsonify({"error": "Exception " + str(error)}), 500