import bcrypt
import secrets
from mysql.connector import DatabaseError, IntegrityError, MySQLConnection
from mysql.connector.cursor import MySQLCursor
from datetime import datetime
from src.model.UsuarioModel import UsuarioModel
from src.config.MysqlService import MySQLService
from src.util.EmailService import EmailService
from src.middleware.Middleware import Middleware
from src.validators.Validators import Validators
from src.controller.DadosUsuarioController import DadosUsuarioController
from src.controller.sql_usuario.comandos_sql import (
    SQL_UPDATE_USER_OU_ADMIN,
    SQL_CRIAR_USUARIO,
    SQL_LOGIN_USUARIO,
    SQL_ATUALIZAR_TOKEN,
    SQL_REDEFINIR_SENHA
)


class UsuarioController(UsuarioModel):
    """
    Controller responsável por gerenciar as operações relacionadas aos usuários no sistema.

    Esta classe herda de `UsuarioModel` e encapsula funcionalidades que permitem a criação,
    atualização, autenticação e redefinição de senha de usuários. Ela utiliza serviços
    de banco de dados (MySQL), validação de dados e envio de emails para cumprir essas funções.

    Atributos:
    ----------
    dados_usuario : DadosUsuarioController (protected)
        Controlador de dados do usuário que interage diretamente com a base de dados.
    email : str
        O email do usuário. (protected)
    senha : str
        A senha do usuário. (protected)
    admin : bool
        Define se o usuário é um administrador (True) ou não (False). (protected)
    __mysql : MySQLService
        Serviço responsável por gerenciar as operações no banco de dados MySQL. (private)
    __validators_schema : ValidatorsSchema
        Classe responsável por validações, como a validação de senhas e tokens. (private)
    __email_service : EmailService
        Serviço responsável pelo envio de emails, como redefinição de senha. (private)

    Métodos:
    --------
    atualizar_usuario_ou_admin(id_usuario: int) -> None: (public)
        Atualiza as permissões de um usuário para administrador ou usuário comum no banco de dados.
    
    criar_usuario() -> None: (public)
        Cria um novo usuário no sistema e armazena suas credenciais no banco de dados.

    login() -> str: (public)
        Realiza a autenticação do usuário com base no email e senha fornecidos.
        Retorna um token JWT se a autenticação for bem-sucedida.

    requisitar_token_troca_de_senha() -> None: (public)
        Gera e envia por email um token para redefinição de senha, atualizando o banco de dados
        com o token e a validade.

    redefinir_senha(token: str) -> None: (public)
        Redefine a senha do usuário após a validação do token fornecido. Atualiza a senha no banco de dados.
    """
    
    def __init__(self, dados_usuario: DadosUsuarioController, email: str, senha: str, admin: bool):
        super().__init__(
            _dados_usuario=dados_usuario, _email=email, 
            _senha=senha, _admin=admin
        )
        self.__mysql: MySQLService = MySQLService()
        self.__validators_schema: Validators = Validators()
        self.__email_service: EmailService = EmailService()
    
    
    def atualizar_usuario_ou_admin(self, id_usuario: int) -> None:
        db_connection: MySQLConnection = self.__mysql.connect()
        db_cursor: MySQLCursor = db_connection.cursor()
        try:
            db_connection.start_transaction()
            db_cursor.execute(SQL_UPDATE_USER_OU_ADMIN, (self.admin, id_usuario))
            db_connection.commit()
        except IntegrityError as ie:
            db_connection.rollback()
            raise IntegrityError(f"Erro de integridade ao atualizar o usuário: {ie}")
        except DatabaseError as de:
            db_connection.rollback()
            raise DatabaseError(f"Erro de banco de dados ao atualizar o usuário: {de}")
        except Exception as error:
            db_connection.rollback()
            raise Exception(f"Erro ao atualizar o usuário: {error}")
        finally:
            self.__mysql.close_cursor_and_connection(db_cursor, db_connection)
    
    
    def criar_usuario(self) -> None:
        db_connection: MySQLConnection = self.__mysql.connect()
        db_cursor: MySQLCursor = db_connection.cursor()
        hashedPassword: str = bcrypt.hashpw(self.senha.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
        try:
            db_connection.start_transaction()
            self.dados_usuario.inserir_dados_usuario(
                SQL_CRIAR_USUARIO, 
                (self.email, hashedPassword, self.admin),
                db_cursor
            )
            db_connection.commit()
        except IntegrityError as ie:
            db_connection.rollback()
            raise IntegrityError(f"Erro de integridade ao criar o usuário: {ie}")
        except DatabaseError as de:
            db_connection.rollback()
            raise DatabaseError(f"Erro de banco de dados ao criar o usuário: {de}")
        except Exception as error:
            db_connection.rollback()
            raise Exception(f"Erro ao criar o usuário: {error}")
        finally:
            self.__mysql.close_cursor_and_connection(db_cursor, db_connection)
    
    
    def login(self) -> str:
        db_connection: MySQLConnection = self.__mysql.connect()
        db_cursor: MySQLCursor = db_connection.cursor(dictionary=True)
        
        resultado: dict = self.__mysql.fetch_one(SQL_LOGIN_USUARIO, (self.email,), db_cursor)
          
        self.__mysql.close_cursor_and_connection(db_cursor, db_connection)  
            
        if not resultado:
            raise ValueError("Usuário não encontrado ou dados inválidos")
            
        validacao: bool = self.__validators_schema.validate_password(
            senha_usuario=self.senha, 
            senha_banco_de_dados=resultado["senha"]
        )
            
        if not validacao:
            raise ValueError("Senha inválida")
        
        token_de_acesso: str = Middleware.create_access_jwt(
            id_usuario=resultado["id_usuario"], email_usuario=self.email,
            nome_usuario=resultado["nome_usuario"], is_admin=resultado["admin"],
            telefone=resultado["telefone"], endereco=resultado["endereco"]
        )
            
        return token_de_acesso
    
    
    def requisitar_token_troca_de_senha(self) -> None:
        db_connection: MySQLConnection = self.__mysql.connect()
        db_cursor: MySQLCursor = db_connection.cursor()
        
        token_de_troca_da_senha: str = secrets.token_urlsafe(8)
        tempo_de_validade: str = datetime.now().isoformat()
        
        try:
            db_connection.start_transaction()
            db_cursor.execute(
                SQL_ATUALIZAR_TOKEN, 
                (token_de_troca_da_senha, tempo_de_validade, self.email)
            )
            db_connection.commit()
        except DatabaseError as de:
            db_connection.rollback()
            raise DatabaseError(f"Erro ao atualizar token no banco de dados: {de}")
        except Exception as error:
            db_connection.rollback()
            raise Exception(f"Erro ao redefinir senha {error}")
        finally:
            self.__mysql.close_cursor_and_connection(db_cursor, db_connection)  
        
        self.__email_service.send_email_forgot_password(
            send_email=self.email, 
            subject="Aviso de redefinição de senha",
            message="Você solicitou uma redefinição de senha. Seu token de redefinição é:" ,
            token=token_de_troca_da_senha
        )
       
        
    def redefinir_senha(self, token: str) -> None:
        db_connection: MySQLConnection = self.__mysql.connect()
        db_cursor: MySQLCursor = db_connection.cursor()
        
        try:
            db_connection.start_transaction()
            
            self.__validators_schema.validate_validade_e_token(self.email, token, self.__mysql, db_connection, db_cursor)
            hashedPassword: str = bcrypt.hashpw(self.senha.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            db_cursor.execute(SQL_REDEFINIR_SENHA, (hashedPassword, self.email))
            db_connection.commit()
        except IntegrityError as ie:
            db_connection.rollback()
            raise IntegrityError(f"Erro de integridade ao redefinir a senha: {ie}")
        except DatabaseError as de:
            db_connection.rollback()
            raise DatabaseError(f"Erro ao redefinir senha no banco de dados: {de}")
        except Exception as error:
            db_connection.rollback()
            raise Exception(f"Erro ao redefinir senha {error}")
        finally:
            self.__mysql.close_cursor_and_connection(db_cursor, db_connection) 
    
    
    def __str__(self):
        return (
            "UsuarioController("
            f"dados_usuario='{self.dados_usuario}', "
            f"email='{self.email}', "
            f"senha='{self.senha}', "
            f"admin='{self.admin}'"
            ")"
        )