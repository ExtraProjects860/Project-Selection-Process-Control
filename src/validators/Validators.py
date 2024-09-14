import os
import bcrypt
from werkzeug.utils import secure_filename
from src.config.MysqlService import MySQLService
from mysql.connector import DatabaseError, IntegrityError
from datetime import datetime, timedelta

class ValidatorsSchema:
    
    # não está sendo utilizado no momento
    def salvar_curriculo(self, id_usuario: int, nome: str, arquivo_curriculo) -> None | str:
        if not arquivo_curriculo or not arquivo_curriculo.filename.endswith('.pdf'):
            raise ValueError("Arquivo de currículo inválido, somente PDFs são aceitos.")
        
        filename = secure_filename(f"{id_usuario}_{nome}.pdf")
        filepath = os.path.join(os.getcwd(), "src", "archives", filename)
        arquivo_curriculo.save(filepath)
        return filepath
    
    
    def checar_se_token_esta_na_blacklist(self, jwt_payload: str, mysql: MySQLService) -> bool:
        # está sendo utiliza na classe de middleware
        comandoSQL_checar_token: str = """
            SELECT revogado
            FROM token_blacklist
            WHERE jti = %s;
        """
        
        result = mysql.fetch_one(comandoSQL_checar_token, (jwt_payload["jti"],))
        mysql.close_cursor()
            
        return result is not None and result[0]


    def adicionar_token_na_blacklist(self, jti: str) -> None:
        mysql: MySQLService = MySQLService()
        comandoSQL_inserir_token: str = """
            INSERT INTO token_blacklist (jti)
            VALUES (%s);
        """
        
        try:
            mysql.begin_transaction()
            mysql.execute_query(comandoSQL_inserir_token, (jti,))
            mysql.commit()
        except IntegrityError as ie:
            mysql.rollback()
            raise IntegrityError(f"Erro de integridade ao adicionar token na blacklist: {ie}")
        except DatabaseError as de:
            mysql.rollback()
            raise DatabaseError(f"Erro de banco de dados ao adicionar token na blacklist: {de}")
        except Exception as error:
            mysql.rollback()
            raise Exception(f"Erro ao adicionar token na blacklist: {error}")
        finally:
            mysql.close_cursor()
            mysql.close_connection()
    
    
    def validate_body(self, body: dict[str, str]) -> bool:
        return all(value is not None for value in body.values())
                  
            
    def validate_email_exists(self, email: str) -> None:
        mysql: MySQLService = MySQLService()
        comandoSQL_verificar_email: str = """
            SELECT email 
            FROM usuario 
            WHERE email = %s;
        """
        
        if not mysql.fetch_one(comandoSQL_verificar_email, (email,)):
            raise Exception("Email não encontrado")
    
    
    def validate_password(self, senha_usuario: str, senha_banco_de_dados: str) -> bool:
        if not bcrypt.checkpw(senha_usuario.encode('utf-8'), senha_banco_de_dados.encode('utf-8')):
            return False
        
        bcrypt.checkpw(senha_usuario.encode('utf-8'), senha_banco_de_dados.encode('utf-8'))
        return True
    

    def validate_validade_e_token(self, email: str, token: str, mysql: MySQLService) -> None:
        comandoSQL_verificar_validade_e_token: str = """
            SELECT tokenForgotPassword, tokenTimeValid
            From usuario
            WHERE email = %s;
        """
        
        data_token: tuple = mysql.fetch_one(comandoSQL_verificar_validade_e_token, (email,))
        
        if not token == data_token[0]:
            raise ValueError("Token inválido, tente novamente")
        
        if datetime.fromisoformat(str(data_token[1])) - datetime.now() >= timedelta(hours=1):
            ValidatorsSchema().remover_token_senha(email)
            raise Exception("Token expirado")
        
    
    def remover_token_senha(self, email: str, mysql: MySQLService) -> None:
        comandoSQL_invalidar_token: str = """
            UPDATE usuario
            SET tokenForgotPassword = NULL, tokenTimeValid = NULL
            WHERE email = %s;
        """
        
        try:
            mysql.begin_transaction()
            mysql.execute_query(comandoSQL_invalidar_token, (email,))
            mysql.commit()
        except DatabaseError as de:
            mysql.rollback()
            raise DatabaseError(f"Erro de banco de dados ao remover token: {de}")
        except Exception as error:
            mysql.rollback()
            raise Exception(f"Erro ao remover token {error}")
        finally:
            mysql.close_cursor()   