import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Host from './models/Hosts.js';
import Ping from './models/Pings.js';
import Tag from './models/Tags.js';
import User from './models/Users.js';
import { ping } from './lib/ping.js';
import { isAuthenticated } from './middleware/auth.js';

class HttpError extends Error {
  constructor(message, code = 400) {
    super(message);
    this.code = code;
  }
}

/**
 * @swagger
 * tags:
 *   - name: Hosts
 *     description: API para gerenciamento de hosts
 *   - name: Pings
 *     description: API para execução e consulta de pings
 *   - name: Tags
 *     description: API para gerenciamento de tags
 *   - name: Users
 *     description: API para gerenciamento de usuários
 */
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
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Não autorizado - token ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 */
router.post('/hosts', isAuthenticated, async (req, res) => {
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de hosts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Host'
 *       401:
 *         description: Não autorizado - token ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 */
router.get('/hosts', isAuthenticated, async (req, res) => {
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
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Não autorizado - token ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 */
router.get('/hosts/:id', isAuthenticated, async (req, res) => {
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
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Não autorizado - token ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 */
router.put('/hosts/:id', isAuthenticated, async (req, res) => {
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Host deletado com sucesso
 *       400:
 *         description: Host não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado - token ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 */
router.delete('/hosts/:id', isAuthenticated, async (req, res) => {
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
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Não autorizado - token ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 */
router.post('/hosts/:hostId/pings/:count', isAuthenticated, async (req, res) => {
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
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Não autorizado - token ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 */
router.get('/hosts/:hostId/pings', isAuthenticated, async (req, res) => {
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
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Não autorizado - token ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 */
router.get('/tags', isAuthenticated, async (req, res) => {
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
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Não autorizado - token ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 */
router.get('/tags/:tag/hosts', isAuthenticated, async (req, res) => {
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
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Não autorizado - token ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 */
router.get('/pings', isAuthenticated, async (req, res) => {
  try {
    const pings = await Ping.read();

    return res.json(pings);
  } catch (error) {
    throw new HttpError('Unable to read pings');
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Criar um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Erro de validação - parâmetros obrigatórios não fornecidos ou email já em uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/users', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new HttpError('Error when passing parameters');
  }

  try {
    const createdUser = await User.create({ name, email, password });

    delete createdUser.password;

    res.status(201).json(createdUser);
  } catch (error) {
    if (
      error.message.toLowerCase().includes('unique') &&
      error.message.toLowerCase().includes('email')
    ) {
      throw new HttpError('Email already in use');
    }

    throw new HttpError('Unable to create a user');
  }
});

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Retorna os dados do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado - token ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 */
router.get('/users/me', isAuthenticated, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.readById(userId);

    delete user.password;

    return res.json(user);
  } catch (error) {
    throw new HTTPError('Unable to find user', 400);
  }
});

/**
 * @swagger
 * /users/signin:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@email.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Autenticação bem-sucedida, retorna o token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 auth:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: Token JWT
 *       401:
 *         description: Usuário não encontrado ou senha incorreta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 */
router.post('/users/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { id: userId, password: hash } = await User.read({ email });

    const match = await bcrypt.compare(password, hash);

    if (match) {
      const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: 3600 } // 1h
      );

      return res.json({ auth: true, token });
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(401).json({ error: 'User not found' });
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
