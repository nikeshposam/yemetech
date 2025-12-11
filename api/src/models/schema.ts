import { int, sqliteTable, text, } from "drizzle-orm/sqlite-core";

export const resourceModel = sqliteTable("resources", {
    id: int().primaryKey({ autoIncrement: true }),
    email: text().notNull(),
    resource: text().notNull(),
    reason: text(),
    status: text({ enum: ["PENDING", "APPROVED", "REJECTED"] }).notNull(),
    createdAt: int({ mode: "timestamp" }).notNull(),
    updatedAt: int({ mode: "timestamp" }),
});