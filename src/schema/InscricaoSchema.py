from pydantic import BaseModel
from typing import Optional


class PegarInscricoes(BaseModel):
    id_inscricao: Optional[int]
    id_vaga: Optional[int]
    id_status_processo_seletivo: Optional[int]
    nome_vaga: Optional[str]
    nome_cargo: Optional[str]
    nome_setor: Optional[str]
    descricao_vaga: Optional[str]
    status: Optional[str]
    salario: Optional[float]
    quantidade_vagas: Optional[int]
    data_encerramento: Optional[str]
    data_entrevista: Optional[str]
    status_processo: Optional[str]
    observacao: Optional[str]
    nome_etapa: Optional[str]
    link_forms: Optional[str]
    forms_respondido: Optional[int]
