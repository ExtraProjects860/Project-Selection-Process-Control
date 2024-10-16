from pydantic import BaseModel, Field
from typing import Optional
from abc import ABC

class DadosUsuarioModel(BaseModel, ABC):
    nome_usuario: str = Field(..., description="Nome do usuário", alias='_nome_usuario')
    curriculo: Optional[str] = Field(None, description="Arquivo do currículo do usuário", alias='_curriculo')
    cpf: str = Field(..., description="CPF do usuário", alias='_cpf')
    telefone: str = Field(..., description="Telefone do usuário", alias='_telefone')
    endereco: str = Field(..., description="Endereço do usuário", alias='_endereco')
    dataNascimento: str = Field(..., description="Data de nascimento do usuário", alias='_dataNascimento')
    sexo: str = Field(..., description="Sexo do usuário", alias='_sexo')
    
    class Config:
        from_attributes: bool = True
        arbitrary_types_allowed: bool = True
        populate_by_name: bool = True