SQL_UPDATE_USER_OU_ADMIN: str = """
    UPDATE usuario
    SET admin = %s
    WHERE id_usuario = %s;
"""


SQL_CRIAR_USUARIO: str = """
    INSERT INTO usuario (email, senha, admin)
    VALUES (%s, %s, %s);
"""


SQL_LOGIN_USUARIO: str = """
    SELECT u.id_usuario, u.senha, u.admin, du.nome_usuario, du.telefone, du.endereco
    FROM usuario u
    INNER JOIN dados_usuario du ON u.id_usuario = du.id_dados_usuario
    WHERE u.email = %s;
"""


SQL_ATUALIZAR_TOKEN: str = """
    UPDATE usuario 
    SET tokenForgotPassword = %s, tokenTimeValid = %s
    WHERE email = %s;
"""


SQL_REDEFINIR_SENHA: str = """
    UPDATE usuario
    SET senha = %s, tokenForgotPassword = NULL, tokenTimeValid = NULL
    WHERE email = %s;
"""


