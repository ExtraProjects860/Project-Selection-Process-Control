import bcrypt
from src.model.DadosUsuarioModel import DadosUsuarioModel
from src.config.MysqlService import MySQLService
from mysql.connector.errors import IntegrityError, DatabaseError

class DadosUsuarioController(DadosUsuarioModel):
    
    def __init__(self, nome_usuario: str, cpf: str, telefone: str, endereco: str, dataNascimento: str, sexo: str, curriculo: str):
        super().__init__(
            nome_usuario=nome_usuario, cpf=cpf, 
            telefone=telefone, endereco=endereco, 
            dataNascimento=dataNascimento, sexo=sexo, 
            curriculo=curriculo
        )
                 
                 
    def inserir_dados_usuario(self, comandoSQL_usuario: str, valores_usuario: tuple, mysql: MySQLService) -> None:
        mysql.execute_query(comandoSQL_usuario, valores_usuario)
        id_usuario = mysql.lastrowid()
        
        comandoSQL_dados_usuario: str = f"""
            INSERT INTO dados_usuario (id_dados_usuario, nome_usuario, curriculo, cpf, telefone, endereco, data_nascimento, sexo) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
        """
            
        mysql.execute_query(
            comandoSQL_dados_usuario, 
            (id_usuario, self.nome_usuario, self.curriculo, self.cpf, self.telefone, self.endereco, self.dataNascimento, self.sexo)
        )
        
        
    def atualizar_dados_usuario(self, id_usuario: int, new_email: str, new_password: str) -> None:
        mysql: MySQLService = MySQLService()
        comandoSQL_email_senha_usuario: str = """
            UPDATE usuario
            SET email = %s, senha = %s
            WHERE id_usuario = %s;
        """
        
        comandoSQL_dados_usuario: str = """
            UPDATE dados_usuario
            SET telefone = %s, endereco = %s
            WHERE id_dados_usuario = %s;
        """
        try:
            mysql.begin_transaction()
            
            hashedPassword: str = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            mysql.execute_query(
                comandoSQL_email_senha_usuario, 
                (new_email, hashedPassword, id_usuario)
            )
            
            mysql.execute_query(
                comandoSQL_dados_usuario, 
                (self.telefone, self.endereco, id_usuario)
            )
            
            mysql.commit()
        except IntegrityError as ie:
            mysql.rollback()
            raise IntegrityError(f"Erro de integridade ao atualizar os dados do usuário: {ie}")
        except DatabaseError as de:
            mysql.rollback()
            raise DatabaseError(f"Erro de banco de dados ao atualizar os dados do usuário: {de}")
        except Exception as error:
            mysql.rollback()
            raise Exception(f"Erro ao atualizar os dados do usuário: {error}")
        finally:
            mysql.close_cursor()
            mysql.close_connection()