# Host Monitor API

API para monitoramento de hosts desenvolvida com Express.js que permite gerenciar uma lista de hosts com operações CRUD completas.

```
host-api/
├── src/
│   ├── index.js         # Servidor principal da aplicação
│   ├── routes.js        # Definição das rotas da API
│   ├── swagger.js       # Configuração da documentação Swagger
│   └── data/
│       └── hosts.js     # Dados dos hosts em memória
├── public/
│   └── index.html       # Página inicial
├── package.json         # Dependências do projeto
├── requests.http        # Arquivo com exemplos de requisições
└── README.md           # Este arquivo
```

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm (geralmente instalado junto com o Node.js)

## 🚀 Como executar

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar o servidor

```bash
npm start
```

O servidor será iniciado em `http://localhost:3000` por padrão.

## 📚 Documentação da API

### Swagger UI
Acesse `http://localhost:3000/api-docs` para visualizar a documentação interativa da API gerada automaticamente com Swagger.

A documentação inclui:
- 📋 Lista completa de todos os endpoints
- 🔧 Interface para testar as requisições diretamente no navegador
- 📖 Exemplos de request/response para cada endpoint
- 🏷️ Esquemas de dados detalhados

## 🔗 Endpoints da API

### Hosts Management

| Método   | Path              | Descrição                    |
|----------|-------------------|------------------------------|
| `POST`   | `/api/hosts`      | Criar um novo host           |
| `GET`    | `/api/hosts`      | Listar todos os hosts        |
| `GET`    | `/api/hosts/:id`  | Buscar um host específico    |
| `PUT`    | `/api/hosts/:id`  | Atualizar um host existente  |
| `DELETE` | `/api/hosts/:id`  | Deletar um host              |

### Query Parameters (GET /api/hosts)
- `name` - Filtrar hosts por nome (busca parcial)
- `address` - Filtrar hosts por endereço

## 🧪 Testando a API

### Usando curl

#### Criar um novo host
```bash
curl -X POST http://localhost:3000/api/hosts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "DNS Server",
    "address": "1.1.1.1"
  }'
```

#### Listar todos os hosts
```bash
curl http://localhost:3000/api/hosts
```

#### Buscar host por ID
```bash
curl http://localhost:3000/api/hosts/{host-id}
```

#### Atualizar um host
```bash
curl -X PUT http://localhost:3000/api/hosts/{host-id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cloudflare DNS",
    "address": "1.1.1.1"
  }'
```

#### Deletar um host
```bash
curl -X DELETE http://localhost:3000/api/hosts/{host-id}
```

### Usando o arquivo requests.http

O projeto inclui um arquivo `requests.http` com exemplos de todas as requisições. Você pode usar extensões como REST Client no VS Code para executar essas requisições diretamente.

## 📊 Modelo de Dados

### Host
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "DNS Server",
  "address": "1.1.1.1"
}
```

### Campos Obrigatórios
- `name` (string) - Nome descritivo do host
- `address` (string) - Endereço IP ou hostname

## ⚠️ Tratamento de Erros

### Status Codes
| Status | Descrição |
|--------|-----------|
| `200`  | Sucesso |
| `201`  | Criado com sucesso |
| `204`  | Deletado com sucesso |
| `400`  | Erro de validação ou recurso não encontrado |
| `404`  | Endpoint não encontrado |
| `500`  | Erro interno do servidor |

### Exemplos de Erros
```json
{
  "message": "Error when passing parameters"
}
```

```json
{
  "message": "Unable to read a host"
}
```

## 🧪 Executando Testes

```bash
# Executar testes uma vez
npm test

# Executar testes em modo watch
npm run test:watch
```

## 🛠️ Tecnologias Utilizadas

- **Express.js** - Framework web para Node.js
- **UUID** - Geração de IDs únicos
- **Morgan** - Logger de requisições HTTP
- **Swagger JSDoc** - Geração de documentação API
- **Swagger UI Express** - Interface visual para documentação
- **Supertest** - Testes de integração HTTP
- **Node.js Test Runner** - Testes nativos do Node.js

## 🔧 Desenvolvimento

### Scripts Disponíveis
- `npm start` - Inicia o servidor em modo produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento com auto-reload
- `npm test` - Executa os testes
- `npm run test:watch` - Executa os testes em modo watch

### Estrutura de Arquivos
- `src/index.js` - Configuração principal do servidor Express
- `src/routes.js` - Definição das rotas e lógica de negócio
- `src/swagger.js` - Configuração da documentação Swagger
- `src/data/hosts.js` - Armazenamento em memória dos hosts

## 📝 Próximas Melhorias

- [ ] Persistência em banco de dados
- [ ] Autenticação e autorização
- [ ] Validação mais robusta de dados
- [ ] Logs estruturados
- [ ] Rate limiting
- [ ] Versionamento da API
- [ ] Dockerização
- [ ] Testes de carga

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
