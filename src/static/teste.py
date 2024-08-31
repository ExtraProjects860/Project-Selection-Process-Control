import secrets

# Gera uma chave secreta aleatória com 32 bytes (256 bits)
secret_key = secrets.token_bytes(32)

# Converte a chave para uma string hexadecimal (opcional)
secret_key_hex = secret_key.hex()
print(secret_key_hex)