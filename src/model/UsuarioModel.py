from src.controller.DadosUsuarioController import DadosUsuarioController
from typing import Optional
from pydantic import BaseModel, Field, EmailStr

class UsuarioModel(BaseModel):
    dados_usuario: Optional[DadosUsuarioController]
    email: Optional[EmailStr] = Field(..., description="Email do usuário")
    senha: Optional[str] = Field(..., description="Senha do usuário")
    admin: Optional[bool] = Field(..., description="Se o usuário é administrador")
    tokenForgotPassword: Optional[str] = Field(None, description="Token para redefinir a senha")
    tokenTimeValid: Optional[str] = Field(None, description="Tempo de validade do token")

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True