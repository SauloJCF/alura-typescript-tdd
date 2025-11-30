import { Task } from "../../../entities/task";
import { AddTask, AddTaskModel } from "../../../usecases";
import { HttpRequest, Validation } from "../../interfaces";
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
    const httpRequest = makeFakeRequest();

    const { addTaskStub, sut } = makeSut();

    const addTaskSpy = jest.spyOn(addTaskStub, "add");

    await sut.handle(httpRequest);

    expect(addTaskSpy).toHaveBeenCalledWith(BODY);
  });
});
