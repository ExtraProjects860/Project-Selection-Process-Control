from pydantic import BaseModel, Field
from typing import Optional
from abc import ABC

class VagaModel(BaseModel, ABC):
    nome_vaga: Optional[str] = Field(..., description="Nome da vaga", alias='_nome_vaga')
    descricao_vaga: Optional[str] = Field(..., description="Descricão da vaga", alias='_descricao_vaga')
    status: Optional[str] = Field(..., description="Status da vaga", alias='_status')
    salario: Optional[float] = Field(..., description="Salaírio da vaga", alias='_salario')
    quantidade_vagas: Optional[int] = Field(..., description="Quantidade de vagas", alias='_quantidade_vagas')
    data_encerramento: Optional[str] = Field(..., description="Data de encerramento da vaga", alias='_data_encerramento')

    class Config:
        from_attributes: bool = True
        arbitrary_types_allowed: bool = True
        populate_by_name: bool = True