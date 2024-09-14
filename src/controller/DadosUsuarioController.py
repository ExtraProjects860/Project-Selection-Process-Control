from src.model.DadosUsuarioModel import DadosUsuarioModel
from src.config.MysqlService import MySQLService

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
        
    # falta implementar
    def atualizar_dados_usuario(self, comandoSQL_dados_usuario: str, valores_dados_usuario: tuple) -> None:
        pass
    
    
    def subir_e_salvar_curriculo(self) -> None:
        pass
