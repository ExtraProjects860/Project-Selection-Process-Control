import os
from flask import Blueprint, jsonify, request, Response, send_from_directory
from flask_jwt_extended import jwt_required
from src.validators.Validators import ValidatorsSchema
from src.controller.InscricaoController import InscricaoController

inscricao_routes: Blueprint = Blueprint('inscricao_routes', __name__)

validators_schema: ValidatorsSchema = ValidatorsSchema()
DIRETORIO_CURRICULOS: str = os.getcwd() + "\\src\\archives"


@inscricao_routes.route('/pegar-curriculo/<int:id_usuario>', methods=['GET'])
@jwt_required()
def pegar_curriculo(id_usuario: int) -> tuple[Response, int]:
    try:
        inscricao: InscricaoController = InscricaoController(id_usuario, None)
        nome_curriculo: str = inscricao.pegar_curriculo()

        return send_from_directory(DIRETORIO_CURRICULOS, nome_curriculo, as_attachment=True)
    except Exception as error:
        return jsonify({"error": str(error)}), 500


@inscricao_routes.route('/salvar-inscricao-curriculo/<int:id_usuario>/<int:id_vaga>', methods=['POST'])
@jwt_required()
def salvar_inscricao_curriculo(id_usuario: int, id_vaga: int) -> tuple[Response, int]:
    try:
        nome_usuario = request.form.get("nome_usuario")
        arquivo: str = request.files.get("curriculo")
        
        if not nome_usuario:
            raise ValueError("O campo 'nome_usuario' é obrigatório")
        
        if not arquivo:
            raise Exception("O formato do arquivo deve ser multipart/form-data ou o arquivo do curriculo não foi enviado")
        
        inscricao: InscricaoController = InscricaoController(id_usuario, id_vaga)
        
        nome_arquivo: str = inscricao.tratar_nome_curriculo(nome_usuario)
        inscricao.salvar_inscricao_curriculo(nome_arquivo)
        
        arquivo.save(os.path.join(DIRETORIO_CURRICULOS, nome_arquivo))
        
        return jsonify({"success": "Inscrição salva com sucesso e curriculo salvo"}), 200
    except OSError as error:
        return jsonify({"error": str(error)}), 500
    except Exception as error:
        return jsonify({"error": "Erro: " + str(error)}), 500