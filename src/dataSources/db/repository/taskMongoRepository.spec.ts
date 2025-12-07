import { MongoManager } from "../../config/mongoManager";
import { TaskMongoRepository } from "./taskMongoRepository";

const makeSut = (): TaskMongoRepository => {
    return new TaskMongoRepository();
}

describe('TaskMongoRepository', () => {
    const client = MongoManager.getInstance();

    beforeAll(async() => {
        await client.connect(process.env.MONGO_URL as string);
    });

    afterAll(async() => {
        await client.disconnect();
    });

    test('Deve criar task corretamente', async() => {
        const sut = makeSut();

        const task = await sut.add({
            title: 'any_title',
            description: 'any_description',
            date: 'any_date',
        });

        expect(task.id).toBeTruthy();

        expect(task.title).toBe('any_title');
        expect(task.description).toBe('any_description');
        expect(task.date).toBe('any_date');
    });
});