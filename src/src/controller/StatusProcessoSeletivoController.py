from src.model.StatusProcessoSeletivoModel import StatusProcessoSeletivoModel
from mysql.connector import DatabaseError, IntegrityError
from mysql.connector.cursor import MySQLCursor
from src.config.MysqlService import MySQLService
from src.util.EmailService import EmailService
from src.validators.Validators import Validators
from src.schema.StatusProcessoSeletivoSchema import PegarStatusProcessoSeletivo, PegarUsuarios
from src.controller.sql_status_processo_seletivo.comandos_sql import (
    SQL_PEGAR_NOME_VAGA,
    SQL_PEGAR_NOME_ETAPA,
    SQL_BUSCAR_VAGA_ID,
    SQL_BUSCAR_ETAPA_ID,
    SQL_QUANTIDADE_STATUS_PROCESSO_SELETIVO,
    SQL_PEGAR_STATUS_PROCESSO_SELETIVO,
    SQL_QUANTIDADE_TODOS_USUARIOS,
    SQL_PEGAR_TODOS_USUARIOS,
    SQL_VERIFICAR_SE_USUARIO_TEM_INSCRICAO,
    SQL_SALVAR_STATUS_PROCESSO_SELETIVO,
    SQL_ATUALIZAR_STATUS_PROCESSO_SELETIVO
)

