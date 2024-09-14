from typing import Optional
from pydantic import BaseModel, Field

class InscricaoModel(BaseModel):
    id_usuario: Optional[int] = Field(..., description="Id do usuário")
    id_vaga: Optional[int] = Field(..., description="Id da vaga")
    
    class Config:
        from_attributes = True
        arbitrary_types_allowed = True