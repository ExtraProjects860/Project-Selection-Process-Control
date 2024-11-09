SQL_BUSCAR_SETOR_POR_NOME: str = """
    SELECT nome_setor
    FROM setor;
"""


SQL_BUSCAR_CARGO_POR_NOME: str = """
    SELECT nome_cargo
    FROM cargo;
"""


SQL_BUSCAR_SETOR_POR_ID: str = """
    SELECT id_setor
    FROM setor
    WHERE nome_setor = %s;
"""


SQL_BUSCAR_CARGO_POR_ID: str = """
    SELECT id_cargo
    FROM cargo
    WHERE nome_cargo = %s;
"""

SQL_QUANTIDADE_VAGAS: str = """
    SELECT COUNT(id_vaga) as quantidade
    FROM vaga;
"""

SQL_PEGAR_TODAS_VAGAS: str = """
    SELECT v.id_vaga, v.nome_vaga, c.nome_cargo, s.nome_setor, v.descricao_vaga, v.status, v.salario, v.quantidade_vagas, v.data_abertura, v.data_encerramento
    FROM vaga v
    INNER JOIN setor s ON v.id_setor = s.id_setor
    INNER JOIN cargo c ON v.id_cargo = c.id_cargo
    ORDER BY v.id_vaga DESC
    LIMIT %s OFFSET %s;
"""


SQL_PEGAR_VAGAS_ABERTAS: str = """
    SELECT v.id_vaga, v.nome_vaga, c.nome_cargo, s.nome_setor, v.descricao_vaga, v.status, v.salario, v.quantidade_vagas, v.data_abertura, v.data_encerramento
    FROM vaga v
    INNER JOIN setor s ON v.id_setor = s.id_setor
    INNER JOIN cargo c ON v.id_cargo = c.id_cargo
    WHERE v.status = 'ABERTA'
    ORDER BY v.id_vaga DESC
    LIMIT %s OFFSET %s;
"""


SQL_CRIAR_VAGA: str = """
    INSERT INTO vaga (id_setor, id_cargo, nome_vaga, descricao_vaga, status, salario, quantidade_vagas, data_encerramento)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
"""


SQL_ATUALIZAR_VAGA: str = """
    UPDATE vaga
    SET id_setor = %s, id_cargo = %s, nome_vaga = %s, status = %s, descricao_vaga = %s, salario = %s, quantidade_vagas = %s, data_encerramento = %s
    WHERE id_vaga = %s;
"""