class StatusProcessoSeletivoController(StatusProcessoSeletivoModel):
    """
    Construtor responsável pelo controle do status do processo seletivo.

    Herda de StatusProcessoSeletivoModel e fornece métodos para gerenciar 
    status de processos seletivos, incluindo a salvamento e atualização de status, 
    bem como a recuperação de informações relacionadas a vagas e etapas.

    Atributos:
        data_entrevista (str): (protected)
            Data da entrevista marcada.
        data_conclusao (str): (protected)
            Data de conclusão do processo seletivo.
        status_processo (str): (protected)
            Status atual do processo seletivo.
        perfil (str): (protected)
            Perfil do candidato.
        observacao (str): (protected)
            Observações adicionais sobre o processo seletivo.
        forms_respondido (bool): (protected)
            Indica se os formulários foram respondidos.
        avaliacao_forms (str): (protected)
            Avaliação dos formulários respondidos.
        __mysql (MySQLService): (private)
            Instância do serviço `MySQLService` para gerenciar conexões e operações no banco de dados.
        __email_service (EmailService): (private)
            Instância do serviço `EmailService` para enviar e-mails.

    Métodos:
        pegar_vagas_etapas() -> tuple[list, list]: (public)
            Retorna uma tupla com listas de vagas e etapas disponíveis.
            
        __buscar_vaga_etapa(db_cursor: MySQLCursor, nome_vaga: str, nome_etapa: str) -> tuple[int, int]: (private)
            Retorna o ID da vaga e da etapa correspondente ao nome fornecido.
        
        pegar_todos_status_processo_seletivo() -> list: (public)
            Retorna uma lista com todos os status de processos seletivos cadastrados.
        
        pegar_todos_usuarios() -> list: (public)
            Retorna uma lista com todos os usuários cadastrados no sistema.
        
        salvar_status_processo_seletivo(vaga: str, etapa: str) -> None: (public)
            Salva o status do processo seletivo com base na vaga e etapa fornecidas.
        
        atualizar_status_processo_seletivo(id_status_processo_seletivo: int) -> None: (public)
            Atualiza o status do processo seletivo existente com os dados atuais da classe.
        
        enviar_email_com_base_no_status(nome_usuario: str, email_usuario: str) -> None: (public)
            Envia um e-mail ao usuário informando sobre a mudança de status do processo seletivo.
    """
    def __init__(self, data_entrevista: str = None, data_conclusao: str = None, status_processo: str = None, perfil: str = None, observacao: str = None, forms_respondido: bool = None, avaliacao_forms: str = None):
        super().__init__(
            _data_entrevista=data_entrevista, _data_conclusao=data_conclusao, 
            _status_processo=status_processo, _perfil=perfil, _observacao=observacao, 
            _forms_respondido=forms_respondido, _avaliacao_forms=avaliacao_forms
        )
        self.__mysql: MySQLService = MySQLService()
        self.__validators_schema: Validators = Validators()
        self.__email_service: EmailService = EmailService()
    
    
    def pegar_vagas_etapas(self) -> tuple[list, list]:
        db_connection, db_cursor = self.__mysql.connect()
        
        vagas_raw: list[list[str]] = self.__mysql.fetch_all(SQL_PEGAR_NOME_VAGA, None, db_cursor)
        etapa_raw: list[list[str]] = self.__mysql.fetch_all(SQL_PEGAR_NOME_ETAPA, None, db_cursor)
        
        vagas: list[str] = [vaga[0] for vaga in vagas_raw]
        etapas: list[str] = [etapa[0] for etapa in etapa_raw]
        
        self.__mysql.close_cursor_and_connection(db_cursor, db_connection)
        
        return vagas, etapas
    
    
    def __buscar_vaga_etapa(self, db_cursor: MySQLCursor, nome_vaga: str, nome_etapa: str) -> tuple[int, int]:
        resultado_vaga: tuple = self.__mysql.fetch_one(SQL_BUSCAR_VAGA_ID, (nome_vaga,), db_cursor)
        resultado_etapa: tuple = self.__mysql.fetch_one(SQL_BUSCAR_ETAPA_ID, (nome_etapa,), db_cursor)
        
        if not resultado_vaga or not resultado_etapa:
            raise ValueError("Vaga ou etapa não encontrado")
        
        return resultado_vaga[0], resultado_etapa[0]
    
    
    def pegar_todos_status_processo_seletivo(self, pagina: int, limite_por_pagina: int = 50) -> list[dict]:
        db_connection, db_cursor = self.__mysql.connect()

        total_de_paginas, resultado = self.__validators_schema.validar_paginacao(pagina, limite_por_pagina, SQL_PEGAR_STATUS_PROCESSO_SELETIVO, SQL_QUANTIDADE_STATUS_PROCESSO_SELETIVO, db_cursor)
    
        self.__mysql.close_cursor_and_connection(db_cursor, db_connection)
        
        status_processo_seletivos: list[dict] = [
            PegarStatusProcessoSeletivo(
                id_status_processo_seletivo=status_processo_seletivo[0], data_entrevista=str(status_processo_seletivo[1]),
                data_conclusao=str(status_processo_seletivo[2]), nome_usuario=status_processo_seletivo[3],
                telefone=status_processo_seletivo[4], email=status_processo_seletivo[5],
                nome_cargo=status_processo_seletivo[6], nome_etapa=status_processo_seletivo[7],
                nome_setor=status_processo_seletivo[8], perfil=status_processo_seletivo[9],
                status_processo=status_processo_seletivo[10], observacao=status_processo_seletivo[11],
                forms_respondido=status_processo_seletivo[12],avaliacao_forms=status_processo_seletivo[13]
            ).model_dump()
            for status_processo_seletivo in resultado
        ]
        
        return total_de_paginas, status_processo_seletivos
    
    
    def pegar_todos_usuarios(self, pagina: int, limite_por_pagina: int = 50) -> list[dict]:
        db_connection, db_cursor = self.__mysql.connect()
        
        total_de_paginas, resultado = self.__validators_schema.validar_paginacao(pagina, limite_por_pagina, SQL_PEGAR_TODOS_USUARIOS, SQL_QUANTIDADE_TODOS_USUARIOS, db_cursor)
        
        self.__mysql.close_cursor_and_connection(db_cursor, db_connection)
        
        usuarios: list[dict] = [
            PegarUsuarios(
                id_usuario=usuario[0], email=usuario[1],
                admin=usuario[2], data_criacao=usuario[3],
                nome_usuario=usuario[4], telefone=usuario[5],
                cpf=usuario[6], endereco=usuario[7], 
                data_nascimento=str(usuario[8]), sexo=usuario[9], 
                tem_inscricao=usuario[10]
            ).model_dump()
            for usuario in resultado
        ]
        
        return total_de_paginas, usuarios
    
    
    def salvar_status_processo_seletivo(self, id_usuario: int, vaga: str, etapa: str) -> None:
        db_connection, db_cursor = self.__mysql.connect()
        
        try:
            db_connection.start_transaction()
            
            id_vaga, id_etapa = self.__buscar_vaga_etapa(db_cursor, vaga, etapa)
            
            resultado: list = self.__mysql.fetch_one(SQL_VERIFICAR_SE_USUARIO_TEM_INSCRICAO, (id_usuario, id_vaga), db_cursor)
            
            if not resultado:
                raise ValueError("Usuario não possui essa inscricao para salvar o status do processo seletivo")
            
            db_cursor.execute(
                SQL_SALVAR_STATUS_PROCESSO_SELETIVO, 
                (id_vaga, id_etapa, self.data_entrevista, self.data_conclusao, self.status_processo, self.perfil, self.observacao, self.forms_respondido, self.avaliacao_forms)
            )
            
            db_connection.commit()
        except IntegrityError as ie:
            db_connection.rollback()
            raise IntegrityError(f"Erro de integridade ao salvar o status do processo seletivo: {ie}")
        except DatabaseError as de:
            db_connection.rollback()
            raise DatabaseError(f"Erro de banco de dados ao salvar o status do processo seletivo: {de}")
        except Exception as error:
            db_connection.rollback()
            raise Exception(f"Erro ao salvar o status do processo seletivo: {error}")
        finally:
            self.__mysql.close_cursor_and_connection(db_cursor, db_connection)
        
    
    def atualizar_status_processo_seletivo(self, id_status_processo_seletivo: int, etapa: str) -> None:
        db_connection, db_cursor = self.__mysql.connect()
        
        try:
            db_connection.start_transaction()
            
            result: tuple[tuple] = self.__mysql.fetch_one(SQL_BUSCAR_ETAPA_ID, (etapa,), db_cursor)
            
            if not result:
                raise ValueError("Etapa não encontrada")
            
            db_cursor.execute(
                SQL_ATUALIZAR_STATUS_PROCESSO_SELETIVO, 
                (result[0], self.data_entrevista, self.data_conclusao, self.status_processo, self.perfil, self.observacao, self.forms_respondido, self.avaliacao_forms, id_status_processo_seletivo)
            )
            
            db_connection.commit()
        except IntegrityError as ie:
            db_connection.rollback()
            raise IntegrityError(f"Erro de integridade ao atualizar o status do processo seletivo: {ie}")
        except DatabaseError as de:
            db_connection.rollback()
            raise DatabaseError(f"Erro de banco de dados ao atualizar o status do processo seletivo: {de}")
        except Exception as error:
            db_connection.rollback()
            raise Exception(f"Erro ao atualizar o status do processo seletivo: {error}")
        finally:
            self.__mysql.close_cursor_and_connection(db_cursor, db_connection)
    
    
    def enviar_email_com_base_no_status(self, nome_usuario: str, email_usuario: str) -> None:
        assunto_status: dict[str, str] = {
            "ATIVO": "Olá e boa sorte no seu processo seletivo!",
            "CONCLUÍDO": "Parabéns, seu processo seletivo foi concluído com sucesso!",
            "BANCO DE TALENTOS": "Parabéns! Você foi selecionado para o processo seletivo pelo banco de talentos!",
            "DESISTÊNCIA": "Lamentamos informar que seu processo seletivo foi marcado como desistência.",
            "REPROVAÇÃO": "Infelizmente, você não foi aprovado no processo seletivo.",
            "ENCERRADO": "Seu processo seletivo foi encerrado. Obrigado pela participação!"
        }

        if self.status_processo not in assunto_status:
            raise ValueError(f"Status do processo seletivo inválido: {self.status_processo}")

        assunto: str = assunto_status[self.status_processo]

        mensagem_corpo: str = f"O status do seu processo seletivo mudou para {self.status_processo}!"

        self.__email_service.send_email_informing_user_status_selection_process(
            send_email=email_usuario, subject=assunto, name_user=nome_usuario, message=mensagem_corpo 
        )
        
    
    def __str__(self):
        return (
            "StatusProcessoSeletivoController("
            f"data_entrevista='{self.data_entrevista}', "
            f"data_conclusao='{self.data_conclusao}', "
            f"status_processo='{self.status_processo}', "
            f"perfil='{self.perfil}', "
            f"observacao='{self.observacao}', "
            f"forms_respondido='{self.forms_respondido}', "
            f"avaliacao_forms='{self.avaliacao_forms}'"
            ")"
        )