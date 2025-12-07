import { Task } from "../../entities/task";
import { ListTasks } from "../../usecases/listTasks";
import { ListTasksRepository } from "../../usecases/repository/listTasksRepository";

export class DbListTasks implements ListTasks {
    constructor(private readonly lisTasksRepository: ListTasksRepository) {}
    
    
    async list(): Promise<Task[]> {
        return await this.lisTasksRepository.list();
    }

}