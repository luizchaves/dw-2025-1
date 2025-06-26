import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { hosts } from './data/hosts.js';

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
router.post('/hosts', (req, res) => {
  const { name, address } = req.body;

  if (!name || !address) {
    throw new HttpError('Error when passing parameters');
  }

  const id = uuidv4();

  const newHost = { id, name, address };

  hosts.push(newHost);

  res.status(201).json(newHost);
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
router.get('/hosts', (req, res) => {
  const where = req.query;

  if (where) {
    const field = Object.keys(where)[0];

    const value = where[field];

    const filteredHosts = hosts.filter((host) =>
      host[field] instanceof String
        ? host[field].toLowerCase().includes(value.toLowerCase())
        : host[field] == value
    );

    return res.json(filteredHosts);
  }

  return res.json(hosts);
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
router.get('/hosts/:id', (req, res) => {
  const { id } = req.params;

  const index = hosts.findIndex((host) => host.id === id);

  if (!hosts[index]) {
    throw new HttpError('Unable to read a host');
  }

  return res.json(hosts[index]);
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
router.put('/hosts/:id', (req, res) => {
  const { name, address } = req.body;

  const { id } = req.params;

  if (!name || !address) {
    throw new HttpError('Error when passing parameters');
  }

  const newHost = { id, name, address };

  const index = hosts.findIndex((host) => host.id === id);

  if (!hosts[index]) {
    throw new HttpError('Unable to update a host');
  }

  hosts[index] = newHost;

  return res.json(newHost);
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
router.delete('/hosts/:id', (req, res) => {
  const { id } = req.params;

  const index = hosts.findIndex((host) => host.id === id);

  if (!hosts[index]) {
    throw new HttpError('Unable to delete a host');
  }

  hosts.splice(index, 1);

  return res.status(204).end();
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
