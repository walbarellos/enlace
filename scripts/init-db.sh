#!/bin/bash
set -e

echo "=========================================================="
echo ">>> INICIALIZANDO BANCO DE DADOS DA PLATAFORMA ENLACE <<<"
echo "=========================================================="

for f in /docker-entrypoint-initdb.d/scripts/*.sql; do
    echo ">>> Aplicando DDL: $f"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f "$f"
done

echo ">>> TODAS AS 8 MIGRAÇÕES FORAM APLICADAS COM SUCESSO! <<<"
echo "=========================================================="
