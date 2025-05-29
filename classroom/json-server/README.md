# JSON Server

Este diretório contém um exemplo de como usar o o pacote json-server para criar uma API REST fake rapidamente para desenvolvimento e prototipagem. Para mais informações sobre o JSON Server, visite: https://github.com/typicode/json-server

```
json-server/
├── db.json          # Banco de dados em JSON
├── package.json     # Dependências do projeto
├── requests.http    # Exemplos de requisições HTTP
└── README.md        # Este arquivo
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
npx json-server db.json
```

O servidor será iniciado em `http://localhost:3000` por padrão. Caso precise, é possível especificar porta personalizada (opcional)

```bash
npx json-server db.json --port 3001
```

O projeto inclui um script `start` no `package.json` que executa o json-server:

```bash
npm run start
```

ou simplesmente:

```bash
npm start
```

Este comando é equivalente a executar `json-server db.json`.

## 🔗 Endpoints da API

### Hosts

| Método   | Path          | Retorno | Descrição                    |
|----------|---------------|---------|------------------------------|
| `GET`    | `/hosts`      | `200`   | Lista todos os hosts         |
| `GET`    | `/hosts/:id`  | `200`   | Busca um host específico     |
| `POST`   | `/hosts`      | `201`   | Cria um novo host            |
| `PUT`    | `/hosts/:id`  | `200`   | Atualiza um host existente   |
| `DELETE` | `/hosts/:id`  | `200`   | Remove um host               |

Recursos adicionais do JSON Server

- **Filtros**: `GET /hosts?name=Google`
- **Paginação**: `GET /hosts?_page=1&_limit=10`
- **Ordenação**: `GET /hosts?_sort=name&_order=asc`
- **Busca**: `GET /hosts?q=DNS`

## 🧪 Testando a API

### Usando o arquivo requests.http

Para consumir a API, você pode usar o arquivo `requests.http` incluído no projeto, que contém exemplos de requisições para cada endpoint. Para utilizá-lo, você precisa da extensão REST Client instalada no Visual Studio Code. A seguir estão alguns exemplos de requisições que você pode fazer:

#### Listar todos os hosts
```http
GET http://localhost:3000/hosts
```

#### Buscar um host específico
```http
GET http://localhost:3000/hosts/1
```

#### Criar um novo host
```http
POST http://localhost:3000/hosts
Content-Type: application/json

{
  "name": "OpenDNS",
  "address": "208.67.222.222"
}
```

#### Atualizar um host
```http
PUT http://localhost:3000/hosts/1
Content-Type: application/json

{
  "name": "Google DNS Primary",
  "address": "8.8.8.8"
}
```

#### Remover um host
```http
DELETE http://localhost:3000/hosts/1
```

### Usando curl

Você também pode testar a API usando o `curl` no terminal. Aqui estão alguns exemplos de comandos:

#### Listar todos os hosts
```bash
curl http://localhost:3000/hosts
```

#### Buscar um host específico
```bash
curl http://localhost:3000/hosts/1
```

#### Criar um novo host
```bash
curl -X POST http://localhost:3000/hosts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Secondary Google DNS",
    "address": "8.8.4.4"
  }'
```

#### Atualizar um host
```bash
curl -X PUT http://localhost:3000/hosts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Google DNS | Secondary",
    "address": "8.8.4.4"
  }'
```

#### Remover um host
```bash
curl -X DELETE http://localhost:3000/hosts/1
```



### Usando o navegador

Abra `http://localhost:3000/hosts` no seu navegador para ver os dados em formato JSON para as requisições GET.




