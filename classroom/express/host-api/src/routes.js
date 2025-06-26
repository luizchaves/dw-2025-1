import express from 'express';
import Host from './models/Hosts.js';

/**
 * @swagger
 * tags:
 *   name: Hosts
 *   description: API para gerenciamento de hosts
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
  const { name, address } = req.body;

  if (!name || !address) {
    throw new HttpError('Error when passing parameters');
  }

  try {
    const createdHost = await Host.create({ name, address });

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
  const { name, address } = req.body;

  const id = req.params.id;

  if (!name || !address) {
    throw new HttpError('Error when passing parameters');
  }

  try {
    const updatedHost = await Host.update({ id, name, address });

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
