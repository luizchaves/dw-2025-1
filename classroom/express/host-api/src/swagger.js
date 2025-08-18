import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Host Monitor API',
      version: '1.0.0',
      description: 'API para monitoramento de hosts - permite criar, listar, atualizar e deletar hosts',
      contact: {
        name: 'API Support',
        email: 'support@hostmonitor.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Informe o token JWT no formato: Bearer <token>'
        }
      },
      schemas: {
        Host: {
          type: 'object',
          required: ['name', 'address'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do host (gerado automaticamente)',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            name: {
              type: 'string',
              description: 'Nome descritivo do host',
              example: 'DNS Server'
            },
            address: {
              type: 'string',
              description: 'Endereço IP ou hostname',
              example: '1.1.1.1'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
                example: 'DNS'
              },
              description: 'Nomes das tags associadas ao host',
              example: ['DNS', 'Google']
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do host'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização'
            }
          }
        },
        HostInput: {
          type: 'object',
          required: ['name', 'address'],
          properties: {
            name: {
              type: 'string',
              description: 'Nome descritivo do host',
              example: 'DNS Server'
            },
            address: {
              type: 'string',
              description: 'Endereço IP ou hostname',
              example: '1.1.1.1'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Lista de tags para associar ao host',
              example: ['production', 'dns']
            }
          }
        },
        Ping: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do ping',
              example: '987fcdeb-51a2-4b3d-c456-426614174001'
            },
            host: {
              $ref: '#/components/schemas/Host',
              description: 'Host associado ao ping'
            },
            output: {
              type: 'string',
              description: 'Saída completa do comando ping',
              example: 'PING 1.1.1.1 (1.1.1.1): 56 data bytes\\n64 bytes from 1.1.1.1: icmp_seq=0 ttl=59 time=12.345 ms'
            },
            stats: {
              type: 'object',
              properties: {
                transmitted: {
                  type: 'integer',
                  description: 'Número de pacotes transmitidos',
                  example: 4
                },
                received: {
                  type: 'integer',
                  description: 'Número de pacotes recebidos',
                  example: 4
                },
                time: {
                  type: 'number',
                  format: 'float',
                  description: 'Tempo total em milissegundos',
                  example: 3012.5
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do ping'
            }
          }
        },
        Tag: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único da tag',
              example: '456e7890-e89b-12d3-a456-426614174002'
            },
            name: {
              type: 'string',
              description: 'Nome da tag',
              example: 'production'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação da tag'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do usuário (gerado automaticamente)',
              example: '789e1234-e89b-12d3-a456-426614174003'
            },
            name: {
              type: 'string',
              description: 'Nome completo do usuário',
              example: 'Test user'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
              example: 'test@email.com'
            }
          },
          description: 'Dados do usuário (senha não é retornada por segurança)'
        },
        UserInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              description: 'Nome completo do usuário',
              example: 'Test User'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário (deve ser único)',
              example: 'test@email.com'
            },
            password: {
              type: 'string',
              description: 'Senha do usuário (será criptografada)',
              example: 'password123'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem de erro',
              example: 'Error when passing parameters'
            }
          }
        },
        Error401: {
          type: 'object',
          properties: {
            auth: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Token invalid.'
            }
          },
          description: 'Erro de autenticação: token ausente ou inválido.'
        }
      }
    }
  },
  apis: ['./src/routes.js'],
};

const specs = swaggerJSDoc(options);

export { specs, swaggerUi };
