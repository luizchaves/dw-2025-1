# Hello API

Esta é uma API simples desenvolvida com Express.js que fornece endpoints para saudações em diferentes idiomas (inglês, português e espanhol).

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

## 🔗 Endpoints da API

### Saudações

| Método   | Path              | Parâmetros | Descrição                           |
|----------|-------------------|------------|-------------------------------------|
| `GET`    | `/hello/en`       | `?name=`   | Saudação em inglês via query param |
| `GET`    | `/hello/pt/:name` | `:name`    | Saudação em português via URL param |
| `POST`   | `/hello/es`       | `body`     | Saudação em espanhol via body       |

## 🧪 Testando a API

### Usando curl

#### Saudação em inglês
```bash
curl "http://localhost:3000/hello/en?name=João"
```

Resposta:
```json
{
  "message": "Hello, João!"
}
```

#### Saudação em português
```bash
curl http://localhost:3000/hello/pt/Maria
```

Resposta:
```json
{
  "message": "Olá, Maria!"
}
```

#### Saudação em espanhol
```bash
curl -X POST http://localhost:3000/hello/es \
  -H "Content-Type: application/json" \
  -d '{"name": "Carlos"}'
```

Resposta:
```json
{
  "message": "Hola, Carlos!"
}
```

### Usando o navegador

Para os endpoints GET, você pode testar diretamente no navegador:

- `http://localhost:3000/hello/en?name=SeuNome`
- `http://localhost:3000/hello/pt/SeuNome`

### Página inicial

Acesse `http://localhost:3000` para ver a página inicial da aplicação.

## ⚠️ Tratamento de Erros

Todos os endpoints retornam erro 400 quando o parâmetro `name` não é fornecido:

```json
{
  "message": "Name query parameter is required"
}
```

## 🛠️ Tecnologias Utilizadas

- **Express.js** - Framework web para Node.js
- **JavaScript ES6+** - Linguagem de programação
