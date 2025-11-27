import type { Request, Response } from "express";
import { isEmpty } from "radash";
type Resource = {
    id: number,
    email: string,
    resource: string,
    reason: string,
    status: "PENDING" | "APPROVED" | "REJECTED"
    createdAt: Date,
    updatedAt: Date,
}
type ServerError = {
    err: string,
    message: string
}
class RequestController {
    id: number;
    requests: Array<Resource>;
    constructor() {
        this.id = 0;
        this.requests = [];
        this.getRequests = this.getRequests.bind(this);
        this.addRequest = this.addRequest.bind(this);
        this.updateRequest = this.updateRequest.bind(this);
    }
    getRequests(req: Request<unknown, unknown, unknown, Pick<Resource, "status">>, res: Response<Array<Resource>>) {
        const { query: filters } = req;
        const status = isEmpty(filters.status) ? ["PENDING", "APPROVED", "REJECTED"] : filters.status.split(",");
        const result = this.requests.filter(r => status.includes(r.status))
        return res.status(200).send(result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    }
    addRequest(req: Request<unknown, unknown, Resource, unknown>, res: Response<Resource | ServerError>) {
        const { body: payload } = req;
        if (!payload) {
            return res.status(404);
        }
        const existingEmail = this.requests.filter(r => payload.email == r.email && r.status == "PENDING")
        if (existingEmail.length > 3) {
            return res.status(412).send({
                err: "Bulk Request",
                message: "Total number of request exceeded"
            });
        }
        const existRequest = existingEmail.find(r => payload.resource == r.resource)
        if (existRequest) {
            return res.status(412).send({
                err: "Duplicate Request",
                message: "Request alreayd exists!"
            });
        }
        this.id = this.id + 1;
        const request: Resource = {
            ...payload,
            id: this.id,
            status: "PENDING",
            createdAt: new Date(),
        }
        this.requests.push(request);
        return res.status(201).send(request);
    }
    updateRequest(req: Request<{ id: number }, unknown, Pick<Resource, "status">, unknown>, res: Response<Resource | ServerError>) {
        const { params: { id }, body: payload } = req;
        const request = this.requests.find(r => r.id == id && r.status == "PENDING");
        if (!request) {
            return res.status(404).send({
                err: "Not Found",
                message: "Id doesn't exisits"
            })
        }
        request.status = payload.status;
        request.updatedAt = new Date();
        return res.status(200).send(request);
    }
}

export default new RequestController();