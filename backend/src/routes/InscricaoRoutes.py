import os
from flask import Blueprint, jsonify, request, Response, send_from_directory
from flask_jwt_extended import jwt_required
from src.validators.Validators import Validators
from src.controller.InscricaoController import InscricaoController

inscricao_routes: Blueprint = Blueprint('inscricao_routes', __name__)

validators_schema: Validators = Validators()
DIRETORIO_CURRICULOS: str = os.getcwd() + "\\src\\archives"


@inscricao_routes.route('/excluir-curriculo/<int:id_usuario>', methods=['DELETE'], strict_slashes=False)
@jwt_required()
def excluir_curriculo(id_usuario: int) -> tuple[Response, int]:
    try:
        inscricao: InscricaoController = InscricaoController(id_usuario, None)
        nome_arquivo_curriculo: str = inscricao.pegar_curriculo()
        
        if not nome_arquivo_curriculo:
            raise ValueError("O arquivo do curriculo não foi encontrado ou não existe")
        
        inscricao.excluir_curriculo()
        
        caminho_arquivo = os.path.join(DIRETORIO_CURRICULOS, nome_arquivo_curriculo)
        
        if os.path.exists(caminho_arquivo):
            os.remove(caminho_arquivo)
        else:
            raise FileNotFoundError("O arquivo do currículo não foi encontrado no diretório")
        
        return jsonify({"success": "Curriculo excluído com sucesso"}), 204
    except ValueError as error:
        return jsonify({"error": "ValueError " + str(error)}), 400
    except FileNotFoundError as error:
        return jsonify({"error": str(error)}), 404
    except Exception as error:
        return jsonify({"error": "Exception " + str(error)}), 500


@inscricao_routes.route('/pegar-curriculo/<int:id_usuario>', methods=['GET'], strict_slashes=False)
@jwt_required()
def pegar_curriculo(id_usuario: int) -> tuple[Response, int]:
    try:
        inscricao: InscricaoController = InscricaoController(id_usuario, None)
        nome_arquivo_curriculo: str = inscricao.pegar_curriculo()

        return send_from_directory(DIRETORIO_CURRICULOS, nome_arquivo_curriculo, as_attachment=True)
    except Exception as error:
        return jsonify({"error": "Exception " + str(error)}), 500


@inscricao_routes.route('/salvar-inscricao-curriculo/<int:id_usuario>', methods=['POST'], strict_slashes=False)
@inscricao_routes.route('/salvar-inscricao-curriculo/<int:id_usuario>/<int:id_vaga>', methods=['POST'], strict_slashes=False)
@jwt_required()
def salvar_inscricao_curriculo(id_usuario: int, id_vaga: int=None) -> tuple[Response, int]:
    try:
        nome_usuario: str = request.form.get("nome_usuario")
        arquivo: str = request.files.get("curriculo")
        
        if not nome_usuario:
            raise ValueError("O campo 'nome_usuario' é obrigatório")
        
        if not arquivo:
            raise Exception("O formato do arquivo deve ser multipart/form-data ou o arquivo do curriculo não foi enviado")
        
        inscricao: InscricaoController = InscricaoController(id_usuario, id_vaga)
        
        nome_arquivo_curriculo: str = inscricao.salvar_inscricao_curriculo(nome_usuario)
        
        arquivo.save(os.path.join(DIRETORIO_CURRICULOS, nome_arquivo_curriculo))
        
        response_message: dict[str, str] = {"success": "Inscricão salva com sucesso e curriculo salvo"}
        
        # try:
        #     inscricao.enviar_email_informando_inscricao_usuario_para_admin(id_usuario)
        # except Exception as error:
        #     response_message["email_error"] = str(error)
        
        return jsonify(response_message), 200
    except ValueError as error:
        print(error)
        return jsonify({"error": "ValueError " + str(error)}), 400
    except OSError as error:
        print(error)
        return jsonify({"error": "OSError " + str(error)}), 500
    except Exception as error:
        print(error)
        return jsonify({"error": "Exception " + str(error)}), 500
    

@inscricao_routes.route('/mostrar-inscricoes-usuario/<int:id_usuario>', defaults={'pagina': 1}, methods=['GET'], strict_slashes=False)
@inscricao_routes.route('/mostrar-inscricoes-usuario/<int:id_usuario>/<int:pagina>', methods=['GET'], strict_slashes=False)
@jwt_required()
def mostrar_inscricoes_usuario(id_usuario: int, pagina: int) -> tuple[Response, int]:
    try:
        inscricao: InscricaoController = InscricaoController(id_usuario, None)
        total_de_paginas, inscricoes = inscricao.mostrar_inscricoes_usuario(pagina)
        return jsonify({"success": "Inscricoes encontradas", "total_de_paginas": total_de_paginas, "inscricoes": inscricoes}), 200
    except Exception as error:
        return jsonify({"error": "Exception " + str(error)}), 500


@inscricao_routes.route('/forms-respondido/<int:id_status_processo_seletivo>',  methods=['PUT'], strict_slashes=False)
@jwt_required()
def atualizar_forms_como_preenchido(id_status_processo_seletivo: int):
    try:
        inscricao: InscricaoController = InscricaoController(None, None)
        inscricao.atualizar_forms_como_preenchido(id_status_processo_seletivo)
        
        return jsonify({"success": "Form foi declarado como preenchido"}), 204
    except Exception as error:
        return jsonify({"error": "Exception " + str(error)}), 500