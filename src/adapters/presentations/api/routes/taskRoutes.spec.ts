import { MongoManager } from "../../../../dataSources/config/mongoManager";
import request from 'supertest';
import app from "../config/app";

describe('TaskRoute', () => {
    const client = MongoManager.getInstance();

    beforeAll(async () => {
        await client.connect(process.env.MONGO_URL as string);
    });

    afterAll(async () => {
        await client.disconnect();
    });

    test('Deve retornar 204 se lista estiver vazia', async () => {
        await request(app).get('/api/tasks').expect(204);
    });
});