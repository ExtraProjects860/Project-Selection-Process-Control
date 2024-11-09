import bcrypt
from src.model.DadosUsuarioModel import DadosUsuarioModel
from src.config.MysqlService import MySQLService
from mysql.connector import IntegrityError, DatabaseError, MySQLConnection
from mysql.connector.cursor import MySQLCursor
from src.controller.sql_dados_usuario.comandos_sql import (
    SQL_INSERIR_DADOS_USUARIO,
    SQL_ATUALIZAR_EMAIL_SENHA_USUARIO,
    SQL_ATUALIZAR_DADOS_USUARIO,
    SQL_ATUALIZAR_EMAIL_USUARIO
)

class DadosUsuarioController(DadosUsuarioModel):
    """
    Controller responsável por gerenciar as operações relacionadas aos dados do usuário.

    Esta classe herda de `DadosUsuarioModel` e fornece métodos para inserir e atualizar 
    informações dos usuários no banco de dados MySQL. Ela utiliza o serviço `MySQLService` 
    para gerenciar conexões e executar comandos SQL. Além disso, lida com o hashing de 
    senhas utilizando a biblioteca `bcrypt` para garantir a segurança das informações.

    Atributos:
    ----------
    nome_usuario : str
        O nome completo do usuário. (protected)
    cpf : str
        O CPF do usuário. (protected)
    telefone : str
        O telefone de contato do usuário. (protected)
    endereco : str
        O endereço residencial do usuário. (protected)
    dataNascimento : str
        A data de nascimento do usuário. (protected)
    sexo : str
        O sexo do usuário. (protected)
    curriculo : str
        O caminho para o arquivo do currículo do usuário. (protected)
    __mysql : MySQLService
        Instância do serviço `MySQLService` para gerenciar conexões e operações no banco de dados. (private)

    Métodos:
    --------
    inserir_dados_usuario(comandoSQL_usuario: str, valores_usuario: tuple, db_cursor: MySQLCursor) -> None: (public)
        Insere os dados do usuário no banco de dados utilizando o cursor fornecido.

    atualizar_dados_usuario(id_usuario: int, new_email: str, new_password: str) -> None: (public)
        Atualiza o email e a senha do usuário especificado no banco de dados.
    """
    
    def __init__(self, nome_usuario: str, cpf: str, telefone: str, endereco: str, dataNascimento: str, sexo: str, curriculo: str):
        super().__init__(
            _nome_usuario=nome_usuario, _cpf=cpf, 
            _telefone=telefone, _endereco=endereco, 
            _dataNascimento=dataNascimento, _sexo=sexo, 
            _curriculo=curriculo
        )
        self.__mysql: MySQLService = MySQLService()
                 
                 
    def inserir_dados_usuario(self, SQL_CRIAR_USUARIO: str, valores_usuario: tuple, db_cursor: MySQLCursor) -> None:
        db_cursor.execute(SQL_CRIAR_USUARIO, valores_usuario)
        id_usuario: int = self.__mysql.lastrowid(db_cursor)
        
        if id_usuario is None:
            raise Exception("ID do usuário não foi gerado, verifique a inserção na tabela de usuários.")
            
        db_cursor.execute(
            SQL_INSERIR_DADOS_USUARIO, 
            (id_usuario, self.nome_usuario, self.curriculo, self.cpf, self.telefone, self.endereco, self.dataNascimento, self.sexo)
        )
        
        
    def atualizar_dados_usuario(self, id_usuario: int, new_email: str, new_password: str) -> None:
        db_connection: MySQLConnection = self.__mysql.connect()
        db_cursor: MySQLCursor = db_connection.cursor()
        
        try:
            db_connection.start_transaction()
            
            if new_password:
                hashedPassword: str = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                sql_update: str = SQL_ATUALIZAR_EMAIL_SENHA_USUARIO
                params: tuple = (new_email, hashedPassword, id_usuario)
            else:
                sql_update: str = SQL_ATUALIZAR_EMAIL_USUARIO
                params: tuple = (new_email, id_usuario)
            
            db_cursor.execute(sql_update, params)
            
            db_cursor.execute(SQL_ATUALIZAR_DADOS_USUARIO, (self.telefone, self.endereco, id_usuario),)
            
            db_connection.commit()
        except IntegrityError as ie:
            db_connection.rollback()
            raise IntegrityError(f"Erro de integridade ao atualizar os dados do usuário: {ie}")
        except DatabaseError as de:
            db_connection.rollback()
            raise DatabaseError(f"Erro de banco de dados ao atualizar os dados do usuário: {de}")
        except Exception as error:
            db_connection.rollback()
            raise Exception(f"Erro ao atualizar os dados do usuário: {error}")
        finally:
            self.__mysql.close_cursor_and_connection(db_cursor, db_connection)
            
    
    def __str__(self):
        return (
            "DadosUsuarioController("
            f"nome_usuario='{self.nome_usuario}', "
            f"cpf='{self.cpf}', "
            f"telefone='{self.telefone}', "
            f"endereco='{self.endereco}', "
            f"dataNascimento='{self.dataNascimento}', "
            f"sexo='{self.sexo}', "
            f"curriculo='{self.curriculo}'"
            ")"
        )