import bcrypt
from src.config.MysqlService import MySQLService
from mysql.connector import DatabaseError, IntegrityError, MySQLConnection
from datetime import datetime, timedelta, date
from mysql.connector import MySQLConnection
from mysql.connector.cursor import MySQLCursor
from src.validators.sql_validators.comandos_sql import (
    SQL_VERIFICAR_SE_TOKEN_ESTA_NA_BLACKLIST,
    SQL_INSERIR_TOKEN_NA_BLACKLIST,
    SQL_VERIFICAR_SE_EMAIL_EXISTE,
    SQL_VERIFICAR_VALIDADE_E_TOKEN,
    SQL_INVALIDAR_TOKEN
)

class Validators:
    
    def __init__(self):
        self.__mysql: MySQLService = MySQLService()
        
        
    def formatar_data(self, data) -> str:
        if isinstance(data, (datetime, date)):
            return data.strftime("%Y-%m-%d")
        
        try:
            data_convertida = datetime.strptime(data, "%a, %d %b %Y %H:%M:%S %Z")
            return data_convertida.strftime("%Y-%m-%d")
        except ValueError:
            return data
    
    
    def validar_paginacao(self, pagina: int, limite_por_pagina: int, SQL_ALL: str, SQL_QUANTIDADE: str, db_cursor: MySQLCursor, id_usuario: int = None) -> tuple[int, list[dict]]:
        offset: int = (pagina - 1) * limite_por_pagina

        # não é o melhor dos mundos utilizar esse else por conta da forte acoplação e da manutenção no código
        if id_usuario:
            resultado: list[dict] = self.__mysql.fetch_all(SQL_ALL, (id_usuario, limite_por_pagina, offset,), db_cursor)
            quantidade_de_itens: int = self.__mysql.fetch_one(SQL_QUANTIDADE, (id_usuario,), db_cursor)["quantidade"]
        else:
            resultado: list[dict] = self.__mysql.fetch_all(SQL_ALL, (limite_por_pagina, offset,), db_cursor)
            quantidade_de_itens: int = self.__mysql.fetch_one(SQL_QUANTIDADE, None, db_cursor)["quantidade"]
        
        total_de_paginas: int = (quantidade_de_itens + limite_por_pagina - 1) // limite_por_pagina
        
        if pagina > total_de_paginas:
            raise ValueError("Nenhuma vaga encontrada. Total de paginas excedido.")
        
        return total_de_paginas, resultado
    
    
    # está sendo utiliza na classe de middleware
    def checar_se_token_esta_na_blacklist(self, jwt_payload: dict[str, str]) -> bool:
        db_connection: MySQLConnection = self.__mysql.connect()
        db_cursor: MySQLCursor = db_connection.cursor()
        
        result = self.__mysql.fetch_one(SQL_VERIFICAR_SE_TOKEN_ESTA_NA_BLACKLIST, (jwt_payload["jti"],), db_cursor)
        self.__mysql.close_cursor_and_connection(db_cursor, db_connection)
            
        return result is not None and result[0]


    def adicionar_token_na_blacklist(self, jti: str) -> None:
        db_connection: MySQLConnection = self.__mysql.connect()
        db_cursor: MySQLCursor = db_connection.cursor()
        
        try:
            db_connection.start_transaction()
            db_cursor.execute(SQL_INSERIR_TOKEN_NA_BLACKLIST, (jti,))
            db_connection.commit()
        except IntegrityError as ie:
            db_connection.rollback()
            raise IntegrityError(f"Erro de integridade ao adicionar token na blacklist: {ie}")
        except DatabaseError as de:
            db_connection.rollback()
            raise DatabaseError(f"Erro de banco de dados ao adicionar token na blacklist: {de}")
        except Exception as error:
            db_connection.rollback()
            raise Exception(f"Erro ao adicionar token na blacklist: {error}")
        finally:
            self.__mysql.close_cursor_and_connection(db_cursor, db_connection)
    
    
    def validate_body(self, body: dict[str, str]) -> bool:
        # o comentado é o correto, porém não estou utilizando ainda, pois não validei as rotas com ele
        # return not any(x == None or x == '' for x in body.values())
        return filter(lambda x: x != None, body.values())
                  
            
    def validate_email_exists(self, email: str) -> None:
        db_connection: MySQLConnection = self.__mysql.connect()
        db_cursor: MySQLCursor = db_connection.cursor()
        
        if not self.__mysql.fetch_one(SQL_VERIFICAR_SE_EMAIL_EXISTE, (email,), db_cursor):
            self.__mysql.close_cursor_and_connection(db_cursor, db_connection)
            raise ValueError("Email não encontrado")
        
        self.__mysql.close_cursor_and_connection(db_cursor, db_connection)
    
    
    def validate_password(self, senha_usuario: str, senha_banco_de_dados: str) -> bool:
        if not bcrypt.checkpw(senha_usuario.encode('utf-8'), senha_banco_de_dados.encode('utf-8')):
            return False
        
        bcrypt.checkpw(senha_usuario.encode('utf-8'), senha_banco_de_dados.encode('utf-8'))
        return True
    

    def validate_validade_e_token(self, email: str, token: str, mysql: MySQLService, db_connection: MySQLConnection, db_cursor: MySQLCursor) -> None:
        data_token: tuple = mysql.fetch_one(SQL_VERIFICAR_VALIDADE_E_TOKEN, (email,), db_cursor)
            
        if token != data_token[0]:
            raise ValueError("Token invalido, tente novamente")
            
        if datetime.fromisoformat(str(data_token[1])) - datetime.now() >= timedelta(hours=1):
            self.__remover_token_senha(email, db_connection, db_cursor)
            raise Exception("Token expirado")
        
    
    def __remover_token_senha(self, email: str, db_connection: MySQLConnection, db_cursor: MySQLCursor) -> None:
        try:
            db_connection.start_transaction()
            db_cursor.execute(SQL_INVALIDAR_TOKEN, (email,))
            db_connection.commit()
        except IntegrityError as ie:
            db_connection.rollback()
            raise IntegrityError(f"Erro de integridade ao remover token: {ie}")
        except DatabaseError as de:
            db_connection.rollback()
            raise DatabaseError(f"Erro de banco de dados ao remover token: {de}")
        except Exception as error:
            db_connection.rollback()
            raise Exception(f"Erro ao remover token {error}")
        finally:
            self.__mysql.close_cursor_and_connection(db_cursor, db_connection)  