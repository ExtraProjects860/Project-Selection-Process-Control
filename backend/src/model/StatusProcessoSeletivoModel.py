from pydantic import BaseModel, Field
from typing import Optional
from abc import ABC

class StatusProcessoSeletivoModel(BaseModel, ABC):
    data_entrevista: Optional[str] = Field(..., description="Data da entrevista", alias='_data_entrevista')
    data_conclusao: Optional[str] = Field(..., description="Data da conclusão", alias='_data_conclusao')
    status_processo: Optional[str] = Field(..., description="Status do processo seletivo", alias='_status_processo')
    perfil: Optional[str] = Field(..., description="Perfil do candidato", alias='_perfil')
    observacao: Optional[str] = Field(..., description="Observação", alias='_observacao')
    forms_respondido: Optional[bool] = Field(..., description="Se o formulário foi respondido pelo candidato", alias='_forms_respondido')
    avaliacao_forms: Optional[str] = Field(..., description="Avaliação do formulário do candidato", alias='_avaliacao_forms')
    
    class Config:
        from_attributes: bool = True
        arbitrary_types_allowed: bool = True
        populate_by_name: bool = True