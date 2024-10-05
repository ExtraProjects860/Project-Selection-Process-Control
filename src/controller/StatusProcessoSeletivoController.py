from src.model.StatusProcessoSeletivoModel import StatusProcessoSeletivoModel
from mysql.connector import DatabaseError, IntegrityError
from src.config.MysqlService import MySQLService
from src.util.EmailService import EmailService


class StatusProcessoSeletivoController(StatusProcessoSeletivoModel):
    
    def __init__(self, data_entrevista: str, data_conclusao: str, status_processo: str, perfil: str, observacao: str, forms_respondido: bool, avaliacao_forms: str):
        super().__init__(
            data_entrevista=data_entrevista, data_conclusao=data_conclusao, 
            status_processo=status_processo, perfil=perfil, observacao=observacao, 
            forms_respondido=forms_respondido, avaliacao_forms=avaliacao_forms
        )
    
    
    def pegar_vagas_etapas(self) -> tuple[list, list]:
        mysql: MySQLService = MySQLService()
        comandoSQL_vaga: str = """
            SELECT nome_vaga
            FROM vaga;
        """
        
        comandoSQL_etapa: str = """
            SELECT nome_etapa
            FROM etapa;
        """
        
        vagas_raw: list[list[str]] = mysql.fetch_all(comandoSQL_vaga)
        etapa_raw: list[list[str]] = mysql.fetch_all(comandoSQL_etapa)
        
        vagas: list[str] = [vaga[0] for vaga in vagas_raw]
        etapas: list[str] = [etapa[0] for etapa in etapa_raw]
        
        mysql.close_cursor()
        mysql.close_connection()
        
        return vagas, etapas
    
    
    def buscar_vaga_etapa(self, mysql: MySQLService, nome_vaga: str, nome_etapa: str) -> tuple[int, int]:
        comandoSQL_vaga: str = """
            SELECT id_vaga
            FROM vaga
            WHERE nome_vaga = %s;
        """
        
        comandoSQL_etapa: str = """
            SELECT id_etapa
            FROM etapa
            WHERE nome_etapa = %s;
        """
        
        resultado_vaga: tuple = mysql.fetch_one(comandoSQL_vaga, (nome_vaga,))
        resultado_etapa: tuple = mysql.fetch_one(comandoSQL_etapa, (nome_etapa,))
        
        if not resultado_vaga or not resultado_etapa:
            raise ValueError("Vaga ou etapa não encontrado")
        
        return resultado_vaga[0], resultado_etapa[0]
    
    
    def pegar_todos_status_processo_seletivo(self) -> list:
        mysql: MySQLService = MySQLService()
        comandoSQL_status_processo_seletivo: str = """
            SELECT sps.data_entrevista, sps.data_conclusao, du.nome_usuario, du.telefone, u.email, c.nome_cargo, e.nome_etapa, s.nome_setor, sps.perfil, sps.status_processo, sps.observacao
            FROM status_processo_seletivo sps
            INNER JOIN etapa e ON sps.id_etapa = e.id_etapa
            INNER JOIN vaga v ON sps.id_vaga = v.id_vaga
            INNER JOIN setor s ON v.id_setor = s.id_setor
            INNER JOIN cargo c ON v.id_cargo = c.id_cargo
            INNER JOIN inscricao i ON v.id_vaga = i.id_vaga
            INNER JOIN usuario u ON i.id_usuario = u.id_usuario
            INNER JOIN dados_usuario du ON i.id_usuario = du.id_dados_usuario;
        """
        
        resultado: list = mysql.fetch_all(comandoSQL_status_processo_seletivo)
        mysql.close_cursor()
        mysql.close_connection()
        
        return resultado
    
    def pegar_todos_usuarios(self) -> list:
        mysql: MySQLService = MySQLService()
        comandoSQL_usuarios: str = """
            SELECT u.id_usuario, u.email, u.admin, u.data_criacao, du.nome_usuario, du.cpf, du.telefone, du.endereco, du.data_nascimento, du.sexo,
                CASE
                    WHEN COUNT(i.id_usuario) > 0 THEN 'Sim'
                    ELSE 'Não'
                END AS tem_inscricao
            FROM dados_usuario du
            INNER JOIN usuario u ON du.id_dados_usuario = u.id_usuario
            LEFT JOIN inscricao i ON u.id_usuario = i.id_usuario
            GROUP BY u.id_usuario;
        """
        
        resultado: list = mysql.fetch_all(comandoSQL_usuarios)
        mysql.close_cursor()
        mysql.close_connection()
        
        return resultado
    
    
    def salvar_status_processo_seletivo(self, vaga: str, etapa: str) -> None:
        mysql: MySQLService = MySQLService()
        comandoSQL_status_processo_seletivo: str = """
            INSERT INTO status_processo_seletivo (id_vaga, id_etapa, data_entrevista, data_conclusao, status_processo, perfil, observacao, forms_respondido, avaliacao_forms)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
        """
        
        try:
            mysql.begin_transaction()
            
            id_vaga, id_etapa = self.buscar_vaga_etapa(mysql, vaga, etapa)
            
            mysql.execute_query(
                comandoSQL_status_processo_seletivo, 
                (id_vaga, id_etapa, self.data_entrevista, self.data_conclusao, self.status_processo, self.perfil, self.observacao, self.forms_respondido, self.avaliacao_forms)
            )
            
            mysql.commit()
        except IntegrityError as ie:
            mysql.rollback()
            raise IntegrityError(f"Erro de integridade ao salvar o status do processo seletivo: {ie}")
        except DatabaseError as de:
            mysql.rollback()
            raise DatabaseError(f"Erro de banco de dados ao salvar o status do processo seletivo: {de}")
        except Exception as error:
            mysql.rollback()
            raise Exception(f"Erro ao salvar o status do processo seletivo: {error}")
        finally:
            mysql.close_cursor()
            mysql.close_connection()
        
    
    def atualizar_status_processo_seletivo(self, id_status_processo_seletivo: int) -> None:
        mysql: MySQLService = MySQLService()
        comandoSQL_status_processo_seletivo: str = """
            UPDATE status_processo_seletivo
            SET data_entrevista = %s, data_conclusao = %s, status_processo = %s, perfil = %s, observacao = %s, forms_respondido = %s, avaliacao_forms = %s
            WHERE id_status_processo_seletivo = %s;
        """
        
        try:
            mysql.begin_transaction()
            
            mysql.execute_query(
                comandoSQL_status_processo_seletivo, 
                (self.data_entrevista, self.data_conclusao, self.status_processo, self.perfil, self.observacao, self.forms_respondido, self.avaliacao_forms, id_status_processo_seletivo)
            )
            
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
    
    
    def enviar_email_com_base_no_status(self, nome_usuario: str, email_usuario: str) -> None:
        assunto_status: dict[str, str] = {
            "ATIVO": "Olá e boa sorte no seu processo seletivo!",
            "CONCLUÍDO": "Parabéns, seu processo seletivo foi concluído com sucesso!",
            "BANCO DE TALENTOS": "Parabéns! Você foi selecionado para o processo seletivo pelo banco de talentos!",
            "DESISTÊNCIA": "Lamentamos informar que seu processo seletivo foi marcado como desistência.",
            "REPROVAÇÃO": "Infelizmente, você não foi aprovado no processo seletivo.",
            "ENCERRADO": "Seu processo seletivo foi encerrado. Obrigado pela participação!"
        }

        if self.status_processo not in assunto_status:
            raise ValueError(f"Status do processo seletivo inválido: {self.status_processo}")

        assunto: str = assunto_status[self.status_processo]

        mensagem_corpo: str = f"O status do seu processo seletivo mudou para {self.status_processo}!"

        EmailService().send_email_informing_user_status_selection_process(
            send_email=email_usuario, subject=assunto, name_user=nome_usuario, message=mensagem_corpo 
        )