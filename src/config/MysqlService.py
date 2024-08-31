import mysql.connector
import os
from dotenv import load_dotenv

class MySQLService:
    def __init__(self):
        load_dotenv()
        self.__connection = mysql.connector.connect(
            host=os.getenv("MYSQL_HOST_HOMO"),
            user=os.getenv("MYSQL_USER_HOMO"),
            password=os.getenv("MYSQL_PASSWORD_HOMO"),
            database=os.getenv("MYSQL_DATABASE_HOMO")
        )
        self.__connection.autocommit = False
        self.__cursor = self.__connection.cursor()


    def close_cursor(self) -> None:
        self.__cursor.close()
    
    
    def close_connection(self) -> None:
        self.__connection.close()
    
    
    def lastrowid(self) -> int:
        return self.__cursor.lastrowid


    def commit(self) -> None:
        self.__connection.commit()
    
    
    def begin_transaction(self) -> None:
        self.__connection.start_transaction()
    
    
    def rollback(self) -> None:
        self.__connection.rollback()
    
    
    def execute_query(self, query: str, values: tuple = ()) -> None:
        self.__cursor.execute(query, values)
    
    
    def fetch_all(self, query: str, values: tuple = ()) -> tuple:
        self.__cursor.execute(query, values)
        return self.__cursor.fetchall()
    
    
    def fetch_one(self, query: str, values: tuple = ()) -> tuple:
        self.__cursor.execute(query, values)
        return self.__cursor.fetchone()

    
    
    