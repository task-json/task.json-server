import * as Koa from 'koa';
import * as Router from '@koa/router';
import * as bodyParser from 'koa-bodyparser';
import * as logger from 'koa-logger';
import { HttpError } from "./types/error";
import { initTaskJson, mergeTaskJson, isTaskJson } from "task.json";
import { taskJsonTypeGuard } from "./middleware/type-guard";
import { loadTaskJson, saveTaskJson } from './utils/task';

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
let localTaskJson = loadTaskJson();

// Download only
router.get("/", async ctx => {
	ctx.body = localTaskJson;
});

// Upload only
router.put("/", taskJsonTypeGuard, async ctx => {
	const taskJson = ctx.request.body;
	localTaskJson = taskJson;
	saveTaskJson(localTaskJson);
	ctx.status = 200;
});

// Sync
router.patch("/", taskJsonTypeGuard, async ctx => {
	const taskJson = ctx.request.body;
	localTaskJson = mergeTaskJson(localTaskJson, taskJson);
	saveTaskJson(localTaskJson);
	ctx.body = localTaskJson;
});

// Clear remote
router.delete("/", async ctx => {
	localTaskJson = initTaskJson();
	saveTaskJson(localTaskJson);
	ctx.status = 200;
});

app.use(router.routes());
app.use(router.allowedMethods());

export default app;
