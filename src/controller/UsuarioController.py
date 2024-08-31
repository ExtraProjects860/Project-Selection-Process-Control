import bcrypt
import secrets
from datetime import timedelta, datetime
from model.UsuarioModel import UsuarioModel
from config.MysqlService import MySQLService
from util.EmailService import EmailService
from validators.Validators import ValidatorsSchema
from controller.DadosUsuarioController import DadosUsuarioController

mysql: MySQLService = MySQLService()

class UsuarioController(UsuarioModel):
    
    def __init__(self, dados_usuario: DadosUsuarioController, email: str, senha: str, admin: bool):
        super().__init__(
            dados_usuario=dados_usuario,
            email=email, 
            senha=senha, 
            admin=admin, 
        )
        
    
    def criar_usuario(self) -> None:
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
            )
            mysql.commit()
        except Exception as error:
            mysql.rollback()
            raise Exception(f"Erro ao criar o usuário: {error}")
        finally:
            mysql.close_cursor()
    
    
    def login(self) -> str:
        comandoSQL_login: str = """
            SELECT u.id_usuario, u.senha, u.admin, du.nome
            FROM usuario u
            INNER JOIN dados_usuario du ON u.id_usuario = du.id_dados_usuario
            WHERE u.email = %s
        """
        
        resultado: tuple = mysql.fetch_one(comandoSQL_login, (self.email,))
            
        if not resultado:
            raise Exception("Usuário não encontrado")
            
        validacao, resposta = ValidatorsSchema.validate_password(
            id_usuario=resultado[0][0], 
            email_usuario=self.email,
            nome_usuario=resultado[0][3],
            senha_usuario=self.senha, 
            senha_banco_de_dados=resultado[0][1]
        )
            
        if not validacao:
            raise Exception(resposta)
        
        mysql.close_cursor()
            
        return resposta # se passar pelo if o token de acesso vem aqui
    
    
    def requisitar_token_troca_de_senha(self) -> None:
        comandoSQL_atualizar_token: str = """
            UPDATE usuario 
            SET tokenForgotPassword = %s, tokenTimeValid = %s
            WHERE email = %s,
        """
        token_de_troca_da_senha: str = secrets.token_urlsafe(8)
        tempo_de_validade: str = datetime.now().isoformat()
        
        try:
            mysql.begin_transaction()
            mysql.execute_query(comandoSQL_atualizar_token, (token_de_troca_da_senha, tempo_de_validade, self.email))
            mysql.commit()
        except Exception as error:
            mysql.rollback()
            raise Exception(f"Erro ao redefinir senha: {error}")
        finally:
            mysql.close_cursor()
        
        email_service: EmailService = EmailService()
        email_service.send_email_forgot_password(
            self.email, 
            "Aviso de redefinição de senha",
            "Você solicitou uma redefinição de senha. Seu token de redefinição é:" ,
            token_de_troca_da_senha
        )
       
        
    def redefinir_senha(self, token: str) -> None:
        ValidatorsSchema.validar_validade_e_token(self.email, token)
        
        hashedPassword: str = bcrypt.hashpw(self.senha.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        comandoSQL_redefinir_senha: str = """
            UPDATE usuario
            SET senha = %s
            WHERE email = %s;
        """
        
        try:
            mysql.begin_transaction()
            mysql.execute_query(comandoSQL_redefinir_senha, (hashedPassword, self.email))
            mysql.commit()
        except Exception as error:
            mysql.rollback()
            raise Exception(f"Erro ao redefinir senha: {error}")
        finally:
            mysql.close_cursor()

        
        