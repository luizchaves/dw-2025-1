# Ping API

Uma API simples desenvolvida com Express.js que fornece um endpoint de ping para verificar o status e tempo de resposta do servidor.

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

### Health Check

| Método   | Path    | Descrição                                    |
|----------|---------|----------------------------------------------|
| `GET`    | `/ping` | Retorna pong com timestamp para health check |

## 🧪 Testando a API

### Usando curl

```bash
curl http://localhost:3000/ping?host=localhost
```

Resposta:
```json
{
  "inputHost": "localhost",
  "host": "localhost",
  "alive": true,
  "output": "PING localhost (127.0.0.1): 56 data bytes\n64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.110 ms\n64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.185 ms\n64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.149 ms\n\n--- localhost ping statistics ---\n3 packets transmitted, 3 packets received, 0.0% packet loss\nround-trip min/avg/max/stddev = 0.110/0.148/0.185/0.031 ms\n",
  "time": 0.11,
  "times": [
    0.11,
    0.185,
    0.149
  ],
  "min": "0.110",
  "max": "0.185",
  "avg": "0.148",
  "stddev": "0.031",
  "packetLoss": "0.000",
  "numeric_host": "127.0.0.1"
}
```

### Usando o navegador

Acesse `http://localhost:3000/ping?host=localhost` diretamente no navegador para testar o endpoint.

## 📊 Casos de Uso

Esta API é útil para:

- **Health checks** - Verificar se o servidor está respondendo
- **Monitoramento** - Sistemas de monitoramento podem usar este endpoint
- **Load balancers** - Verificar se a instância está saudável
- **Testes de conectividade** - Verificar latência e disponibilidade

## 🛠️ Tecnologias Utilizadas

- **Express.js** - Framework web para Node.js
- **JavaScript ES6+** - Linguagem de programação

## 🔧 Desenvolvimento

Para executar em modo de desenvolvimento com auto-reload:

```bash
npm run dev
```

## 📝 Scripts Disponíveis

- `npm start` - Inicia o servidor em modo produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento (se configurado)

## 🌐 Status Codes

| Status | Descrição |
|--------|-----------|
| `200`  | Sucesso - servidor funcionando corretamente |
