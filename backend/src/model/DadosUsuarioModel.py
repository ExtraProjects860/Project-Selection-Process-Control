from pydantic import BaseModel, Field
from typing import Optional
from abc import ABC

class DadosUsuarioModel(BaseModel, ABC):
    nome_usuario: Optional[str] = Field(..., description="Nome do usuário", alias='_nome_usuario')
    curriculo: Optional[str] = Field(None, description="Arquivo do currículo do usuário", alias='_curriculo')
    cpf: Optional[str] = Field(..., description="CPF do usuário", alias='_cpf')
    telefone: Optional[str] = Field(..., description="Telefone do usuário", alias='_telefone')
    endereco: Optional[str] = Field(..., description="Endereço do usuário", alias='_endereco')
    dataNascimento: Optional[str] = Field(..., description="Data de nascimento do usuário", alias='_dataNascimento')
    sexo: Optional[str] = Field(..., description="Sexo do usuário", alias='_sexo')
    
    class Config:
        from_attributes: bool = True
        arbitrary_types_allowed: bool = True
        populate_by_name: bool = True