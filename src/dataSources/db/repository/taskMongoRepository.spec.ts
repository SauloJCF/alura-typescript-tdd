import { MongoManager } from "../../config/mongoManager";
import { TaskMongoRepository } from "./taskMongoRepository";

const makeSut = (): TaskMongoRepository => {
    return new TaskMongoRepository();
}

describe('TaskMongoRepository', () => {
    const client = MongoManager.getInstance();

    beforeAll(async () => {
        await client.connect(process.env.MONGO_URL as string);
    });

    afterAll(async () => {
        await client.disconnect();
    });

    test('Deve criar task corretamente', async () => {
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

        await sut.delete({ id: task.id });
    });

    test('Deve listar tasks corretamente', async () => {
        const sut = makeSut();

        const novaTask = await sut.add({
            title: 'any_title',
            description: 'any_description',
            date: 'any_date',
        });

        const tasks = await sut.list();

        expect(tasks[0].id).toBeTruthy();
        expect(tasks[0].title).toBe('any_title');
        expect(tasks[0].description).toBe('any_description');
        expect(tasks[0].date).toBe('any_date');
        expect(tasks.length).toBe(1);

        await sut.delete({ id: novaTask.id });
    });
});