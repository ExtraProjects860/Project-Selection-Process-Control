from pydantic import BaseModel, Field
from typing import Optional

class VagaModel(BaseModel):
    nome_vaga: Optional[str] = Field(..., description="Nome da vaga")
    descricao_vaga: Optional[str] = Field(..., description="Descricão da vaga")
    status: Optional[str] = Field(..., description="Status da vaga")
    salario: Optional[float] = Field(..., description="Salaírio da vaga")
    quantidade_vagas: Optional[int] = Field(..., description="Quantidade de vagas")
    data_encerramento: Optional[str] = Field(..., description="Data de encerramento da vaga")

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True