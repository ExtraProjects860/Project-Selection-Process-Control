SQL_VERIFICAR_SE_TOKEN_ESTA_NA_BLACKLIST: str = """
    SELECT revogado
    FROM token_blacklist
    WHERE jti = %s;
"""


SQL_INSERIR_TOKEN_NA_BLACKLIST: str = """
    INSERT INTO token_blacklist (jti)
    VALUES (%s);
"""


SQL_VERIFICAR_SE_EMAIL_EXISTE: str = """
    SELECT email 
    FROM usuario 
    WHERE email = %s;
"""


SQL_VERIFICAR_VALIDADE_E_TOKEN: str = """
    SELECT tokenForgotPassword, tokenTimeValid
    From usuario
    WHERE email = %s;
"""


SQL_INVALIDAR_TOKEN: str = """
    UPDATE usuario
    SET tokenForgotPassword = NULL, tokenTimeValid = NULL
    WHERE email = %s;
"""