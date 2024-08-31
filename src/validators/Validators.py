import os
import bcrypt
from flask_jwt_extended import create_access_token, get_jwt
from werkzeug.utils import secure_filename
from config.MysqlService import MySQLService
from datetime import timedelta, datetime

mysql: MySQLService = MySQLService()

class ValidatorsSchema:
    
    @staticmethod
    def salvar_curriculo(id_usuario: int, nome: str, arquivo_curriculo) -> None | str:
        if not arquivo_curriculo or not arquivo_curriculo.filename.endswith('.pdf'):
            raise ValueError("Arquivo de currículo inválido, somente PDFs são aceitos.")
        
        filename = secure_filename(f"{id_usuario}_{nome}.pdf")
        filepath = os.path.join(os.getcwd(), "src", "archives", filename)
        arquivo_curriculo.save(filepath)
        return filepath
    
    
    @staticmethod
    def checar_se_token_esta_na_blacklist(jwt_payload: str) -> bool:
        comandoSQL_checar_token: str = """
            SELECT revogado
            FROM token_blacklist
            WHERE jti = %s;
        """
        
        result = mysql.fetch_one(comandoSQL_checar_token, (jwt_payload["jti"],))
        mysql.close_cursor()
            
        return result is not None and result[0]


    @staticmethod
    def adicionar_token_na_blacklist(jti: str) -> None:
        comandoSQL_inserir_token: str = """
            INSERT INTO token_blacklist (jti)
            VALUES (%s);
        """
        
        try:
            mysql.begin_transaction()
            mysql.execute_query(comandoSQL_inserir_token, (jti,))
            mysql.commit()
        except Exception as error:
            mysql.rollback()
            raise Exception(f"Erro ao adicionar token na blacklist: {error}")
        finally:
            mysql.close_cursor()
    
    
    @staticmethod
    def validate_body(body: dict) -> None:
        for key in body:
            if not body[key]:
                raise Exception(f"O campo {key} é obrigatório")
            
            
    @staticmethod
    def validate_email_exists(email: str) -> None:
        comandoSQL_verificar_email: str = """
            SELECT email 
            FROM usuario 
            WHERE email = %s
        """
        
        if not mysql.fetch_one(comandoSQL_verificar_email, (email,)):
            raise Exception("Email não encontrado")
    
    
    @staticmethod
    def validate_email_is_admin(email: str) -> bool:
        if not "@webcertificados.com.br" in email:
            return False
        
        return True
    
    
    @staticmethod
    def validate_password(id_usuario: int, email_usuario: str, nome_usuario: str, senha_usuario: str, senha_banco_de_dados: str) -> tuple[bool, str]:
        if not bcrypt.checkpw(senha_usuario.encode('utf-8'), senha_banco_de_dados.encode('utf-8')):
            return False, "Senha inválida"
        
        bcrypt.checkpw(senha_usuario.encode('utf-8'), senha_banco_de_dados.encode('utf-8'))
        token_de_acesso: str = create_access_token(identity={
            "id": id_usuario, 
            "email": email_usuario, 
            "nome": nome_usuario
        })
            
        return True, token_de_acesso
    
    
    @staticmethod
    def validar_validade_e_token(email: str, token: str) -> bool:
        comandoSQL_verificar_validade_e_token: str = """
            SELECT tokenForgotPassword, tokenTimeValid
            From usuario
            WHERE email = %s;
        """
        
        data_token: tuple = mysql.fetch_one(comandoSQL_verificar_validade_e_token, (email,))
        
        if not datetime.now() - datetime.fromisoformat(data_token[1]) < timedelta(hours=1):
            raise Exception("Token expirado")
        
        if not token == data_token[0]:
            raise Exception("Token inválido, tente novamente")