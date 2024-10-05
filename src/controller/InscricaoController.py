import re
from mysql.connector.errors import DatabaseError, IntegrityError
from src.model.InscricaoModel import InscricaoModel
from src.config.MysqlService import MySQLService
from src.util.EmailService import EmailService

class InscricaoController(InscricaoModel):
    
    def __init__(self, id_usuario: int, id_vaga: int):
        super().__init__(
            id_usuario=id_usuario, id_vaga=id_vaga
        )
    
    
    def excluir_curriculo(self) -> None:
        mysql: MySQLService = MySQLService()
        comandoSQL_excluir_curriculo: str = """
            UPDATE dados_usuario
            SET curriculo = NULL
            WHERE id_dados_usuario = %s;
        """
        
        try:
            mysql.begin_transaction()
            mysql.execute_query(comandoSQL_excluir_curriculo, (self.id_usuario,))
            mysql.commit()
        except DatabaseError as de:
            mysql.rollback()
            raise DatabaseError(f"Erro de banco de dados ao excluir o curriculo: {de}")
        except Exception as error:
            mysql.rollback()
            raise Exception(f"Erro ao excluir o curriculo: {error}")
        finally:
            mysql.close_cursor()
            mysql.close_connection()
    
         
    def pegar_curriculo(self) -> str:
        mysql: MySQLService = MySQLService()
        comandoSQL_curriculo: str = """
            SELECT curriculo
            FROM dados_usuario
            WHERE id_dados_usuario = %s;
        """
        
        try:
            mysql.begin_transaction()
            resultado = mysql.fetch_one(comandoSQL_curriculo, (self.id_usuario,))
            mysql.commit()
            
            return resultado[0]
        except DatabaseError as de:
            mysql.rollback()
            raise DatabaseError(f"Erro de banco de dados ao pegar o curriculo: {de}")
        except Exception as error:
            mysql.rollback()
            raise Exception(f"Erro ao pegar o curriculo: {error}")
        finally:
            mysql.close_cursor()
            mysql.close_connection()
    
    
    def tratar_nome_curriculo(self, nome_usuario: str) -> str:
        nome_usuario_sanitizado: str = re.sub(r'[^\w\s]', '', nome_usuario)  # Remover caracteres especiais
        nome_arquivo: str = f"{nome_usuario_sanitizado}_{self.id_usuario}_curriculo.pdf"
        return nome_arquivo
    
    
    def subir_curriculo(self, mysql: MySQLService, nome_arquivo: str) -> None:
        comandoSQL_curriculo: str = """
            UPDATE dados_usuario
            SET curriculo = %s
            WHERE id_dados_usuario = %s;
        """
        
        mysql.execute_query(comandoSQL_curriculo, (nome_arquivo, self.id_usuario),)
        
    
    def salvar_inscricao_curriculo(self, nome_arquivo: str) -> None:
        mysql: MySQLService = MySQLService()
        comandoSQL_inscricao: str = """
            INSERT INTO inscricao (id_usuario, id_vaga)
            VALUES (%s, %s);
        """
        
        try:
            mysql.begin_transaction()
            
            mysql.execute_query(comandoSQL_inscricao, (self.id_usuario, self.id_vaga),)
            self.subir_curriculo(mysql, nome_arquivo)
            
            mysql.commit()
        except IntegrityError as ie:
            mysql.rollback()
            raise IntegrityError(f"Erro de integridade ao salvar a inscricao: {ie}")
        except DatabaseError as de:
            mysql.rollback()
            raise DatabaseError(f"Erro de banco de dados ao salvar a inscricao: {de}")
        except Exception as error:
            mysql.rollback()
            raise Exception(f"Erro ao salvar a inscricao: {error}")
        finally:
            mysql.close_cursor()
            mysql.close_connection()
            
    
    def enviar_email_informando_inscricao_usuario_para_admin(self, id_usuario: int) -> None:
        mysql: MySQLService = MySQLService()
        comandoSQL_buscar_usuario: str = """
            SELECT du.nome_usuario, du.telefone, u.email
            FROM dados_usuario du
            INNER JOIN usuario u ON du.id_dados_usuario = u.id_usuario
            WHERE u.id_usuario = %s;
        """
        
        resultado: tuple = mysql.fetch_one(comandoSQL_buscar_usuario, (id_usuario,))
        mysql.close_cursor()
        mysql.close_connection()
        
        EmailService().send_email_informing_user_registration_to_admin(
            send_email=resultado[2],
            phone_number=resultado[1],
            name_user=resultado[0],
            subject="Inscrição de um usuário foi concluída!",
            message=f"A inscrição de {resultado[0]} foi concluída! Para continuar o processo seletivo do usuário, verique no site na parte status da inscrição."
        )
    
    
    def mostrar_inscricoes_usuario(self) -> list:
        mysql: MySQLService = MySQLService()
        comandoSQL_inscricoes: str = """
            SELECT v.id_vaga, sps.id_status_processo_seletivo, v.nome_vaga, c.nome_cargo, s.nome_setor, v.descricao_vaga, v.status, v.salario, v.quantidade_vagas, v.data_encerramento, sps.data_entrevista, sps.status_processo, sps.observacao, e.nome_etapa
            FROM inscricao i
            INNER JOIN vaga v ON i.id_vaga = v.id_vaga
            INNER JOIN status_processo_seletivo sps ON v.id_vaga = sps.id_vaga
            INNER JOIN etapa e ON sps.id_etapa = e.id_etapa
            INNER JOIN setor s ON v.id_setor = s.id_setor 
            INNER JOIN cargo c ON v.id_cargo = c.id_cargo
            INNER JOIN links_forms l ON c.nome_cargo = l.nome_cargo
            WHERE i.id_usuario = %s;
        """
        
        resultado: list = mysql.fetch_all(comandoSQL_inscricoes, (self.id_usuario,))
        mysql.close_cursor()
        mysql.close_connection()
        
        return resultado
    
    
    def atualizar_forms_como_preenchido(self, id_status_processo_seletivo: int) -> None:
        mysql: MySQLService = MySQLService()
        comandoSQL_marcar_concluido_forms: str = """
            UPDATE status_processo_seletivo
            SET forms_preenchidos = 1
            WHERE id_status_processo_seletivo = %s;
        """
        
        try:
            mysql.begin_transaction()
            
            mysql.execute_query(comandoSQL_marcar_concluido_forms, (id_status_processo_seletivo,))
            
            mysql.commit()
        except IntegrityError as ie:
            mysql.rollback()
            raise IntegrityError(f"Erro de integridade ao atualizar o status do processo seletivo: {ie}")
        except DatabaseError as de:
            mysql.rollback()
            raise DatabaseError(f"Erro de banco de dados ao atualizar o status do processo seletivo: {de}")
        except Exception as error:
            mysql.rollback()
            raise Exception(f"Erro ao atualizar o status do processo seletivo: {error}")
        finally:
            mysql.close_cursor()
            mysql.close_connection()