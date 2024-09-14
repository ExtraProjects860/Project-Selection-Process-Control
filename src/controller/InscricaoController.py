import re
from mysql.connector.errors import DatabaseError, IntegrityError
from src.model.InscricaoModel import InscricaoModel
from src.config.MysqlService import MySQLService

class InscricaoController(InscricaoModel):
    
    def __init__(self, id_usuario: int, id_vaga: int):
        super().__init__(
            id_usuario=id_usuario, id_vaga=id_vaga
        )
    
         
    def pegar_curriculo(self) -> str:
        mysql: MySQLService = MySQLService()
        comandoSQL_curriculo: str = """
            SELECT curriculo
            FROM dados_usuario
            WHERE id_dados_usuario = %s;
        """
        
        try:
            mysql.begin_transaction()
            resultado = mysql.fetch_one(comandoSQL_curriculo, (self.id_usuario,))
            mysql.commit()
            
            return resultado[0]
        except DatabaseError as de:
            mysql.rollback()
            raise DatabaseError(f"Erro de banco de dados ao pegar o curriculo: {de}")
        except Exception as error:
            mysql.rollback()
            raise Exception(f"Erro ao pegar o curriculo: {error}")
        finally:
            mysql.close_cursor()
            mysql.close_connection()
    
    
    def tratar_nome_curriculo(self, nome_usuario: str) -> str:
        nome_usuario_sanitizado: str = re.sub(r'[^\w\s]', '', nome_usuario)  # Remover caracteres especiais
        nome_arquivo: str = f"{nome_usuario_sanitizado}_{self.id_usuario}_curriculo.pdf"
        return nome_arquivo
    
    
    def subir_curriculo(self, mysql: MySQLService, nome_arquivo: str) -> None:
        comandoSQL_curriculo: str = """
            UPDATE dados_usuario
            SET curriculo = %s
            WHERE id_dados_usuario = %s;
        """
        
        mysql.execute_query(comandoSQL_curriculo, (nome_arquivo, self.id_usuario),)
        
    
    def salvar_inscricao_curriculo(self, nome_arquivo: str) -> None:
        mysql: MySQLService = MySQLService()
        comandoSQL_inscricao: str = """
            INSERT INTO inscricao (id_usuario, id_vaga)
            VALUES (%s, %s);
        """
        
        try:
            mysql.begin_transaction()
            
            mysql.execute_query(comandoSQL_inscricao, (self.id_usuario, self.id_vaga),)
            self.subir_curriculo(mysql, nome_arquivo)
            
            mysql.commit()
        except DatabaseError as de:
            mysql.rollback()
            raise DatabaseError(f"Erro de banco de dados ao salvar a inscricao: {de}")
        except IntegrityError as ie:
            mysql.rollback()
            raise IntegrityError(f"Erro de integridade ao salvar a inscricao: {ie}")
        except Exception as error:
            mysql.rollback()
            raise Exception(f"Erro ao salvar a inscricao: {error}")
        finally:
            mysql.close_cursor()
            mysql.close_connection()