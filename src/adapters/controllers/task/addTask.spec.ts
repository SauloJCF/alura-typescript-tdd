import { Task } from "../../../entities/task";
import { AddTask, AddTaskModel } from "../../../usecases";
import { Validation } from "../../interfaces";
import { AddTaskController } from "./addTask";

const BODY = {
  title: "any_title",
  description: "any_description",
  date: "30/06/2024",
};

class AddTaskStub implements AddTask {
  async add(task: AddTaskModel): Promise<Task> {
    return Promise.resolve({
      id: "any",
      ...BODY
    });
  }
}

class ValidationStub implements Validation {
  validate(data: any): Error | void {
    return;
  }
}

describe("AddTask Controller", () => {
  test("Deve chamar AddTask com valores corretos", async () => {
    const httpRequest = {
      body: {
        ...BODY
      },
    };

    const addTaskStub = new AddTaskStub();

    const addTaskController = new AddTaskController(
      addTaskStub,
      new ValidationStub()
    );

    const addTaskSpy = jest.spyOn(addTaskStub, "add");

    await addTaskController.handle(httpRequest);

    expect(addTaskSpy).toHaveBeenCalledWith(BODY);
  });
});
