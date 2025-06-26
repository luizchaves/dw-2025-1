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
        }
      }
    }
  },
  apis: ['./src/routes.js'],
};

const specs = swaggerJSDoc(options);

export { specs, swaggerUi };
