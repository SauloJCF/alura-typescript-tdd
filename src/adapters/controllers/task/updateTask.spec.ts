import { Task } from "../../../entities/task";
import { UpdateTask, UpdateTaskModel } from "../../../usecases/udpateTask";
import { HttpRequest, Validation } from "../../interfaces";
import { MissingParamError } from "../../presentations/api/errors";
import { badRequest, noContent, serverError } from "../../presentations/api/httpResponses/httpResponses";
import { UpdateTaskController } from "./updateTask";

const BODY = {
    title: "any_title",
    description: "any_description",
    date: "30/06/2024",
};

const makeFakeRequest = (): HttpRequest => {
    return {
        body: {
            ...BODY
        },
        params: {
            id: 'any_id'
        }
    };
}

interface SutTypes {
    sut: UpdateTaskController;
    updateTaskStub: UpdateTask;
    validationStub: Validation;
}

const makeSut = (): SutTypes => {
    const updateTaskStub = makeUpdateTaskStub();
    const validationStub = makeValidationStub();

    const sut = new UpdateTaskController(updateTaskStub, validationStub);
    return {
        sut,
        updateTaskStub,
        validationStub
    };
}

const makeUpdateTaskStub = (): UpdateTask => {
    class UpdateTasksStub implements UpdateTask {
        update(task: UpdateTaskModel): Promise<Error | void> {
            return Promise.resolve();
        }
    }
    return new UpdateTasksStub();
}

const makeValidationStub = (): Validation => {
    class ValidationStub implements Validation {
        validate(data: any): Error | void {
            return;
        }
    }

    return new ValidationStub();
}

describe('UpdateTask', () => {
    test('Deve retornar 204 em caso de sucesso', async () => {
        const { sut } = makeSut();

        const taskUpdated = await sut.handle(makeFakeRequest());

        expect(taskUpdated).toEqual(noContent());
    });

    test('Deve retornar 500 se UpdateTask for lançado', async () => {
        const { sut, updateTaskStub } = makeSut();

        jest
            .spyOn(updateTaskStub, 'update')
            .mockImplementationOnce(async () => Promise.reject(new Error()));

        const taskUpdated = await sut.handle(makeFakeRequest());

        expect(taskUpdated).toEqual(serverError(new Error()));
    });

    test('Deve retornar 400 se a validação falhar', async () => {
        const { sut, validationStub } = makeSut();

        jest
            .spyOn(validationStub, "validate")
            .mockReturnValueOnce(new MissingParamError("any_field"));

        const taskUpdated = await sut.handle(makeFakeRequest());

        expect(taskUpdated).toEqual(badRequest(new MissingParamError("any_field")));
    });

    test('Deve chamar UpdateTask com os valores corretos quando apenas uma parte da solicitação for enviada', async () => {
        const { sut, updateTaskStub } = makeSut();

        const updateSpy = jest.spyOn(updateTaskStub, 'update');

        const httpRequest = {
            params: {
                id: "valid_id",
            },
            body: {
                title: "valid_title"
            }
        };

        await sut.handle(httpRequest);

        expect(updateSpy).toHaveBeenCalledWith({
            id: "valid_id",
            title: "valid_title"
        })
    });

    test('Deve chamar UpdateTask com os valores corretos quando a solicitação completa for enviada', async () => {
        const { sut, updateTaskStub } = makeSut();

        const updateSpy = jest.spyOn(updateTaskStub, 'update');

        const httpRequest = {
            params: {
                id: "valid_id",
            },
            body: {
                title: "valid_title",
                description: "valid_description",
                date: "new_date"
            }
        };

        await sut.handle(httpRequest);

        expect(updateSpy).toHaveBeenCalledWith({
            id: "valid_id",
            title: "valid_title",
            description: "valid_description",
            date: "new_date"
        })
    });
});