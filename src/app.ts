import * as Koa from 'koa';
import * as Router from '@koa/router';
import * as bodyParser from 'koa-bodyparser';
import * as logger from 'koa-logger';
import { HttpError } from "./types/error";
import { initTaskJson, mergeTaskJson, isTaskJson } from "task.json";

const app = new Koa();
app.use(bodyParser());
app.use(logger());

// Universal error handler (this middleware should be before other routes)
app.use(async (ctx, next) => {
	try {
		await next();
	}
	catch (err) {
		if (err instanceof HttpError) {
			ctx.throw(err.status, err.message);
		}
		else {
			throw err;
		}
	}
});


const router = new Router();
// Local store
let localTaskJson = initTaskJson();

// Download only
router.get("/", async ctx => {
	ctx.body = localTaskJson;
});

// Upload only
router.put("/", async ctx => {
	try {
		const taskJson = JSON.parse(ctx.request.body);
		if (!isTaskJson(taskJson)) {
			throw new HttpError(400, "Invalid TaskJson format");
		}
		localTaskJson = taskJson;
		ctx.status = 200;
	}
	catch (error) {
		throw new HttpError(400, "Invalid JSON format");
	}
});

// Sync
router.patch("/", async ctx => {
	try {
		const taskJson = JSON.parse(ctx.request.body);
		if (!isTaskJson(taskJson)) {
			throw new HttpError(400, "Invalid TaskJson format");
		}
		localTaskJson = mergeTaskJson(localTaskJson, taskJson);
		ctx.body = localTaskJson;
	}
	catch (error) {
		throw new HttpError(400, "Invalid JSON format");
	}
});

// Clear remote
router.delete("/", async ctx => {
	localTaskJson = initTaskJson();
	ctx.status = 200;
});


app.use(router.routes());
app.use(router.allowedMethods());

export default app;
