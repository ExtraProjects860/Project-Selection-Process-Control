from pydantic import BaseModel
from typing import Optional


class PegarStatusProcessoSeletivo(BaseModel):
    id_status_processo_seletivo: Optional[int]
    data_entrevista: Optional[str]
    data_conclusao: Optional[str]
    nome_usuario: Optional[str]
    telefone: Optional[str]
    email: Optional[str]
    nome_cargo: Optional[str]
    nome_etapa: Optional[str]
    nome_setor: Optional[str]
    perfil: Optional[str]
    status_processo: Optional[str]
    observacao: Optional[str]
    forms_respondido: Optional[int]
    avaliacao_forms: Optional[str]


class PegarUsuarios(BaseModel):
    id_usuario: Optional[int]
    email: Optional[str]
    admin: Optional[int]
    data_criacao: Optional[str]
    nome_usuario: Optional[str]
    cpf: Optional[str]
    telefone: Optional[str]
    endereco: Optional[str]
    data_nascimento: Optional[str]
    sexo: Optional[str]
    tem_inscricao: Optional[str]