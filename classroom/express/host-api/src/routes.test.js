import { describe, it } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from './index.js';

let createdHost;

const newHost = {
  name: 'DNS Server',
  address: '1.1.1.1',
};

const updatedHost = {
  name: 'Cloudflare DNS',
  address: '1.1.1.1',
  tags: ['DNS', 'Cloudflare'],
};

let createdUser;

const validUser = {
  name: 'João Silva',
  email: 'joao@example.com',
  password: 'minhasenha123',
};

const invalidUser = {
  name: 'Maria Oliveira',
  email: 'joao@example.com',
  password: 'outrasenha456',
};

async function loadToken(user) {
  const response = await request(app).post('/api/users/signin').send(user);

  return response.body.token;
}

describe('Monitor App', () => {
  describe('User Endpoints', () => {
    describe('POST /api/users', () => {
      it('should create a new user', async () => {
        const response = await request(app).post('/api/users').send(validUser);

        createdUser = response.body;

        assert.strictEqual(response.statusCode, 201);
        assert.strictEqual(response.body.name, validUser.name);
        assert.strictEqual(response.body.email, validUser.email);
        assert.strictEqual(response.body.password, undefined); // Password should not be returned
      });

      it('should not create a user without name', async () => {
        const response = await request(app).post('/api/users').send({
          email: 'test@example.com',
          password: 'password123',
        });

        assert.strictEqual(response.statusCode, 400);
        assert.strictEqual(response.body.message, 'Error when passing parameters');
      });

      it('should not create a user without email', async () => {
        const response = await request(app).post('/api/users').send({
          name: 'Test User',
          password: 'password123',
        });

        assert.strictEqual(response.statusCode, 400);
        assert.strictEqual(response.body.message, 'Error when passing parameters');
      });

      it('should not create a user without password', async () => {
        const response = await request(app).post('/api/users').send({
          name: 'Test User',
          email: 'test@example.com',
        });

        assert.strictEqual(response.statusCode, 400);
        assert.strictEqual(response.body.message, 'Error when passing parameters');
      });

      it('should not create a user with duplicate email', async () => {
        const response = await request(app).post('/api/users').send(invalidUser);

        assert.strictEqual(response.statusCode, 400);
        assert.strictEqual(response.body.message, 'Email already in use');
      });
    });

    describe('GET /api/users/me', () => {
      it('should not get the current user without token', async () => {
        const response = await request(app).get('/api/users/me');

        assert.strictEqual(response.statusCode, 401);
        assert.strictEqual(response.body.message, 'Token invalid.');
      });

      it('should get the current user', async () => {
        const token = await loadToken(validUser);

        const response = await request(app)
          .get('/api/users/me')
          .set('Authorization', `Bearer ${token}`);

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(response.body.email, validUser.email);
        assert.strictEqual(response.body.password, undefined);
      });
    });

    describe('POST /api/users/signin', () => {
      it('should sign in with valid credentials', async () => {
        const response = await request(app)
          .post('/api/users/signin')
          .send(validUser);

        assert.strictEqual(response.statusCode, 200);
        assert.ok(response.body.auth);
        assert.ok(response.body.token);
      });

      it('should not sign in with invalid credentials', async () => {
        const response = await request(app)
          .post('/api/users/signin')
          .send(invalidUser);

        assert.strictEqual(response.statusCode, 401);
        assert.strictEqual(response.body.error, 'User not found');
      });
    });
  });

  describe('Hosts Endpoints', () => {


    describe('POST /api/hosts', async () => {
      it('should not create a new host without login', async () => {
        const response = await request(app)
          .post('/api/hosts');

        assert.strictEqual(response.statusCode, 401);
      });

      it('should create a new host', async () => {
        const token = await loadToken(validUser);

        const response = await request(app)
          .post('/api/hosts')
          .set('Authorization', `Bearer ${token}`)
          .send(newHost);

        createdHost = response.body;

        assert.strictEqual(response.statusCode, 201);
      });

      it('should not create a host with same address', async () => {
        const token = await loadToken(validUser);

        const response = await request(app)
          .post('/api/hosts')
          .set('Authorization', `Bearer ${token}`)
          .send(newHost);

        assert.strictEqual(response.statusCode, 400);
        assert.strictEqual(response.body.message, 'Unable to create a host');
      });

      it('should create a new host with tags', async () => {
        const token = await loadToken(validUser);

        const response = await request(app)
          .post('/api/hosts')
          .set('Authorization', 'bearer ' + token)
          .send({ name: 'Google DNS', address: '8.8.4.4', tags: ['DNS'] });

        const createdHostWithTags = response.body;

        assert.strictEqual(response.statusCode, 201);
        assert.ok(createdHostWithTags.tags.includes('DNS'));
      });

      it('should not create a new host without name or address', async () => {
        const token = await loadToken(validUser);

        const response = await request(app)
          .post('/api/hosts')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'DNS Server',
          });

        assert.strictEqual(response.statusCode, 400);
      });
    });

    describe('GET /api/hosts', async () => {
      it('should not show all hosts without login', async () => {
        const response = await request(app)
          .get('/api/hosts');

        assert.strictEqual(response.statusCode, 401);
      });

      it('should show all hosts', async () => {
        const token = await loadToken(validUser);

        const response = await request(app)
          .get('/api/hosts')
          .set('Authorization', `Bearer ${token}`);

        assert.strictEqual(response.statusCode, 200);
      });

      it('should list the valid host', async () => {
        const token = await loadToken(validUser);

        const response = await request(app)
          .get('/api/hosts')
          .set('Authorization', `Bearer ${token}`);

        const hasValidHost = response.body.some(
          (host) => host.address === createdHost.address
        );

        assert.ok(hasValidHost);
      });

      it('should show all hosts by name', async () => {
        const token = await loadToken(validUser);

        const response = await request(app)
          .get('/api/hosts?name=DNS')
          .set('Authorization', `Bearer ${token}`);

        assert.strictEqual(response.statusCode, 200);
      });
    });

    describe('GET /api/hosts/:hostId', async () => {
      it('should not show a host by id without login', async () => {
        const response = await request(app)
          .get(`/api/hosts/${createdHost.id}`);

        assert.strictEqual(response.statusCode, 401);
      });

      it('should show a host by id', async () => {
        const token = await loadToken(validUser);

        const response = await request(app)
          .get(`/api/hosts/${createdHost.id}`)
          .set('Authorization', `Bearer ${token}`);

        assert.strictEqual(response.statusCode, 200);

        assert.strictEqual(response.body.name, createdHost.name);
      });

      it('should not show a host with invalid id', async () => {
        const token = await loadToken(validUser);

        const response = await request(app)
          .get(`/api/hosts/x`)
          .set('Authorization', `Bearer ${token}`);

        assert.strictEqual(response.statusCode, 400);

        assert.strictEqual(response.body.message, 'Unable to read a host');
      });
    });

    describe('PUT /api/hosts/:hostId', async () => {
      it('should not update a host without login', async () => {
        const response = await request(app)
          .put(`/api/hosts/${createdHost.id}`);

        assert.strictEqual(response.statusCode, 401);
      });

      it('should update a host', async () => {
        const token = await loadToken(validUser);

        const response = await request(app)
          .put(`/api/hosts/${createdHost.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updatedHost);

        assert.strictEqual(response.statusCode, 200);
      });

      it('should list an updated host', async () => {
        const token = await loadToken(validUser);

        const response = await request(app)
          .get('/api/hosts')
          .set('Authorization', `Bearer ${token}`);

        const hasValidHost = response.body.some(
          (host) => host.address === updatedHost.address
        );

        assert.ok(hasValidHost);
      });

      it('should not update a host without name or address', async () => {
        const token = await loadToken(validUser);

        const response = await request(app)
          .put(`/api/hosts/${createdHost.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'Cloudflare DNS',
          });

        assert.strictEqual(response.statusCode, 400);
      });

      it('should not update a host with invalid id', async () => {
        const token = await loadToken(validUser);

        const response = await request(app)
          .put(`/api/hosts/x`)
          .set('Authorization', `Bearer ${token}`)
          .send(updatedHost);

        assert.strictEqual(response.statusCode, 400);

        assert.strictEqual(response.body.message, 'Unable to update a host');
      });
    });

    describe('DELETE /api/hosts/:hostId', async () => {
      it('should not remove a host without login', async () => {
        const response = await request(app)
          .delete(`/api/hosts/${createdHost.id}`);

        assert.strictEqual(response.statusCode, 401);
      });

      it('should remove a host', async () => {
        const token = await loadToken(validUser);

        const response = await request(app)
          .delete(`/api/hosts/${createdHost.id}`)
          .set('Authorization', `Bearer ${token}`);

        assert.strictEqual(response.statusCode, 204);
      });

      it('should not delete a host with invalid id', async () => {
        const token = await loadToken(validUser);

        const response = await request(app)
          .delete(`/api/hosts/x`)
          .set('Authorization', `Bearer ${token}`);

        assert.strictEqual(response.statusCode, 400);

        assert.strictEqual(response.body.message, 'Unable to delete a host');
      });
    });
  });

  describe('Host Ping Endpoints', () => {
    describe('POST /api/hosts/:hostId/pings/:count', async () => {
      it('should not create a ping with valid host without login', async () => {
        const response = await request(app)
          .post(`/api/hosts/${createdHost.id}/pings/3`);

        assert.strictEqual(response.statusCode, 401);
      });

      it('should create a ping with valid host', async () => {
        const token = await loadToken(validUser);

        let response = await request(app)
          .post('/api/hosts')
          .set('Authorization', `Bearer ${token}`)
          .send(newHost);

        createdHost = response.body;

        response = await request(app)
          .post(`/api/hosts/${createdHost.id}/pings/3`)
          .set('Authorization', `Bearer ${token}`);

        assert.strictEqual(response.statusCode, 200);

        assert.strictEqual(Array.isArray(response.body.icmps), true);
        assert.strictEqual(response.body.icmps.length, 3);
      });

      it('should not create a ping with unknown ip', async () => {
        const token = await loadToken(validUser);

        let response = await request(app)
          .post('/api/hosts')
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'unknown host', address: '172.16.0.1' });

        createdHost = response.body;

        response = await request(app)
          .post(`/api/hosts/${createdHost.id}/pings/3`)
          .set('Authorization', `Bearer ${token}`);

        assert.strictEqual(response.statusCode, 400);
      });

      it('should not create a ping with unknown domain', async () => {
        const token = await loadToken(validUser);

        let response = await request(app)
          .post('/api/hosts')
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'unknown host', address: 'www.unknown-host.com.br' });

        createdHost = response.body;

        response = await request(app)
          .post(`/api/hosts/${createdHost.id}/pings/3`)
          .set('Authorization', `Bearer ${token}`);

        assert.strictEqual(response.statusCode, 400);
      });
    });

    describe('GET /api/hosts/:hostId/pings', () => {
      it('should not show a ping by hostId without login', async () => {
        const response = await request(app).get(`/api/hosts/${createdHost.id}/pings`);

        assert.strictEqual(response.statusCode, 401);
      });

      it('should show a ping by hostId', async () => {
        const token = await loadToken(validUser);

        const response = await request(app)
          .get(`/api/hosts/${createdHost.id}/pings`)
          .set('Authorization', `Bearer ${token}`);

        assert.strictEqual(response.statusCode, 200);
      });
    });
  });

  describe.skip('Tag Endpoints', () => {
    describe('GET /api/tags', () => {
      it('should not show tags without login', async () => {
        const response = await request(app).get(`/api/tags`);

        assert.strictEqual(response.statusCode, 401);
      });

      it('should show tags', async () => {
        const token = await loadToken(validUser);

        const response = await request(app)
          .get(`/api/tags`)
          .set('Authorization', `Bearer ${token}`);

        assert.strictEqual(response.statusCode, 200);
      });
    });

    describe('GET /api/tags/:tagName/hosts', () => {
      it('should not show hosts by tagName without login', async () => {
        const response = await request(app).get(`/api/tags/${createdHost.id}/hosts`);

        assert.strictEqual(response.statusCode, 401);
      });

      it('should show hosts by tagName', async () => {
        const token = await loadToken(validUser);

        const response = await request(app)
          .get(`/api/tags/${createdHost.id}/hosts`)
          .set('Authorization', `Bearer ${token}`);

        assert.strictEqual(response.statusCode, 200);
      });
    });
  });

  describe.skip('Ping Endpoints', () => {
    describe('GET /api/pings', () => {
      it('should not show pings without login', async () => {
        const response = await request(app).get(`/api/pings`);

        assert.strictEqual(response.statusCode, 401);
      });

      it('should show pings', async () => {
        const token = await loadToken(validUser);

        const response = await request(app)
          .get(`/api/pings`)
          .set('Authorization', `Bearer ${token}`);

        assert.strictEqual(response.statusCode, 200);
      });
    });
  });

  describe.skip('404 Endpoints', () => {
    describe('GET /unknown-endpoint', () => {
      it('should return 404 for unknown endpoint', async () => {
        const response = await request(app).get(`/unknown-endpoint`);

        assert.strictEqual(response.statusCode, 404);
      });
    });
  });
});
