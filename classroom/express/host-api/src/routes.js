import express from 'express';
import Host from './models/Hosts.js';
import Ping from './models/Pings.js';
import Tag from './models/Tags.js';
import { ping } from './lib/ping.js';

/**
 * @swagger
 * tags:
 *   - name: Hosts
 *     description: API para gerenciamento de hosts
 *   - name: Pings
 *     description: API para execução e consulta de pings
 *   - name: Tags
 *     description: API para gerenciamento de tags
 */

class HttpError extends Error {
  constructor(message, code = 400) {
    super(message);
    this.code = code;
  }
}

const router = express.Router();

/**
 * @swagger
 * /hosts:
 *   post:
 *     summary: Criar um novo host
 *     tags: [Hosts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HostInput'
 *     responses:
 *       201:
 *         description: Host criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Host'
 *       400:
 *         description: Erro de validação - parâmetros obrigatórios não fornecidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/hosts', async (req, res) => {
  const { name, address, tags } = req.body;

  if (!name || !address) {
    throw new HttpError('Error when passing parameters');
  }

  try {
    const createdHost = await Host.create({ name, address, tags });

    return res.status(201).json(createdHost);
  } catch (error) {
    throw new HttpError('Unable to create a host');
  }
});

/**
 * @swagger
 * /hosts:
 *   get:
 *     summary: Listar todos os hosts
 *     tags: [Hosts]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar hosts por nome (busca parcial)
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *         description: Filtrar hosts por endereço
 *     responses:
 *       200:
 *         description: Lista de hosts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Host'
 */
router.get('/hosts', async (req, res) => {
  const { name } = req.query;

  try {
    if (name) {
      const filteredHosts = await Host.read({ name });

      return res.json(filteredHosts);
    }

    const hosts = await Host.read();

    return res.json(hosts);
  } catch (error) {
    throw new HttpError('Unable to read hosts');
  }
});

/**
 * @swagger
 * /hosts/{id}:
 *   get:
 *     summary: Buscar um host por ID
 *     tags: [Hosts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único do host
 *     responses:
 *       200:
 *         description: Host encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Host'
 *       400:
 *         description: Host não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/hosts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const host = await Host.readById(id);

    if (host) {
      return res.json(host);
    } else {
      throw new HttpError('Host not found');
    }
  } catch (error) {
    throw new HttpError('Unable to read a host');
  }
});

/**
 * @swagger
 * /hosts/{id}:
 *   put:
 *     summary: Atualizar um host
 *     tags: [Hosts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único do host
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HostInput'
 *     responses:
 *       200:
 *         description: Host atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Host'
 *       400:
 *         description: Erro de validação ou host não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/hosts/:id', async (req, res) => {
  const { name, address, tags } = req.body;

  const id = req.params.id;

  if (!name || !address) {
    throw new HttpError('Error when passing parameters');
  }

  try {
    const updatedHost = await Host.update({ id, name, address, tags });

    return res.json(updatedHost);
  } catch (error) {
    throw new HttpError('Unable to update a host');
  }
});

/**
 * @swagger
 * /hosts/{id}:
 *   delete:
 *     summary: Deletar um host
 *     tags: [Hosts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único do host
 *     responses:
 *       204:
 *         description: Host deletado com sucesso
 *       400:
 *         description: Host não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/hosts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Host.remove(id);

    return res.status(204).end();
  } catch (error) {
    throw new HttpError('Unable to delete a host');
  }
});

/**
 * @swagger
 * /hosts/{hostId}/pings/{count}:
 *   post:
 *     summary: Executar ping em um host
 *     tags: [Pings]
 *     parameters:
 *       - in: path
 *         name: hostId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único do host
 *       - in: path
 *         name: count
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Número de pings a executar
 *         example: 4
 *     responses:
 *       200:
 *         description: Ping executado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ping'
 *       400:
 *         description: Host não encontrado ou erro na execução do ping
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/hosts/:hostId/pings/:count', async (req, res) => {
  const { hostId, count } = req.params;

  try {
    const host = await Host.readById(hostId);

    const pingResult = await ping(host.address, count);

    const createdPing = await Ping.create({ ...pingResult, host });

    return res.json(createdPing);
  } catch (error) {
    throw new HttpError('Unable to create a ping for a host');
  }
});

/**
 * @swagger
 * /hosts/{hostId}/pings:
 *   get:
 *     summary: Listar todos os pings de um host específico
 *     tags: [Pings]
 *     parameters:
 *       - in: path
 *         name: hostId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único do host
 *     responses:
 *       200:
 *         description: Lista de pings do host
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ping'
 *       400:
 *         description: Erro ao buscar pings do host
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/hosts/:hostId/pings', async (req, res) => {
  const { hostId: id } = req.params;

  try {
    const pings = await Ping.read({ host: { id } });

    return res.json(pings);
  } catch (error) {
    throw new HttpError('Unable to read pings by host');
  }
});

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Listar todas as tags disponíveis
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: Lista de tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 *       400:
 *         description: Erro ao buscar tags
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/tags', async (req, res) => {
  try {
    const tags = await Tag.read();

    return res.json(tags);
  } catch (error) {
    throw new HttpError('Unable to read tags');
  }
});

/**
 * @swagger
 * /tags/{tag}/hosts:
 *   get:
 *     summary: Listar hosts filtrados por uma tag específica
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: tag
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome da tag para filtrar hosts
 *         example: "production"
 *     responses:
 *       200:
 *         description: Lista de hosts com a tag especificada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Host'
 *       400:
 *         description: Erro ao buscar hosts por tag
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/tags/:tag/hosts', async (req, res) => {
  const { tag } = req.params;

  try {
    const host = await Host.read({ tags: tag });

    return res.json(host);
  } catch (error) {
    throw new HttpError('Unable to read hosts by tag');
  }
});

/**
 * @swagger
 * /pings:
 *   get:
 *     summary: Listar todos os pings de todos os hosts
 *     tags: [Pings]
 *     responses:
 *       200:
 *         description: Lista completa de pings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ping'
 *       400:
 *         description: Erro ao buscar pings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/pings', async (req, res) => {
  try {
    const pings = await Ping.read();

    return res.json(pings);
  } catch (error) {
    throw new HttpError('Unable to read pings');
  }
});

// Error handling for 404
router.use((req, res, next) => {
  return res.status(404).json({ message: 'Content not found!' });
});

// Error handling middleware
router.use((err, req, res, next) => {
  // console.error(err.stack);

  if (err instanceof HttpError) {
    return res.status(err.code).json({ message: err.message });
  }

  return res.status(500).json({ message: 'Something broke!' });
});

export default router;
