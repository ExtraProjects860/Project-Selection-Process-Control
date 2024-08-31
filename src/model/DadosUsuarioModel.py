from pydantic import BaseModel, Field
from typing import Optional

class DadosUsuarioModel(BaseModel):
    nome: str = Field(..., description="Nome do usuário")
    curriculo: Optional[str] = Field(..., description="Arquivo do currículo do usuário")
    cpf: str = Field(..., description="CPF do usuário")
    telefone: str = Field(..., description="Telefone do usuário")
    endereco: str = Field(..., description="Endereço do usuário")
    dataNascimento: str = Field(..., description="Data de nascimento do usuário")
    sexo: str = Field(..., description="Sexo do usuário")
    
    class Config:
        from_attributes = True
        arbitrary_types_allowed = True