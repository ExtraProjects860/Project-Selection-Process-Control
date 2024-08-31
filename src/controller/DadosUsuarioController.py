from model.DadosUsuarioModel import DadosUsuarioModel
from config.MysqlService import MySQLService

mysql: MySQLService = MySQLService()

class DadosUsuarioController(DadosUsuarioModel):
    
    def __init__(self, nome: str, cpf: str, telefone: str, endereco: str, dataNascimento: str, sexo: str, curriculo: str):
        super().__init__(
            nome=nome, 
            cpf=cpf, 
            telefone=telefone, 
            endereco=endereco, 
            dataNascimento=dataNascimento, 
            sexo=sexo, 
            curriculo=curriculo
        )
                 
                 
    def inserir_dados_usuario(self, comandoSQL_usuario: str, valores_usuario: tuple) -> None:
        mysql.execute_query(comandoSQL_usuario, valores_usuario)
        id_usuario = mysql.lastrowid()
        
        comandoSQL_dados_usuario: str = f"""
            INSERT INTO dados_usuario (id_dados_usuario, nome, curriculo, cpf, telefone, endereco, data_nascimento, sexo) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
        """
        
        valores_dados_usuario: tuple = (id_usuario, self.nome, self.curriculo, self.cpf, self.telefone, self.endereco, self.dataNascimento, self.sexo)
            
        mysql.execute_query(comandoSQL_dados_usuario, valores_dados_usuario)
        
    # falta implementar
    def atualizar_dados_usuario(self, comandoSQL_dados_usuario: str, valores_dados_usuario: tuple) -> None:
        pass
