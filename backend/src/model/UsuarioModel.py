from src.controller.DadosUsuarioController import DadosUsuarioController
from typing import Optional
from pydantic import BaseModel, Field, EmailStr
from abc import ABC

class UsuarioModel(BaseModel, ABC):
    dados_usuario: Optional[DadosUsuarioController] = Field(None, alias='_dados_usuario')
    email: Optional[EmailStr] = Field(..., description="Email do usuário", alias='_email')
    senha: Optional[str] = Field(..., description="Senha do usuário", alias='_senha')
    admin: Optional[bool] = Field(..., description="Se o usuário é administrador", alias='_admin')
    tokenForgotPassword: Optional[str] = Field(None, description="Token para redefinir a senha")
    tokenTimeValid: Optional[str] = Field(None, description="Tempo de validade do token")

    class Config:
        from_attributes: bool = True
        arbitrary_types_allowed: bool = True
        populate_by_name: bool = True