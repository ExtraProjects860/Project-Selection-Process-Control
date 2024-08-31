import bcrypt
from model.UsuarioModel import UsuarioModel
from config.MysqlService import MySQLService
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
            
        valores_usuario: tuple = (self.email, hashedPassword, self.admin)
            
        try:
            mysql.begin_transaction()
            
            self.dados_usuario.inserir_dados_usuario(
                comandoSQL_usuario, 
                valores_usuario,
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
        
        resultado: tuple = mysql.fetch_all(comandoSQL_login, (self.email,))
            
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