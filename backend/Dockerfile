FROM python:3.11-slim

# Instala dependências básicas
RUN apt-get update && apt-get install -y curl gnupg2 apt-transport-https ca-certificates

# Adiciona a chave GPG da Microsoft (nova forma, sem apt-key)
RUN curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > /usr/share/keyrings/microsoft.gpg

# Adiciona o repositório do SQL Server ODBC
RUN echo "deb [signed-by=/usr/share/keyrings/microsoft.gpg] https://packages.microsoft.com/debian/11/prod bullseye main" \
    > /etc/apt/sources.list.d/mssql-release.list

# Atualiza e instala o driver ODBC da Microsoft
RUN apt-get update && ACCEPT_EULA=Y apt-get install -y msodbcsql17 unixodbc-dev

# Define diretório de trabalho
WORKDIR /app

# Copia os arquivos
COPY . .

# Instala dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Expõe a porta
EXPOSE 8000

# Comando de inicialização
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]