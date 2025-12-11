import type { Request, Response } from "express";
import { isEmpty } from "radash";
import db from "../models/config";
import { resourceModel } from "../models/schema";
import { and, eq } from "drizzle-orm";
type Resource = typeof resourceModel.$inferSelect;
type ServerError = {
    err: string,
    message: string
}
class RequestController {
    getRequests = async (req: Request<unknown, unknown, unknown, Pick<Resource, "status">>, res: Response<Array<Resource>>) => {
        const { query: filters } = req;
        const status = isEmpty(filters.status) ? ["PENDING", "APPROVED", "REJECTED"] : filters.status.split(",");
        const result = await db.database.select().from(resourceModel);
        return res.status(200).send(result);
    }
    addRequest = async (req: Request<unknown, unknown, Resource, unknown>, res: Response<Resource | ServerError>) => {
        const { body: payload } = req;
        if (!payload) {
            return res.status(404);
        }
        const existingEmail: Resource[] = await db.database.select().from(resourceModel).where(and(
            eq(resourceModel.email, payload.email),
            eq(resourceModel.status, 'PENDING')
        ));
        if (existingEmail.length > 3) {
            return res.status(412).send({
                err: "Bulk Request",
                message: "Total number of request exceeded"
            });
        }
        const existRequest = existingEmail.find((r) => payload.resource == r.resource)
        if (existRequest) {
            return res.status(412).send({
                err: "Duplicate Request",
                message: "Request alreayd exists!"
            });
        }
        const request: typeof resourceModel.$inferInsert = {
            ...payload,
            status: "PENDING",
            createdAt: new Date(),
        }
        const response = await db.database.insert(resourceModel).values(request).returning();
        return res.status(201).send(response);
    }
    updateRequest = async (req: Request<{ id: number }, unknown, Pick<Resource, "status">, unknown>, res: Response<Resource | ServerError>) => {
        const { params: { id }, body: payload } = req;
        const [request]: Resource[] = await db.database.select().from(resourceModel).where(and(
            eq(resourceModel.id, id),
            eq(resourceModel.status, 'PENDING')
        ));
        if (!request) {
            return res.status(404).send({
                err: "Not Found",
                message: "Id doesn't exisits"
            })
        }
        const [request_]: Resource[] = await db.database.update(resourceModel)
            .set({ status: payload.status, updatedAt: new Date() }).where(and(
                eq(resourceModel.id, id),
                eq(resourceModel.status, 'PENDING')
            ))
            .returning();
        return res.status(200).send(request_);
    }
}

export default new RequestController();