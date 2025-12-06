import { Task } from "../../../entities/task";
import { ListTasks } from "../../../usecases/listTasks";
import { serverError, noContent, ok } from "../../presentations/api/httpResponses/httpResponses";
import { ListTasksController } from './listTasks';

interface SutTypes {
    sut: ListTasksController;
    listTasksStub: ListTasks;
}

const makeListTasksStub = (): ListTasks => {
    class ListTasksStub implements ListTasks {
        async list(): Promise<Task[]> {
            return Promise.resolve(makeFakeTask());
        }
    }

    return new ListTasksStub();
}

const makeSut = (): SutTypes => {
    const listTasksStub = makeListTasksStub();

    const sut = new ListTasksController(listTasksStub);

    return { sut, listTasksStub };
};

const makeFakeTask = (): Task[] => {
    return [
        {
            id: 'any_id',
            title: 'any_title',
            description: 'any_description',
            date: 'any_date',
        },
        {
            id: 'other_id',
            title: 'other_description',
            description: 'other_description',
            date: 'other_date',
        }
    ];
};

describe('ListTasks Controller', () => {
    test('Retornar 204 se a lista estiver vazia', async () => {
        const { sut } = makeSut();
        const taskList = await sut.handle({});
        expect(taskList).toEqual(noContent());
    });

    test('Retornar 200 com uma lista de tarefas', async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.handle({});
        expect(httpResponse).toEqual(ok(makeFakeTask()))
    });

    test('Retornar status 500 em caso de erro', async () => {
        const { sut, listTasksStub } = makeSut();

        jest
            .spyOn(listTasksStub, "list")
            .mockImplementationOnce(async () => Promise.reject(new Error()));

        const httpResponse = await sut.handle({});

        expect(httpResponse).toEqual(serverError(new Error));
    });
}); 