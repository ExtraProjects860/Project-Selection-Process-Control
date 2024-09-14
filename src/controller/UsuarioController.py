import bcrypt
import secrets
from mysql.connector import DatabaseError, IntegrityError
from datetime import datetime
from src.model.UsuarioModel import UsuarioModel
from src.config.MysqlService import MySQLService
from src.util.EmailService import EmailService
from src.middleware.Middleware import Middleware
from src.validators.Validators import ValidatorsSchema
from src.controller.DadosUsuarioController import DadosUsuarioController

validators_schema: ValidatorsSchema = ValidatorsSchema()

class UsuarioController(UsuarioModel):
    
    def __init__(self, dados_usuario: DadosUsuarioController, email: str, senha: str, admin: bool):
        super().__init__(dados_usuario=dados_usuario, email=email, senha=senha, admin=admin)
        
    
    def criar_usuario(self) -> None:
        mysql: MySQLService = MySQLService()
        comandoSQL_usuario: str = """
            INSERT INTO usuario (email, senha, admin)
            VALUES (%s, %s, %s);
        """
            
        hashedPassword: str = bcrypt.hashpw(self.senha.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
        try:
            mysql.begin_transaction()
            self.dados_usuario.inserir_dados_usuario(
                comandoSQL_usuario, 
                (self.email, hashedPassword, self.admin),
                mysql
            )
            mysql.commit()
        except IntegrityError as ie:
            mysql.rollback()
            raise IntegrityError(f"Erro de integridade ao criar o usuário: {ie}")
        except DatabaseError as de:
            mysql.rollback()
            raise DatabaseError(f"Erro de banco de dados ao criar o usuário: {de}")
        except Exception as error:
            mysql.rollback()
            raise Exception(f"Erro ao criar o usuário: {error}")
        finally:
            mysql.close_cursor()
            mysql.close_connection()
    
    
    def login(self) -> str:
        mysql: MySQLService = MySQLService()
        comandoSQL_login: str = """
            SELECT u.id_usuario, u.senha, u.admin, du.nome_usuario
            FROM usuario u
            INNER JOIN dados_usuario du ON u.id_usuario = du.id_dados_usuario
            WHERE u.email = %s;
        """
        
        resultado: tuple = mysql.fetch_one(comandoSQL_login, (self.email,))
        mysql.close_cursor()
        mysql.close_connection()
            
        if not resultado:
            raise ValueError("Usuário não encontrado ou dados inválidos")
            
        validacao: bool = validators_schema.validate_password(senha_usuario=self.senha, senha_banco_de_dados=resultado[1])
            
        if not validacao:
            raise ValueError("Senha inválida")
        
        token_de_acesso: str = Middleware.create_access_jwt(
            id_usuario=resultado[0], email_usuario=self.email,
            nome_usuario=resultado[3], is_admin=resultado[2],
        )
            
        return token_de_acesso
    
    
    def requisitar_token_troca_de_senha(self) -> None:
        mysql: MySQLService = MySQLService()
        comandoSQL_atualizar_token: str = """
            UPDATE usuario 
            SET tokenForgotPassword = %s, tokenTimeValid = %s
            WHERE email = %s;
        """
        token_de_troca_da_senha: str = secrets.token_urlsafe(8)
        tempo_de_validade: str = datetime.now().isoformat()
        
        try:
            mysql.begin_transaction()
            mysql.execute_query(comandoSQL_atualizar_token, (token_de_troca_da_senha, tempo_de_validade, self.email))
            mysql.commit()
        except DatabaseError as de:
            mysql.rollback()
            raise DatabaseError(f"Erro ao atualizar token no banco de dados: {de}")
        except Exception as error:
            mysql.rollback()
            raise Exception(f"Erro ao redefinir senha {error}")
        finally:
            mysql.close_cursor()
            mysql.close_connection()
        
        EmailService().send_email_forgot_password(
            self.email, 
            "Aviso de redefinição de senha",
            "Você solicitou uma redefinição de senha. Seu token de redefinição é:" ,
            token_de_troca_da_senha
        )
       
        
    def redefinir_senha(self, token: str) -> None:
        mysql: MySQLService = MySQLService()
        validators_schema.validate_validade_e_token(self.email, token, mysql)
        
        hashedPassword: str = bcrypt.hashpw(self.senha.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        comandoSQL_redefinir_senha: str = """
            UPDATE usuario
            SET senha = %s, tokenForgotPassword = NULL, tokenTimeValid = NULL
            WHERE email = %s;
        """
        
        try:
            mysql.begin_transaction()
            mysql.execute_query(comandoSQL_redefinir_senha, (hashedPassword, self.email))
            mysql.commit()
        except DatabaseError as de:
            mysql.rollback()
            raise DatabaseError(f"Erro ao redefinir senha no banco de dados: {de}")
        except Exception as error:
            mysql.rollback()
            raise Exception(f"Erro ao redefinir senha {error}")
        finally:
            mysql.close_cursor()
            mysql.close_connection()