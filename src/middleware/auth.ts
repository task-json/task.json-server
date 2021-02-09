import * as Koa from "koa";
import { HttpError } from "../types/error";

export const session = async (ctx: Koa.Context, next: () => Promise<any>) => {
	ctx.token = ctx.headers["authorization"]?.split(" ").pop();
	await next();
}

// Valid tokens
export const tokens: string[] = [];

export const auth = async (ctx: Koa.Context, next: () => Promise<any>) => {
	if (!ctx.token || !tokens.includes(ctx.token))
		throw new HttpError(401, "Login required");
	await next();
}
