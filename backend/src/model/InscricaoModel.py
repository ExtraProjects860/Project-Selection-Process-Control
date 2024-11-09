from typing import Optional
from pydantic import BaseModel, Field
from abc import ABC

class InscricaoModel(BaseModel, ABC):
    id_usuario: Optional[int] = Field(..., description="Id do usuário", alias='_id_usuario')
    id_vaga: Optional[int] = Field(..., description="Id da vaga", alias='_id_vaga')
    
    class Config:
        from_attributes: bool = True
        arbitrary_types_allowed: bool = True
        populate_by_name: bool = True