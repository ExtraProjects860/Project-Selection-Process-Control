# import secrets

# # Gera uma chave secreta aleatória com 32 bytes (256 bits)
# token_de_troca_da_senha = secrets.token_urlsafe(4)

# # Converte a chave para uma string hexadecimal (opcional)
# print(token_de_troca_da_senha)

from datetime import datetime, timedelta

# Suponha que 'tempo_de_validade' seja uma data/hora em formato ISO
tempo_de_validade = datetime.now() + timedelta(minutes=30)

# Converta para isoformat
tempo_de_validade_iso = tempo_de_validade.isoformat()

# Simule a recuperação do ISO string e conversão de volta para datetime
tempo_de_validade_dt = datetime.fromisoformat(tempo_de_validade_iso)
print(tempo_de_validade_dt)

# Agora faça a comparação
print(tempo_de_validade_dt - datetime.now() >= timedelta(minutes=30))