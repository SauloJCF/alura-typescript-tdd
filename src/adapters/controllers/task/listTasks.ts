import { ListTasks } from "../../../usecases/listTasks";
import { Controller, HttpRequest, HttpResponse } from "../../interfaces";
import { noContent, serverError } from "../../presentations/api/httpResponses/httpResponses";

export class ListTasksController implements Controller {
    constructor(private readonly listTasks: ListTasks) { }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            await this.listTasks.list();

            return noContent();
            
        } catch (error: any) {
          return serverError(error);   
        }
    }

}