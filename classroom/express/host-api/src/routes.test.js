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

describe('Moniotr App', () => {
  describe('Hosts Endpoints', () => {
    describe('POST /api/hosts', () => {
      it('should create a new host', async () => {
        const response = await request(app).post('/api/hosts').send(newHost);

        createdHost = response.body;

        assert.strictEqual(response.statusCode, 201);
      });

      it('should not create a new host without name or address', async () => {
        const response = await request(app).post('/api/hosts').send({
          name: 'DNS Server',
        });

        assert.strictEqual(response.statusCode, 400);
      });
    });

    describe('GET /api/hosts', () => {
      it('should show all hosts', async () => {
        const response = await request(app).get('/api/hosts');

        assert.strictEqual(response.statusCode, 200);
      });

      it('should list the valid host', async () => {
        const response = await request(app).get('/api/hosts');

        const hasValidHost = response.body.some(
          (host) => host.address === createdHost.address
        );

        assert.ok(hasValidHost);
      });

      it('should show all hosts by name', async () => {
        const response = await request(app).get('/api/hosts?name=DNS');

        assert.strictEqual(response.statusCode, 200);
      });
    });

    describe('GET /api/hosts/:hostId', () => {
      it('should show a host by id', async () => {
        const response = await request(app).get(`/api/hosts/${createdHost.id}`);

        assert.strictEqual(response.statusCode, 200);

        assert.strictEqual(response.body.name, createdHost.name);
      });

      it('should not show a host with invalid id', async () => {
        const response = await request(app).get(`/api/hosts/x`);

        assert.strictEqual(response.statusCode, 400);

        assert.strictEqual(response.body.message, 'Unable to read a host');
      });
    });

    describe('PUT /api/hosts/:hostId', () => {
      it('should update a host', async () => {
        const response = await request(app)
          .put(`/api/hosts/${createdHost.id}`)
          .send(updatedHost);

        assert.strictEqual(response.statusCode, 200);
      });

      it('should list an updated host', async () => {
        const response = await request(app).get('/api/hosts');

        const hasValidHost = response.body.some(
          (host) => host.address === updatedHost.address
        );

        assert.ok(hasValidHost);
      });

      it('should not update a host without name or address', async () => {
        const response = await request(app)
          .put(`/api/hosts/${createdHost.id}`)
          .send({
            name: 'Cloudflare DNS',
          });

        assert.strictEqual(response.statusCode, 400);
      });

      it('should not update a host with invalid id', async () => {
        const response = await request(app).put(`/api/hosts/x`).send(updatedHost);

        assert.strictEqual(response.statusCode, 400);

        assert.strictEqual(response.body.message, 'Unable to update a host');
      });
    });

    describe('DELETE /api/hosts/:hostId', () => {
      it('should remove a host', async () => {
        const response = await request(app).delete(`/api/hosts/${createdHost.id}`);

        assert.strictEqual(response.statusCode, 204);
      });

      it('should not delete a host with invalid id', async () => {
        const response = await request(app).delete(`/api/hosts/x`);

        assert.strictEqual(response.statusCode, 400);

        assert.strictEqual(response.body.message, 'Unable to delete a host');
      });
    });
  });

  describe('Host Ping Endpoints', () => {
    describe('POST /api/hosts/:hostId/pings/:count', () => {
      it('should create a ping with valid host', async () => {
        let response = await request(app).post('/api/hosts').send(newHost);

        createdHost = response.body;

        response = await request(app).post(`/api/hosts/${createdHost.id}/pings/3`);

        assert.strictEqual(response.statusCode, 200);

        assert.strictEqual(Array.isArray(response.body.icmps), true);
        assert.strictEqual(response.body.icmps.length, 3);
      });

      it('should not create a ping with unknown ip', async () => {
        let response = await request(app)
          .post('/api/hosts')
          .send({ name: 'unknown host', address: '172.16.0.1' });

        createdHost = response.body;

        response = await request(app).post(`/api/hosts/${createdHost.id}/pings/3`);

        assert.strictEqual(response.statusCode, 400);
      });

      it('should not create a ping with unknown domain', async () => {
        let response = await request(app)
          .post('/api/hosts')
          .send({ name: 'unknown host', address: 'www.unknown-host.com.br' });

        createdHost = response.body;

        response = await request(app).post(`/api/hosts/${createdHost.id}/pings/3`);

        assert.strictEqual(response.statusCode, 400);
      });
    });

    describe('GET /api/hosts/:hostId/pings', () => {
      it('should show a ping by hostId', async () => {
        const response = await request(app).get(
          `/api/hosts/${createdHost.id}/pings`
        );

        assert.strictEqual(response.statusCode, 200);
      });
    });
  });

  describe('Tag Endpoints', () => {
    describe('GET /api/tags', () => {
      it('should show tags', async () => {
        const response = await request(app).get(`/api/tags`);

        assert.strictEqual(response.statusCode, 200);
      });
    });

    describe('GET /api/tags/:tagName/hosts', () => {
      it('should show hosts by tagName', async () => {
        const response = await request(app).get(
          `/api/tags/${createdHost.id}/hosts`
        );

        assert.strictEqual(response.statusCode, 200);
      });
    });
  });

  describe('Ping Endpoints', () => {
    describe('GET /api/pings', () => {
      it('should show pings', async () => {
        const response = await request(app).get(`/api/pings`);

        assert.strictEqual(response.statusCode, 200);
      });
    });
  });
});
