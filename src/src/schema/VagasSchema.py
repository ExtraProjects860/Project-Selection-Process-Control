from pydantic import BaseModel
from typing import Optional


class PegarVagas(BaseModel):
    id_vaga: Optional[int]
    nome_vaga: Optional[str]
    nome_cargo: Optional[str]
    nome_setor: Optional[str]
    descricao_vaga: Optional[str]
    status: Optional[str]
    salario: Optional[float]
    quantidade_vagas: Optional[int]
    data_abertura: Optional[str]
    data_encerramento: Optional[str]
    