from datetime import date, datetime
from src.config.MysqlService import MySQLService
from src.validators.Validators import Validators
from src.model.VagaModel import VagaModel
from mysql.connector import DatabaseError, IntegrityError, MySQLConnection
from mysql.connector.cursor import MySQLCursor
from src.controller.sql_vaga.comandos_sql import (
    SQL_BUSCAR_SETOR_POR_NOME,
    SQL_BUSCAR_CARGO_POR_NOME,
    SQL_BUSCAR_SETOR_POR_ID,
    SQL_BUSCAR_CARGO_POR_ID,
    SQL_PEGAR_TODAS_VAGAS,
    SQL_PEGAR_VAGAS_ABERTAS,
    SQL_QUANTIDADE_VAGAS,
    SQL_CRIAR_VAGA,
    SQL_ATUALIZAR_VAGA
)

class VagaController(VagaModel):
    """
    Controller responsável pelo controle de vagas no sistema de recrutamento.
    
    Herda de VagaModel e fornece métodos para gerenciar vagas, 
    como criação, atualização e consulta de setores e cargos.
    
    Atributos:
    ----------
    nome_vaga : str
        O nome da vaga. (protected)
    descricao_vaga : str
        A descrição da vaga. (protected)
    status : str
        O status da vaga. (protected)
    salario : float
        O salário da vaga. (protected)
    quantidade_vagas : int
        A quantidade de vagas. (protected)
    data_encerramento : str
        A data de encerramento da vaga. (protected)
    __mysql : MySQLService
        Instância do serviço `MySQLService` para gerenciar conexões e operações no banco de dados. (private)
    __validators_schema : ValidatorsSchema
        Classe responsável por validações, como a validação de senhas e tokens. (private)
    
    Métodos:
    --------
    pegar_setores_cargos() -> tuple[list, list]: (public)
        Retorna uma tupla com listas de setores e cargos disponíveis.
        
    __buscar_setor_cargo(nome_setor: str, nome_cargo: str, db_cursor: MySQLCursor) -> tuple[int, int]: (private)
        Retorna o ID do setor e cargo correspondente ao nome fornecido.
        
    pegar_todas_vagas() -> list: (public)
        Retorna uma lista com todas as vagas cadastradas.
        
    criar_vaga(setor: str, cargo: str) -> None: (public)
        Cria uma nova vaga com os dados fornecidos.
        
    atualizar_vaga(id_vaga: int) -> None: (public)
        Atualiza uma vaga existente com os dados atuais da classe.
    """
    def __init__(self, nome_vaga: str = None, descricao_vaga: str = None, status: str = None, salario: float = None, quantidade_vagas: int = None, data_encerramento: str = None):
        super().__init__(
            _nome_vaga=nome_vaga, _descricao_vaga=descricao_vaga, 
            _status=status, _salario=salario, 
            _quantidade_vagas=quantidade_vagas, _data_encerramento=data_encerramento
        )
        self.__validators_schema: Validators = Validators()
        self.__mysql: MySQLService = MySQLService()
        
   
    def pegar_setores_cargos(self) -> tuple[list, list]:
        db_connection: MySQLConnection = self.__mysql.connect()
        db_cursor: MySQLCursor = db_connection.cursor()
        
        setores_raw: list[list[str]] = self.__mysql.fetch_all(SQL_BUSCAR_SETOR_POR_NOME, None, db_cursor)
        cargos_raw: list[list[str]] = self.__mysql.fetch_all(SQL_BUSCAR_CARGO_POR_NOME, None, db_cursor)
        
        setores: list[str] = [setor[0] for setor in setores_raw]
        cargos: list[str] = [cargo[0] for cargo in cargos_raw]
        
        self.__mysql.close_cursor_and_connection(db_cursor, db_connection)
        
        return setores, cargos
    
        
    def __buscar_setor_cargo(self, nome_setor: str, nome_cargo: str, db_cursor: MySQLCursor) -> tuple[int, int]:
        resultado_setor: tuple = self.__mysql.fetch_one(
            SQL_BUSCAR_SETOR_POR_ID, 
            (nome_setor,), 
            db_cursor
        )
        resultado_cargo: tuple = self.__mysql.fetch_one(
            SQL_BUSCAR_CARGO_POR_ID, 
            (nome_cargo,), 
            db_cursor
        )
        
        if not resultado_setor or not resultado_cargo:
            raise ValueError("Setor ou cargo não encontrado")
        
        return resultado_setor[0], resultado_cargo[0]
    
    
    def pegar_todas_vagas(self, pagina: int, is_admin: int,  limite_por_pagina: int = 4) -> tuple[int, list[dict]]:
        db_connection: MySQLConnection = self.__mysql.connect()
        db_cursor: MySQLCursor = db_connection.cursor(dictionary=True)
        
        sql_vagas: str = SQL_PEGAR_TODAS_VAGAS if is_admin == 1 else SQL_PEGAR_VAGAS_ABERTAS
        sql_quantidade_vagas: str = SQL_QUANTIDADE_VAGAS if is_admin == 1 else f"{SQL_QUANTIDADE_VAGAS}\nWHERE status = 'ABERTA'"
        
        total_de_paginas, resultado = self.__validators_schema.validar_paginacao(
            pagina, limite_por_pagina, sql_vagas, sql_quantidade_vagas, db_cursor
        )
        
        def converter_dados(vaga: dict) -> dict:
            for campo in ['data_encerramento', 'data_abertura']:
                if isinstance(vaga.get(campo), (date, datetime)):
                    vaga[campo] = vaga[campo].strftime("%Y-%m-%d %H:%M:%S") if isinstance(vaga[campo], datetime) else vaga[campo].strftime("%Y-%m-%d")
            return vaga
        
        vagas: list[dict] = [converter_dados(vaga) for vaga in resultado]

        self.__mysql.close_cursor_and_connection(db_cursor, db_connection)
        
        return total_de_paginas, vagas
    
    
    def criar_vaga(self, setor: str, cargo: str) -> None:
        db_connection: MySQLConnection = self.__mysql.connect()
        db_cursor: MySQLCursor = db_connection.cursor()
        
        try:
            db_connection.start_transaction()
            
            id_setor, id_cargo = self.__buscar_setor_cargo(setor, cargo, db_cursor)
            
            db_cursor.execute(
                SQL_CRIAR_VAGA, 
                (id_setor, id_cargo, self.nome_vaga, self.descricao_vaga, self.status, self.salario, self.quantidade_vagas, self.data_encerramento),
            )
            
            db_connection.commit()
        except IntegrityError as ie:
            db_connection.rollback()
            raise IntegrityError(f"Erro de integridade ao criar a vaga: {ie}")
        except DatabaseError as de:
            db_connection.rollback()
            raise DatabaseError(f"Erro de banco de dados ao criar a vaga: {de}")
        except Exception as error:
            db_connection.rollback()
            raise Exception(f"Erro ao criar a vaga: {error}")
        finally:
            self.__mysql.close_cursor_and_connection(db_cursor, db_connection)  
            
    
    def atualizar_vaga(self, id_vaga: int, setor: str, cargo: str) -> None:
        db_connection: MySQLConnection = self.__mysql.connect()
        db_cursor: MySQLCursor = db_connection.cursor()
        
        try:
            db_connection.start_transaction()
            
            id_setor, id_cargo = self.__buscar_setor_cargo(setor, cargo, db_cursor)
            
            db_cursor.execute(
                SQL_ATUALIZAR_VAGA, 
                (id_setor, id_cargo, self.nome_vaga, self.status, self.descricao_vaga, self.salario, self.quantidade_vagas, self.data_encerramento, id_vaga),
            )
            
            db_connection.commit()
        except IntegrityError as ie:
            db_connection.rollback()
            raise IntegrityError(f"Erro de integridade ao atualizar a vaga: {ie}")
        except DatabaseError as de:
            db_connection.rollback()
            raise DatabaseError(f"Erro de banco de dados ao atualizar a vaga: {de}")
        except Exception as error:
            db_connection.rollback()
            raise Exception(f"Erro ao atualizar a vaga: {error}")
        finally:
            self.__mysql.close_cursor_and_connection(db_cursor, db_connection)
            
    
    def __str__(self):
        return (
            "VagaController("
            f"nome_vaga='{self.nome_vaga}', "
            f"descricao_vaga='{self.descricao_vaga}', "
            f"status='{self.status}', "
            f"salario='{self.salario}', "
            f"quantidade_vagas='{self.quantidade_vagas}', "
            f"data_encerramento='{self.data_encerramento}'"
            ")"
        )