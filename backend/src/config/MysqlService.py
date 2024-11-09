import mysql.connector
import os
from dotenv import load_dotenv
from mysql.connector import Error, DatabaseError, InterfaceError, MySQLConnection
from mysql.connector.cursor import MySQLCursor

class MySQLService:
    def __init__(self):
        load_dotenv()
        #MYSQL_HOST_HOMO
        self.__host: str = os.getenv("MYSQL_HOST_PROD")
        #MYSQL_USER_HOMO
        self.__user: str = os.getenv("MYSQL_USER_PROD")
        #MYSQL_PASSWORD_HOMO
        self.__password: str = os.getenv("MYSQL_PASSWORD_PROD")
        #MYSQL_DATABASE_HOMO
        self.__database: str = os.getenv("MYSQL_DATABASE_PROD")


    def connect(self) -> MySQLConnection:
        try:
            connection = mysql.connector.connect(
                host=self.__host,
                user=self.__user,
                password=self.__password,
                database=self.__database
            )
            connection.autocommit = False
            return connection
        except InterfaceError as error:
            raise ConnectionError(f"Erro de conexão ao MySQL: {error}")
        except DatabaseError as error:
            raise ConnectionError(f"Erro no banco de dados MySQL: {error}")
        except Error as error:
            raise ConnectionError(f"Erro geral ao conectar ao MySQL: {error}")


    def lastrowid(self, cursor: MySQLCursor) -> int:
        return cursor.lastrowid
    
    
    def fetch_all(self, query: str, values: tuple = (), cursor: MySQLCursor = None) -> list[tuple] | list[dict]:
        cursor.execute(query, values)
        return cursor.fetchall()
    
    
    def fetch_one(self, query: str, values: tuple = (), cursor: MySQLCursor = None) -> tuple | dict:
        cursor.execute(query, values)
        return cursor.fetchone()
    
    
    def close_cursor_and_connection(self, cursor: MySQLCursor, connection: MySQLConnection) -> None:
        if cursor and connection:
            cursor.close()
            connection.close()