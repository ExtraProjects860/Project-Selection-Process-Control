import re
from datetime import date, datetime
from mysql.connector import DatabaseError, IntegrityError, MySQLConnection
from mysql.connector.cursor import MySQLCursor
from src.model.InscricaoModel import InscricaoModel
from src.config.MysqlService import MySQLService
from src.validators.Validators import Validators
from src.util.EmailService import EmailService
from src.controller.sql_inscricao.comandos_sql import (
    SQL_EXCLUIR_CURRICULO,
    SQL_PEGAR_CURRICULO,
    SQL_SUBIR_CURRICULO,
    SQL_SALVAR_INSCRICAO,
    SQL_BUSCAR_QUE_RELIZOU_INSCRICAO_USUARIO,
    SQL_QUANTIDADE_INSCRICOES_USUARIO,
    SQL_MOSTRAR_INSCRICOES_USUARIO,
    SQL_MARCAR_CONCLUIDO_FORMS
)

class InscricaoController(InscricaoModel):
    """
    Controller responsável por gerenciar as operações relacionadas às inscrições dos usuários em vagas.

    Esta classe herda de `InscricaoModel` e fornece métodos para manipular currículos, gerenciar inscrições,
    enviar e-mails e atualizar status de formulários relacionados aos processos seletivos. Utiliza o serviço 
    `MySQLService` para gerenciar a conexão e execução de comandos no banco de dados e o `EmailService` para 
    envio de e-mails.

    Atributos:
    ----------
    id_usuario : int
        O ID do usuário que realiza a inscrição. (privado)
    id_vaga : int
        O ID da vaga para a qual o usuário está se inscrevendo. (privado)
    __mysql : MySQLService
        Instância do serviço `MySQLService` para gerenciar conexões e operações no banco de dados. (privado)
    __validators_schema : ValidatorsSchema
        Classe responsável por validações, como a validação de senhas e tokens. (private)
    __email_service : EmailService
        Instância do serviço `EmailService` para enviar e-mails. (privado)

    Métodos:
    --------
    excluir_curriculo() -> None: (public)
        Exclui o currículo do usuário no banco de dados.

    pegar_curriculo() -> str: (public)
        Recupera o caminho do currículo do usuário no banco de dados.

    __tratar_nome_curriculo(nome_usuario: str) -> str: (private)
        Processa e sanitiza o nome do usuário para gerar um nome de arquivo seguro para o currículo.

    salvar_inscricao_curriculo(nome_usuario: str) -> str: (public)
        Salva a inscrição do usuário e o currículo no banco de dados.
        Retorna o nome do arquivo do currículo salvo.

    enviar_email_informando_inscricao_usuario_para_admin(id_usuario: int) -> None: (public)
        Envia um e-mail informando ao administrador que um usuário realizou uma inscrição.

    mostrar_inscricoes_usuario() -> list: (public)
        Retorna uma lista de inscrições realizadas pelo usuário.

    atualizar_forms_como_preenchido(id_status_processo_seletivo: int) -> None: (public)
        Atualiza o status do processo seletivo como concluído no banco de dados.
    """
    
    def __init__(self, id_usuario: int, id_vaga: int=None):
        super().__init__(
            _id_usuario=id_usuario, _id_vaga=id_vaga
        )
        self.__mysql: MySQLService = MySQLService()
        self.__validators_schema: Validators = Validators()
        self.__email_service: EmailService = EmailService()
    
    
    def excluir_curriculo(self) -> None:
        db_connection: MySQLConnection = self.__mysql.connect()
        db_cursor: MySQLCursor = db_connection.cursor()
        
        try:
            db_connection.start_transaction()
            db_cursor.execute(SQL_EXCLUIR_CURRICULO, (self.id_usuario,), db_cursor)
            db_connection.commit()
        except DatabaseError as de:
            db_connection.rollback()
            raise DatabaseError(f"Erro de banco de dados ao excluir o curriculo: {de}")
        except Exception as error:
            db_connection.rollback()
            raise Exception(f"Erro ao excluir o curriculo: {error}")
        finally:
            self.__mysql.close_cursor_and_connection(db_cursor, db_connection)  
    
         
    def pegar_curriculo(self) -> str:
        db_connection: MySQLConnection = self.__mysql.connect()
        db_cursor: MySQLCursor = db_connection.cursor(dictionary=True)
        
        try:
            db_connection.start_transaction()
            resultado = self.__mysql.fetch_one(SQL_PEGAR_CURRICULO, (self.id_usuario,), db_cursor)
            
            if not resultado:
                raise Exception("Curriculo não encontrado")
            
            db_connection.commit()
            return resultado["curriculo"]
        except DatabaseError as de:
            db_connection.rollback()
            raise DatabaseError(f"Erro de banco de dados ao pegar o curriculo: {de}")
        except Exception as error:
            db_connection.rollback()
            raise Exception(f"Erro ao pegar o curriculo: {error}")
        finally:
            self.__mysql.close_cursor_and_connection(db_cursor, db_connection)  
    
    
    def __tratar_nome_curriculo(self, nome_usuario: str) -> str:
        nome_usuario_sanitizado: str = re.sub(r'[^\w\s]', '', nome_usuario)  # remove caracteres especiais
        # tomei um sacode pra achar o regex ideal
        nome_arquivo: str = f"{nome_usuario_sanitizado}_{self.id_usuario}_curriculo.pdf"
        return nome_arquivo
        
    
    def salvar_inscricao_curriculo(self, nome_usuario: str) -> str:
        db_connection: MySQLConnection = self.__mysql.connect()
        db_cursor: MySQLCursor = db_connection.cursor()
        
        try:
            db_connection.start_transaction()
            nome_arquivo: str = self.__tratar_nome_curriculo(nome_usuario)
            
            if self.id_vaga is None:
                db_cursor.execute(SQL_SUBIR_CURRICULO, (nome_arquivo, self.id_usuario),)
                db_connection.commit()
                return nome_arquivo
            
            db_cursor.execute(SQL_SALVAR_INSCRICAO, (self.id_usuario, self.id_vaga))
            db_cursor.execute(SQL_SUBIR_CURRICULO, (nome_arquivo, self.id_usuario),)
            db_connection.commit()
            
            return nome_arquivo
        except IntegrityError as ie:
            db_connection.rollback()
            raise IntegrityError(f"Erro de integridade ao salvar a inscricao: {ie}")
        except DatabaseError as de:
            db_connection.rollback()
            raise DatabaseError(f"Erro de banco de dados ao salvar a inscricao: {de}")
        except Exception as error:
            db_connection.rollback()
            raise Exception(f"Erro ao salvar a inscricao: {error}")
        finally:
            self.__mysql.close_cursor_and_connection(db_cursor, db_connection)
            
    
    def enviar_email_informando_inscricao_usuario_para_admin(self, id_usuario: int) -> None:
        db_connection: MySQLConnection = self.__mysql.connect()
        db_cursor: MySQLCursor = db_connection.cursor(dictionary=True)
        
        resultado: tuple = self.__mysql.fetch_one(SQL_BUSCAR_QUE_RELIZOU_INSCRICAO_USUARIO, (id_usuario,), db_cursor)
        self.__mysql.close_cursor_and_connection(db_cursor, db_connection)  
        
        self.__email_service.send_email_informing_user_registration_to_admin(
            send_email=resultado["email"],
            phone_number=resultado["telefone"],
            name_user=resultado["nome_usuario"],
            subject="Inscrição de um usuário foi concluída!",
            message=f"A inscrição de {resultado['nome_usuario']} foi concluída! Para continuar o processo seletivo do usuário, verique no site na parte status da inscrição."
        )
    
    
    def mostrar_inscricoes_usuario(self, pagina: int, limite_por_pagina: int = 4) -> tuple[int, list[dict]]:
        db_connection: MySQLConnection = self.__mysql.connect()
        db_cursor: MySQLCursor = db_connection.cursor(dictionary=True)
        
        total_de_paginas, resultado = self.__validators_schema.validar_paginacao(pagina, limite_por_pagina, SQL_MOSTRAR_INSCRICOES_USUARIO, SQL_QUANTIDADE_INSCRICOES_USUARIO, db_cursor, self.id_usuario)
        
        # nem aqui nem na china isso é ideal pra ser utilizar, mas ta resolvendo o problema no momento
        def converter_dados(inscricao: dict) -> dict:
            for campo in ['data_encerramento', 'data_entrevista']:
                if isinstance(inscricao.get(campo), (date, datetime)):
                    inscricao[campo] = inscricao[campo].strftime("%Y-%m-%d %H:%M:%S") if isinstance(inscricao[campo], datetime) else inscricao[campo].strftime("%Y-%m-%d")
            return inscricao

        # gambiarra, não me orgulho disso
        inscricoes: list[dict] = [converter_dados(inscricao) for inscricao in resultado]
        
        self.__mysql.close_cursor_and_connection(db_cursor, db_connection)  
        
        return total_de_paginas, inscricoes
    
    
    def atualizar_forms_como_preenchido(self, id_status_processo_seletivo: int) -> None:
        db_connection: MySQLConnection = self.__mysql.connect()
        db_cursor: MySQLCursor = db_connection.cursor()
        
        try:
            db_connection.start_transaction()
            db_cursor.execute(SQL_MARCAR_CONCLUIDO_FORMS, (id_status_processo_seletivo,))
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
            
    
    def __str__(self):
        return (
            "InscricaoController("
            f"id_usuario={self.id_usuario}, "
            f"id_vaga={self.id_vaga}"
            ")"
        )
