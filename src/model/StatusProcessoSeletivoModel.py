from pydantic import BaseModel, Field
from typing import Optional

class StatusProcessoSeletivoModel(BaseModel):
    data_entrevista: Optional[str] = Field(..., description="Data da entrevista")
    data_conclusao: Optional[str] = Field(..., description="Data da conclusão")
    status_processo: Optional[str] = Field(..., description="Status do processo seletivo")
    perfil: Optional[str] = Field(..., description="Perfil do candidato")
    observacao: Optional[str] = Field(..., description="Observação")
    forms_respondido: Optional[bool] = Field(..., description="Se o formulário foi respondido pelo candidato")
    avaliacao_forms: Optional[str] = Field(..., description="Avaliação do formulário do candidato")
    
    class Config:
        from_attributes = True
        arbitrary_types_allowed = True