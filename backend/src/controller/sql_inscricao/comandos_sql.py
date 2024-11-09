SQL_EXCLUIR_CURRICULO: str = """
    UPDATE dados_usuario
    SET curriculo = NULL
    WHERE id_dados_usuario = %s;
"""


SQL_PEGAR_CURRICULO: str = """
    SELECT curriculo
    FROM dados_usuario
    WHERE id_dados_usuario = %s;
"""


SQL_SUBIR_CURRICULO: str = """
    UPDATE dados_usuario
    SET curriculo = %s
    WHERE id_dados_usuario = %s;
"""


SQL_SALVAR_INSCRICAO: str = """
    INSERT INTO inscricao (id_usuario, id_vaga)
    VALUES (%s, %s);
"""


SQL_BUSCAR_QUE_RELIZOU_INSCRICAO_USUARIO: str = """
    SELECT du.nome_usuario, du.telefone, u.email
    FROM dados_usuario du
    INNER JOIN usuario u ON du.id_dados_usuario = u.id_usuario
    WHERE u.id_usuario = %s;
"""


SQL_QUANTIDADE_INSCRICOES_USUARIO: str = """
    SELECT COUNT(*) as quantidade
    FROM inscricao
    WHERE id_usuario = %s;
"""

# te odeio (melhorado para não ocorrer bugs na hora de mostrar as inscrições)
SQL_MOSTRAR_INSCRICOES_USUARIO: str = """
    SELECT i.id_inscricao, v.id_vaga, sps.id_status_processo_seletivo, v.nome_vaga, 
        c.nome_cargo, s.nome_setor, v.descricao_vaga, v.status, v.salario, 
        v.quantidade_vagas, v.data_encerramento, sps.data_entrevista, 
        sps.status_processo, sps.observacao, e.nome_etapa, l.link, sps.forms_respondido
    FROM inscricao i
    INNER JOIN vaga v ON i.id_vaga = v.id_vaga
    INNER JOIN status_processo_seletivo sps ON i.id_inscricao = sps.id_inscricao
    INNER JOIN etapa e ON sps.id_etapa = e.id_etapa
    INNER JOIN setor s ON v.id_setor = s.id_setor 
    INNER JOIN cargo c ON v.id_cargo = c.id_cargo
    INNER JOIN links_forms l ON c.nome_cargo = l.nome_cargo
    WHERE i.id_usuario = %s
    ORDER BY i.id_inscricao DESC
    LIMIT %s OFFSET %s;
"""


SQL_MARCAR_CONCLUIDO_FORMS: str = """
    UPDATE status_processo_seletivo
    SET forms_respondido = TRUE
    WHERE id_status_processo_seletivo = %s;
"""
