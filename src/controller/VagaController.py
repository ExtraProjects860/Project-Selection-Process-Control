from src.config.MysqlService import MySQLService
from src.model.VagaModel import VagaModel
from mysql.connector import DatabaseError, IntegrityError

class VagaController(VagaModel):
    
    def __init__(self, nome_vaga: str, descricao_vaga: str, status: str, salario: float, quantidade_vagas: int, data_encerramento: str):
        super().__init__(
            nome_vaga=nome_vaga, descricao_vaga=descricao_vaga, 
            status=status, salario=salario, 
            quantidade_vagas=quantidade_vagas, data_encerramento=data_encerramento
        )
        
   
    def pegar_setores_cargos(self) -> tuple[list, list]:
        mysql: MySQLService = MySQLService()
        comandoSQL_setor: str = """
            SELECT nome_setor
            FROM setor;
        """
        
        comandoSQL_cargo: str = """
            SELECT nome_cargo
            FROM cargo;
        """
        
        setores_raw: list[list[str]] = mysql.fetch_all(comandoSQL_setor)
        cargos_raw: list[list[str]] = mysql.fetch_all(comandoSQL_cargo)
        
        setores: list[str] = [setor[0] for setor in setores_raw]
        cargos: list[str] = [cargo[0] for cargo in cargos_raw]
        
        mysql.close_cursor()
        mysql.close_connection()
        
        return setores, cargos
    
        
    def buscar_setor_cargo(self, nome_setor: str, nome_cargo: str, mysql: MySQLService) -> int:
        comandoSQL_setor: str = """
            SELECT id_setor
            FROM setor
            WHERE nome_setor = %s;
        """
        
        comandoSQL_cargo: str = """
            SELECT id_cargo
            FROM cargo
            WHERE nome_cargo = %s;
        """
        
        resultado_setor: tuple = mysql.fetch_one(comandoSQL_setor, (nome_setor,))
        resultado_cargo: tuple = mysql.fetch_one(comandoSQL_cargo, (nome_cargo,))
        
        if not resultado_setor or not resultado_cargo:
            raise ValueError("Setor ou cargo não encontrado")
        
        return resultado_setor[0], resultado_cargo[0]
    
    
    def pegar_todas_vagas(self) -> list:
        mysql: MySQLService = MySQLService()
        comandoSQL_vaga: str = """
            SELECT v.id_vaga, v.nome_vaga, c.nome_cargo, s.nome_setor, v.descricao_vaga, v.status, v.salario, v.quantidade_vagas, v.data_encerramento 
            FROM vaga v
            INNER JOIN setor s ON v.id_setor = s.id_setor
            INNER JOIN cargo c ON v.id_cargo = c.id_cargo;
        """
        
        resultado: list = mysql.fetch_all(comandoSQL_vaga)
        mysql.close_cursor()
        mysql.close_connection()
        
        return resultado
    
    
    def criar_vaga(self, setor: str, cargo: str) -> None:
        mysql: MySQLService = MySQLService()
        comandoSQL_vaga: str = """
            INSERT INTO vaga (id_setor, id_cargo, nome_vaga, descricao_vaga, status, salario, quantidade_vagas, data_encerramento)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
        """
        
        try:
            mysql.begin_transaction()
            
            id_setor, id_cargo = self.buscar_setor_cargo(setor, cargo, mysql)
            
            mysql.execute_query(
                comandoSQL_vaga, 
                (id_setor, id_cargo, self.nome_vaga, self.descricao_vaga, self.status, self.salario, self.quantidade_vagas, self.data_encerramento)
            )
            
            mysql.commit()
        except IntegrityError as ie:
            mysql.rollback()
            raise IntegrityError(f"Erro de integridade ao criar a vaga: {ie}")
        except DatabaseError as de:
            mysql.rollback()
            raise DatabaseError(f"Erro de banco de dados ao criar a vaga: {de}")
        except Exception as error:
            mysql.rollback()
            raise Exception(f"Erro ao criar a vaga: {error}")
        finally:
            mysql.close_cursor()
            mysql.close_connection()
            
    
    def atualizar_vaga(self, id_vaga: int) -> None:
        mysql: MySQLService = MySQLService()
        comandoSQL_vaga: str = """
            UPDATE vaga
            SET nome_vaga = %s, descricao_vaga = %s, salario = %s, quantidade_vagas = %s, data_encerramento = %s
            WHERE id_vaga = %s;
        """
        
        try:
            mysql.begin_transaction()
            
            mysql.execute_query(
                comandoSQL_vaga, 
                (self.nome_vaga, self.descricao_vaga, self.salario, self.quantidade_vagas, self.data_encerramento, id_vaga)
            )
            
            mysql.commit()
        except DatabaseError as de:
            mysql.rollback()
            raise DatabaseError(f"Erro de banco de dados ao atualizar a vaga: {de}")
        except Exception as error:
            mysql.rollback()
            raise Exception(f"Erro ao atualizar a vaga: {error}")
        finally:
            mysql.close_cursor()
            mysql.close_connection()
            
    
    def atualizar_status_vaga(self, id_vaga: int) -> None:
        mysql: MySQLService = MySQLService()
        comandoSQL_vaga: str = """
            UPDATE vaga
            SET status = %s
            WHERE id_vaga = %s;
        """
        
        try:
            mysql.begin_transaction()
            
            mysql.execute_query(comandoSQL_vaga, (self.status, id_vaga,)
            )
            
            mysql.commit()
        except DatabaseError as de:
            mysql.rollback()
            raise DatabaseError(f"Erro de banco de dados ao atualizar a vaga: {de}")
        except Exception as error:
            mysql.rollback()
            raise Exception(f"Erro ao atualizar a vaga: {error}")
        finally:
            mysql.close_cursor()
            mysql.close_connection()
            
    
            