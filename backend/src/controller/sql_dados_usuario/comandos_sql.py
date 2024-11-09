SQL_INSERIR_DADOS_USUARIO: str = f"""
    INSERT INTO dados_usuario (id_dados_usuario, nome_usuario, curriculo, cpf, telefone, endereco, data_nascimento, sexo) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
"""


SQL_ATUALIZAR_EMAIL_SENHA_USUARIO: str = """
    UPDATE usuario
    SET email = %s, senha = %s
    WHERE id_usuario = %s;
"""


SQL_ATUALIZAR_EMAIL_USUARIO: str = """
    UPDATE usuario
    SET email = %s
    WHERE id_usuario = %s;
"""


SQL_ATUALIZAR_DADOS_USUARIO: str = """
    UPDATE dados_usuario
    SET telefone = %s, endereco = %s
    WHERE id_dados_usuario = %s;
"""