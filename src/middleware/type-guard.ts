import * as Koa from "koa";
import { HttpError } from "../types/error";
import { isTaskJson } from "task.json";

export const taskJsonTypeGuard = async (ctx: Koa.Context, next: () => Promise<any>) => {
	const taskJson = ctx.request.body;
	if (!isTaskJson(taskJson)) {
		throw new HttpError(400, "Invalid TaskJson format");
	}
	await next();
}
