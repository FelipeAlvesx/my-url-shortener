# 🔄 Load Balancer - Guia de Implementação

## 📚 Como Funciona

### Arquitetura

```
          Cliente
             ↓
    ┌────────────────┐
    │  Nginx (porta 80)  │  ← Load Balancer
    └────────────────┘
             ↓
      Round-Robin
             ↓
    ┌────────┬────────┬────────┐
    │ API-1  │ API-2  │ API-3  │  ← 3 Instâncias da API
    │ :3000  │ :3000  │ :3000  │
    └────────┴────────┴────────┘
             ↓
    ┌────────────────┐
    │ SQLite (Volume) │  ← Banco compartilhado
    └────────────────┘
```

### Componentes

#### 1. **Nginx (Load Balancer)**

- Recebe todas as requisições HTTP na porta 80
- Distribui entre as 3 instâncias da API
- Algoritmo: **Round-Robin** (cada requisição vai para próxima instância)
- Health checks: verifica se instâncias estão disponíveis

#### 2. **API Instances (api-1, api-2, api-3)**

- 3 réplicas idênticas da aplicação
- Cada uma roda na porta 3000 internamente
- Compartilham o mesmo banco de dados SQLite

#### 3. **SQLite Database**

- Volume Docker compartilhado entre todas instâncias
- Garante consistência dos dados

## 🚀 Como Usar

### Iniciar o Load Balancer

```bash
# 1. Criar arquivo .env com suas configurações
cp .env.example .env

# 2. Editar .env e adicionar JWT_SECRET forte
nano .env

# 3. Subir todos os containers
docker-compose up -d

# 4. Verificar status
docker-compose ps
```

Você deve ver 4 containers rodando:

- `url-shortener-nginx` (load balancer)
- `url-shortener-api-1`
- `url-shortener-api-2`
- `url-shortener-api-3`

### Testar o Load Balancer

```bash
# Fazer várias requisições e ver qual instância responde
for i in {1..6}; do
  curl http://localhost/health/ping
  echo ""
done
```

Cada requisição será processada por uma instância diferente (round-robin).

### Ver Logs

```bash
# Logs do Nginx
docker-compose logs nginx

# Logs de todas as APIs
docker-compose logs api-1 api-2 api-3

# Logs em tempo real
docker-compose logs -f
```

## ⚙️ Configuração do Nginx

### Upstream (nginx.conf)

```nginx
upstream api_backend {
    server api-1:3000 weight=1;  # 33% das requisições
    server api-2:3000 weight=1;  # 33% das requisições
    server api-3:3000 weight=1;  # 33% das requisições
}
```

**Parâmetros importantes:**

- `weight=1` - Peso igual para todas instâncias
- `max_fails=3` - Marca como indisponível após 3 falhas
- `fail_timeout=30s` - Tenta novamente após 30 segundos

### Algoritmos de Balanceamento

Você pode mudar o algoritmo editando `nginx.conf`:

```nginx
# Round-Robin (padrão) - distribui igualmente
upstream api_backend {
    server api-1:3000;
    server api-2:3000;
    server api-3:3000;
}

# Least Connections - envia para a menos ocupada
upstream api_backend {
    least_conn;
    server api-1:3000;
    server api-2:3000;
    server api-3:3000;
}

# IP Hash - mesma IP sempre vai para mesma instância
upstream api_backend {
    ip_hash;
    server api-1:3000;
    server api-2:3000;
    server api-3:3000;
}

# Weighted - distribuição customizada
upstream api_backend {
    server api-1:3000 weight=3;  # Recebe 60%
    server api-2:3000 weight=1;  # Recebe 20%
    server api-3:3000 weight=1;  # Recebe 20%
}
```

## 🔍 Monitoramento

### Health Checks

**Nginx:**

```bash
curl http://localhost/nginx-health
# Resposta: Nginx OK
```

**APIs (via Nginx):**

```bash
curl http://localhost/health/ping
# Resposta: {"message":"pong"}
```

**Verificar qual instância está respondendo:**

Adicione este header no código para debug:

```typescript
res.setHeader("X-Served-By", process.env.HOSTNAME || "unknown");
```

### Estatísticas

```bash
# Ver containers ativos
docker-compose ps

# Ver uso de recursos
docker stats

# Ver quantas conexões cada instância tem
docker-compose exec nginx cat /var/log/nginx/api_access.log | tail -20
```

## 📈 Escalabilidade

### Adicionar mais instâncias

1. Editar `docker-compose.yml`:

```yaml
api-4:
    build:
        context: .
        dockerfile: Dockerfile
    container_name: url-shortener-api-4
    environment:
        - NODE_ENV=production
        - PORT=3000
        - DATABASE_URL=file:/app/data/dev.db
        - BASE_URL=http://localhost
        - JWT_SECRET=${JWT_SECRET}
    volumes:
        - db-data:/app/data
    restart: unless-stopped
```

2. Adicionar no `nginx.conf`:

```nginx
upstream api_backend {
    server api-1:3000;
    server api-2:3000;
    server api-3:3000;
    server api-4:3000;  # Nova instância
}
```

3. Recriar containers:

```bash
docker-compose up -d --build
```

### Reduzir instâncias

Para usar apenas 2 instâncias:

1. Comentar `api-3` no `docker-compose.yml`
2. Remover `api-3` do `nginx.conf`
3. Executar: `docker-compose up -d`

## 🐛 Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs api-1

# Reiniciar container específico
docker-compose restart api-1
```

### Nginx retorna 502 Bad Gateway

- Verificar se APIs estão rodando: `docker-compose ps`
- Ver logs do Nginx: `docker-compose logs nginx`
- Testar API diretamente: `docker-compose exec api-1 wget -O- http://localhost:3000/health/ping`

### Performance

```bash
# Ver uso de CPU/RAM
docker stats

# Se precisar mais recursos, ajustar no docker-compose.yml:
deploy:
    resources:
        limits:
            cpus: '0.5'
            memory: 512M
```

## 🚀 Deploy em Produção

### Recomendações

1. **Use PostgreSQL** ao invés de SQLite (melhor para múltiplas instâncias)
2. **SSL/TLS**: Configure certificado no Nginx
3. **Monitoring**: Use Prometheus + Grafana
4. **Logs centralizados**: ELK Stack ou Loki
5. **Autoscaling**: Kubernetes para escalar automaticamente

### Variáveis de ambiente para produção

```env
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://user:pass@db:5432/mydb"
BASE_URL="https://seudominio.com"
JWT_SECRET="CHAVE-SUPER-SEGURA-GERADA-ALEATORIAMENTE"
```

### Certificado SSL no Nginx

Adicionar no `nginx.conf`:

```nginx
server {
    listen 443 ssl http2;
    server_name seudominio.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # ... resto da configuração
}
```

## 📊 Vantagens do Load Balancer

✅ **Alta disponibilidade** - Se uma instância cair, outras continuam
✅ **Escalabilidade horizontal** - Adicione mais instâncias conforme necessário
✅ **Melhor performance** - Distribui carga entre múltiplas instâncias
✅ **Zero downtime** - Atualize instâncias uma por vez
✅ **Resiliência** - Health checks detectam e removem instâncias problemáticas

## ⚠️ Limitação Atual: SQLite

SQLite não é ideal para múltiplas instâncias simultâneas. Para produção, migre para PostgreSQL:

```bash
# Mudar no schema.prisma
datasource db {
  provider = "postgresql"
}

# Atualizar DATABASE_URL
DATABASE_URL="postgresql://user:pass@postgres:5432/urlshortener"
```
