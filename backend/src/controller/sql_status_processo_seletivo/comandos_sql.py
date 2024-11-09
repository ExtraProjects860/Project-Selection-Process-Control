SQL_PEGAR_NOME_VAGA: str = """
    SELECT nome_vaga
    FROM vaga;
"""


SQL_PEGAR_NOME_ETAPA: str = """
    SELECT nome_etapa
    FROM etapa;
"""


SQL_BUSCAR_VAGA_ID: str = """
    SELECT id_vaga
    FROM vaga
    WHERE nome_vaga = %s;
"""


SQL_BUSCAR_ETAPA_ID: str = """
    SELECT id_etapa
    FROM etapa
    WHERE nome_etapa = %s;
"""


SQL_BUSCAR_NOME_EMAIL_USUARIO_POR_STATUS_PROCESSO_SELETIVO: str = """
    SELECT d.nome_usuario, u.email
    FROM status_processo_seletivo sps
    INNER JOIN inscricao i ON sps.id_inscricao = i.id_inscricao
    INNER JOIN usuario u ON i.id_usuario = u.id_usuario
    INNER JOIN dados_usuario d ON u.id_usuario = d.id_dados_usuario
    WHERE sps.id_status_processo_seletivo = %s;
"""


SQL_QUANTIDADE_STATUS_PROCESSO_SELETIVO: str = """
    SELECT COUNT(id_status_processo_seletivo) as quantidade
    FROM status_processo_seletivo;
"""

# você me deu mais problema do que me ajudou em algo, maldito comando (melhorado para não ocorrer bugs na hora de mostrar os status)
SQL_PEGAR_STATUS_PROCESSO_SELETIVO: str = """
    SELECT sps.id_status_processo_seletivo, sps.data_entrevista, sps.data_conclusao, du.nome_usuario, du.telefone, u.email, c.nome_cargo, e.nome_etapa, s.nome_setor, sps.perfil, sps.status_processo, sps.observacao, sps.forms_respondido, sps.avaliacao_forms, du.id_dados_usuario
    FROM status_processo_seletivo sps
    INNER JOIN etapa e ON sps.id_etapa = e.id_etapa
    INNER JOIN inscricao i ON i.id_inscricao = sps.id_inscricao
    INNER JOIN vaga v ON i.id_vaga = v.id_vaga
    INNER JOIN setor s ON v.id_setor = s.id_setor
    INNER JOIN cargo c ON v.id_cargo = c.id_cargo
    INNER JOIN usuario u ON i.id_usuario = u.id_usuario
    INNER JOIN dados_usuario du ON i.id_usuario = du.id_dados_usuario
    ORDER BY sps.id_status_processo_seletivo DESC
    LIMIT %s OFFSET %s;
"""


SQL_QUANTIDADE_TODOS_USUARIOS: str = """
    SELECT COUNT(id_usuario) as quantidade
    FROM usuario;
"""


SQL_PEGAR_TODOS_USUARIOS: str = """
    SELECT u.id_usuario, u.email, u.admin, u.data_criacao, du.nome_usuario, du.cpf, du.telefone, du.endereco, du.data_nascimento, du.sexo,
        CASE
            WHEN COUNT(i.id_usuario) > 0 THEN 'Sim'
            ELSE 'Não'
        END AS tem_inscricao
    FROM dados_usuario du
    INNER JOIN usuario u ON du.id_dados_usuario = u.id_usuario
    LEFT JOIN inscricao i ON u.id_usuario = i.id_usuario
    GROUP BY u.id_usuario 
    ORDER BY u.id_usuario DESC
    LIMIT %s OFFSET %s;
"""


SQL_VERIFICAR_SE_USUARIO_TEM_INSCRICAO: str = """
    SELECT id_inscricao
    FROM inscricao
    WHERE id_usuario = %s AND id_vaga = %s;
"""


SQL_SALVAR_STATUS_PROCESSO_SELETIVO: str = """
    INSERT INTO status_processo_seletivo (id_inscricao, id_etapa, data_entrevista, data_conclusao, status_processo, perfil, observacao, forms_respondido, avaliacao_forms)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
"""


SQL_ATUALIZAR_STATUS_PROCESSO_SELETIVO: str = """
    UPDATE status_processo_seletivo
    SET id_etapa = %s, data_entrevista = %s, data_conclusao = %s, status_processo = %s, perfil = %s, observacao = %s, forms_respondido = %s, avaliacao_forms = %s
    WHERE id_status_processo_seletivo = %s;
"""