import { UpdateTask } from "../../../usecases/udpateTask";
import { Controller, HttpRequest, HttpResponse, Validation } from "../../interfaces";
import { badRequest, noContent, ok, serverError } from "../../presentations/api/httpResponses/httpResponses";

export class UpdateTaskController implements Controller {
    constructor(
        private readonly updateTask: UpdateTask,
        private readonly validation: Validation
    ) { }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body);
            if (error) {
                return badRequest(error);
            }

            const { title, description, date } = httpRequest.body;
            const id = httpRequest.params.id;

            const erroAtualizar = await this.updateTask.update({
                id,
                title,
                description,
                date
            });

            if (erroAtualizar)
                return serverError(erroAtualizar);

            return noContent();
        } catch (error: any) {
            return serverError(error);
        }
    }

}