import { Task } from "../../../entities/task";
import { AddTask, AddTaskModel } from "../../../usecases";
import { HttpRequest, Validation } from "../../interfaces";
import { MissingParamError } from "../../presentations/api/errors/missing-param-error";
import { badRequest, serverError } from "../../presentations/api/httpResponses/httpResponses";
import { AddTaskController } from "./addTask";

const BODY = {
  title: "any_title",
  description: "any_description",
  date: "30/06/2024",
};

const makeAddTaskStub = (): AddTask => {
  class AddTaskStub implements AddTask {
    async add(task: AddTaskModel): Promise<Task> {
      return Promise.resolve({
        id: "any",
        ...BODY
      });
    }
  }
  return new AddTaskStub();
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(data: any): Error | void {
      return;
    }
  }
  return new ValidationStub();
}

interface SubTypes {
  addTaskStub: AddTask,
  validationStub: Validation,
  sut: AddTaskController
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      ...BODY
    },
  };
}

const makeSut = (): SubTypes => {
  const addTaskStub = makeAddTaskStub();
  const validationStub = makeValidationStub();
  const sut = new AddTaskController(
    addTaskStub,
    validationStub
  );

  return {
    addTaskStub,
    validationStub,
    sut
  };
}

describe("AddTask Controller", () => {
  test("Deve chamar AddTask com valores corretos", async () => {
    const { addTaskStub, sut } = makeSut();

    const httpRequest = makeFakeRequest();

    const addTaskSpy = jest.spyOn(addTaskStub, "add");

    await sut.handle(httpRequest);

    expect(addTaskSpy).toHaveBeenCalledWith(BODY);
  });

  test("Deve retornar 500 se addTask lançar uma exceção", async () => {
    const { addTaskStub, sut } = makeSut();
    const httpRequest = makeFakeRequest();

    jest
      .spyOn(addTaskStub, "add")
      .mockImplementationOnce(async () => Promise.reject(new Error()));

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()))
  });

  test("Deve chamar validation com valores corretos", async () => {
    const { validationStub, sut } = makeSut();

    const httpRequest = makeFakeRequest();

    const validationSpy = jest.spyOn(validationStub, "validate");

    await sut.handle(httpRequest);

    expect(validationSpy).toHaveBeenCalledWith(BODY);
  });

  test("Deve retornar 500 se validateTask lançar uma exceção", async () => {
    const { validationStub, sut } = makeSut();
    const httpRequest = makeFakeRequest();

    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"));

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError("any_field")));
  });
});

